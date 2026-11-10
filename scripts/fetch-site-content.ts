import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'src/generated/site-content.json');
const publicDir = resolve(root, 'public/generated');
const api = 'https://portfolio-backend-107i.onrender.com/api';
const timeoutMs = 60_000;
const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif'];
const avatarEdge = 256;
const logoEdge = 96;

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

const existingPublicPath = (baseName: string) => {
  for (const ext of imageExtensions) {
    if (existsSync(resolve(publicDir, `${baseName}${ext}`))) {
      return `/generated/${baseName}${ext}`;
    }
  }

  return null;
};

const writeOptimized = async (
  bytes: Uint8Array,
  baseName: string,
  maxEdge: number,
) => {
  const optimized = await sharp(bytes)
    .rotate()
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  const legacyExt = baseName === 'avatar' ? '.png' : '.jpg';
  const legacy =
    legacyExt === '.png'
      ? await sharp(optimized).png().toBuffer()
      : await sharp(optimized).jpeg({ quality: 80 }).toBuffer();

  mkdirSync(publicDir, { recursive: true });

  for (const stale of imageExtensions) {
    if (stale === '.webp' || stale === legacyExt) continue;
    const stalePath = resolve(publicDir, `${baseName}${stale}`);
    if (existsSync(stalePath)) unlinkSync(stalePath);
  }

  writeFileSync(resolve(publicDir, `${baseName}.webp`), optimized);
  writeFileSync(resolve(publicDir, `${baseName}${legacyExt}`), legacy);
  return `/generated/${baseName}.webp`;
};

const readLocalImage = (url: string) => {
  const name = url.split('/').pop();
  if (!name) return null;

  const file = resolve(publicDir, name);
  if (!existsSync(file)) return null;

  return new Uint8Array(readFileSync(file));
};

const downloadImage = async (url: string, baseName: string, maxEdge: number) => {
  try {
    let bytes: Uint8Array | null = null;

    if (url.startsWith('/generated/')) {
      bytes = readLocalImage(url);
      if (!bytes) return existingPublicPath(baseName) ?? url;
    } else {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) throw new Error(`${url} responded ${response.status}`);
      bytes = new Uint8Array(await response.arrayBuffer());
    }

    return await writeOptimized(bytes, baseName, maxEdge);
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
      avatarEdge,
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
      logoEdge,
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
      await upgradeStoredImages();
      return;
    }

    console.error(message);
    process.exit(1);
  }
};

const upgradeStoredImages = async () => {
  const kept = JSON.parse(readFileSync(outFile, 'utf8')) as {
    linkedin: unknown;
  };
  await localizeImages(kept.linkedin);
  writeFileSync(outFile, `${JSON.stringify(kept, null, 2)}\n`);
  console.log(`optimized images in ${outFile}`);
};

if (process.argv.includes('--local')) {
  upgradeStoredImages().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  });
} else {
  main();
}
