import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'src/generated/site-content.json');
const api = 'https://portfolio-backend-3fya.onrender.com/api';
const timeoutMs = 60_000;

const getJson = async (path: string): Promise<unknown> => {
  const response = await fetch(`${api}${path}`, {
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`${path} responded ${response.status}`);
  }

  return response.json();
};

const main = async () => {
  try {
    const [linkedin, github] = await Promise.all([
      getJson('/linkedin/all'),
      getJson('/github/repos'),
    ]);

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
