import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'src/generated/site-content.json');
const publicDir = resolve(root, 'public/generated');
const api = 'https://portfolio-backend-107i.onrender.com/api';
const timeoutMs = 60_000;
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getJson = async (path: string): Promise<unknown> => {
  const response = await fetch(`${api}${path}`, {
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`${path} responded ${response.status}`);
  }

  return response.json();
};

const extensionFrom = (bytes: Uint8Array, contentType: string) => {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8) return '.jpg';
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return '.png';
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  ) {
    return '.webp';
  }
  if (bytes.length >= 3 && bytes[0] === 0x47 && bytes[1] === 0x49) return '.gif';

  const type = contentType.split(';')[0]?.trim().toLowerCase();
  if (type === 'image/png') return '.png';
  if (type === 'image/webp') return '.webp';
  if (type === 'image/gif') return '.gif';
  if (type === 'image/jpeg' || type === 'image/jpg') return '.jpg';

  return '.jpg';
};

const existingPublicPath = (baseName: string) => {
  for (const ext of imageExtensions) {
    if (existsSync(resolve(publicDir, `${baseName}${ext}`))) {
      return `/generated/${baseName}${ext}`;
    }
  }

  return null;
};

const downloadImage = async (url: string, baseName: string) => {
  if (url.startsWith('/generated/')) return url;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) throw new Error(`${url} responded ${response.status}`);

    const bytes = new Uint8Array(await response.arrayBuffer());
    const ext = extensionFrom(bytes, response.headers.get('content-type') ?? '');
    mkdirSync(publicDir, { recursive: true });

    for (const stale of imageExtensions) {
      if (stale === ext) continue;
      const stalePath = resolve(publicDir, `${baseName}${stale}`);
      if (existsSync(stalePath)) unlinkSync(stalePath);
    }

    writeFileSync(resolve(publicDir, `${baseName}${ext}`), bytes);
    return `/generated/${baseName}${ext}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const previous = existingPublicPath(baseName);
    if (previous) {
      console.warn(`image fetch failed, keeping ${previous}: ${message}`);
      return previous;
    }

    console.warn(`image fetch failed, keeping remote url: ${message}`);
    return url;
  }
};

const safeName = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '');

const localizeImages = async (linkedin: unknown) => {
  if (!isRecord(linkedin)) return;
  const details = linkedin.details;
  if (!isRecord(details)) return;
  const outer = details.data;
  if (!isRecord(outer)) return;
  const profile = outer.data;
  if (!isRecord(profile)) return;

  const basicInfo = profile.basic_info;
  if (isRecord(basicInfo) && typeof basicInfo.profile_picture_url === 'string') {
    basicInfo.profile_picture_url = await downloadImage(
      basicInfo.profile_picture_url,
      'avatar',
    );
  }

  if (!Array.isArray(profile.experience)) return;

  for (const item of profile.experience) {
    if (!isRecord(item) || typeof item.company_logo_url !== 'string') continue;
    const companyId =
      typeof item.company_id === 'string' || typeof item.company_id === 'number'
        ? safeName(String(item.company_id))
        : '';
    if (!companyId) continue;

    item.company_logo_url = await downloadImage(
      item.company_logo_url,
      `company-${companyId}`,
    );
  }
};

const main = async () => {
  try {
    const [linkedin, github] = await Promise.all([
      getJson('/linkedin/all'),
      getJson('/github/repos'),
    ]);

    await localizeImages(linkedin);
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(
      outFile,
      `${JSON.stringify(
        {
          fetchedAt: new Date().toISOString(),
          linkedin,
          github,
        },
        null,
        2,
      )}\n`,
    );
    console.log(`wrote ${outFile}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (existsSync(outFile)) {
      console.warn(`fetch failed, keeping previous snapshot: ${message}`);
      return;
    }

    console.error(message);
    process.exit(1);
  }
};

main();
