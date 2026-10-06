import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceUrl = 'https://ep00.epimg.net/infografias/encuestas40db/2026/10-barometro/2026_10_barometro_descargables.zip';
const files = [
  '01_Cuestionario_octubre_2026.pdf',
  '02_Nota_metodologica_octubre_2026.pdf',
  '03_Datos_octubre_2026.dta',
  '03_Datos_octubre_2026.sav',
  '03_Datos_octubre_2026.xlsx',
  '04_Tablas_octubre_2026.xlsx',
  '05_Informe_octubre_2026_vivienda.pdf',
  '05_Informe_octubre_2026_voto.pdf',
];

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../..');
const outputDir = join(repoRoot, 'data/polls/raw/40db/2026-10');
const mode = process.argv[2] ?? '--sync';

if (!['--sync', '--check'].includes(mode)) {
  throw new Error('Uso: node scripts/polls/sync-40db.mjs [--sync|--check]');
}

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const runUnzip = args => execFileSync('unzip', args, { maxBuffer: 16 * 1024 * 1024 });

const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(60_000) });
if (!response.ok) throw new Error(`Descarga fallida: HTTP ${response.status}`);

const archiveBytes = Buffer.from(await response.arrayBuffer());
if (archiveBytes.length === 0) throw new Error('La descarga está vacía.');

const tempDir = await mkdtemp(join(tmpdir(), '40db-octubre-2026-'));

try {
  const archivePath = join(tempDir, 'oficial.zip');
  await writeFile(archivePath, archiveBytes);
  runUnzip(['-tqq', archivePath]);

  const entries = runUnzip(['-Z1', archivePath])
    .toString('utf8')
    .split(/\r?\n/)
    .filter(name => name && !name.endsWith('/') && !name.startsWith('__MACOSX/') && name !== '.DS_Store');
  const entrySet = new Set(entries);
  const unexpected = entries.filter(name => !files.includes(name));
  const missing = files.filter(name => !entrySet.has(name));

  if (unexpected.length || missing.length || entrySet.size !== entries.length) {
    const details = [
      missing.length && `faltan: ${missing.join(', ')}`,
      unexpected.length && `sobran: ${unexpected.join(', ')}`,
      entrySet.size !== entries.length && 'hay entradas duplicadas',
    ].filter(Boolean).join('; ');
    throw new Error(`El contenido del ZIP no coincide con el conjunto esperado (${details}).`);
  }

  const downloaded = new Map();
  for (const name of files) {
    downloaded.set(name, runUnzip(['-p', archivePath, name]));
  }

  const comparisons = [];
  for (const name of files) {
    let localBytes;
    try {
      localBytes = await readFile(join(outputDir, name));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    const officialHash = hash(downloaded.get(name));
    const localHash = localBytes ? hash(localBytes) : null;
    comparisons.push({ name, officialHash, localHash, matches: officialHash === localHash });
  }

  if (mode === '--check') {
    for (const result of comparisons) {
      if (result.matches) {
        console.log(`OK ${result.name} sha256=${result.officialHash}`);
      } else if (result.localHash === null) {
        console.error(`FALTA ${result.name} sha256 oficial=${result.officialHash}`);
      } else {
        console.error(`DIFERENTE ${result.name} sha256 oficial=${result.officialHash} local=${result.localHash}`);
      }
    }

    const mismatchCount = comparisons.filter(result => !result.matches).length;
    if (mismatchCount) {
      console.error(`${mismatchCount} de ${files.length} archivos no coinciden con la fuente oficial.`);
      process.exitCode = 1;
    } else {
      console.log(`Los ${files.length} archivos locales coinciden byte por byte con el ZIP oficial.`);
    }
  } else {
    const changed = comparisons.filter(result => !result.matches);
    if (changed.length === 0) {
      console.log(`Los ${files.length} archivos ya están actualizados. No se modificó ningún archivo.`);
    } else {
      await mkdir(outputDir, { recursive: true });
      const stageDir = await mkdtemp(join(outputDir, '.40db-2026-10-'));
      try {
        for (const { name } of changed) {
          await writeFile(join(stageDir, name), downloaded.get(name));
        }
        for (const { name, officialHash } of changed) {
          await rename(join(stageDir, name), join(outputDir, name));
          console.log(`ACTUALIZADO ${name} sha256=${officialHash}`);
        }
      } finally {
        await rm(stageDir, { recursive: true, force: true });
      }
      console.log(`Descarga completada: ${changed.length} archivo(s) actualizado(s), ${files.length - changed.length} sin cambios.`);
    }
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
