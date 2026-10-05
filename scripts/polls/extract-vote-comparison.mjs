import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFile } from 'node:fs/promises';

export async function extractVoteComparison(path) {
  const task = getDocument({ data: new Uint8Array(await readFile(path)), useSystemFonts: true });
  const pdf = await task.promise;
  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const content = await (await pdf.getPage(pageNumber)).getTextContent();
      const text = content.items.map(item => item.str).filter(text => text?.trim());
      if (!text.includes('Resultado el 23J de 2023') || !text.includes('Otro + Blanco')) continue;
      const values = text.filter(text => /^\d+,\d$/.test(text)).map(text => Number(text.replace(',', '.')));
      const labels = text.filter(text => ['PP','PSOE','VOX','Vox','Sumar','Podemos','SALF','Otro + Blanco'].includes(text));
      const expected = ['PP','PSOE','VOX','Sumar','Otro + Blanco','PP','PSOE','Vox','Sumar','Podemos','SALF','Otro + Blanco'];
      if (values.some(value => !Number.isFinite(value) || value < 0 || value > 100) || values.length !== 12 || JSON.stringify(labels) !== JSON.stringify(expected)) throw new Error(`Unexpected vote comparison format in ${path}, page ${pageNumber}`);
      const rows = labels.map((label, index) => ({ key: label === 'VOX' ? 'Vox' : label === 'Otro + Blanco' ? 'electoralOther' : label, value: values[index] }));
      for (const series of [rows.slice(0,5), rows.slice(5)]) {
        if (Math.abs(series.reduce((sum,row) => sum + row.value, 0) - 100) > 0.2) throw new Error(`Invalid vote comparison total in ${path}`);
      }
      return { page: pageNumber, electionDate: '2023-07-23', election: rows.slice(0,5), current: rows.slice(5) };
    }
    throw new Error(`Missing vote comparison in ${path}`);
  } finally { await task.destroy(); }
}
