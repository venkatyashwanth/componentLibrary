import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'

const ambientTypesDirectory = new URL('../dist/types/types/', import.meta.url)
const publicEntry = new URL('../dist/types/index.d.ts', import.meta.url)

await mkdir(ambientTypesDirectory, { recursive: true })
await copyFile(
  new URL('../src/types/styles.d.ts', import.meta.url),
  new URL('../dist/types/types/styles.d.ts', import.meta.url),
)

const entryContents = await readFile(publicEntry, 'utf8')
const typeReference = '/// <reference path="./types/styles.d.ts" />\n'

if (!entryContents.startsWith(typeReference)) {
  await writeFile(publicEntry, `${typeReference}${entryContents}`)
}
