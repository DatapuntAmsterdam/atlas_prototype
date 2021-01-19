const { promises, writeFile, appendFile } = require('fs')
const { exec } = require('child_process')

type FileResult = {
  name: string
  path: string
  apiName: string
}

type DirectoryResult = {
  results: DirectoryResult[] | FileResult[]
  group: string
}

const FILE = './src/api/index.ts'

function camelize(str?: string) {
  return str
    ? str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, '')
    : null
}

async function getFiles(path: string = './src/api/'): Promise<Array<DirectoryResult | FileResult>> {
  const entries = await promises.readdir(path, { withFileTypes: true })

  // Get files within the current directory and add a path key to the file objects
  const isOnlyFiles = entries.every((file: any) => !file.isDirectory())
  const files = isOnlyFiles
    ? entries
        .filter((file: any) => !file.isDirectory() && file.name === 'index.ts')
        .map((file: any) => ({
          ...file,
          path,
          apiName: camelize(path.match(/([^/]*)\/*$/)?.[1].replace('-', ' ')),
        }))
    : []

  const folders = entries.filter((folder: any) => folder.isDirectory())

  const newFiles = await Promise.all(
    folders.map(async (folder: any) => {
      const results = await getFiles(`${path}${folder.name}/`)
      return {
        results,
        path: `${path}${folder.name}`,
        group: folder.name,
      }
    }),
  )

  return [...files, ...newFiles.flat()]
}
const createImport = (res: Array<FileResult | DirectoryResult>): string[] => {
  return res
    .map((value) => {
      if ('apiName' in value) {
        return `import * as ${value.apiName} from './${value.path
          .split('./src/api/')
          ?.pop()
          ?.slice(0, -1)}'`
      }
      return createImport(value.results).flat()
    })
    .flat()
}

const createExport = (res: Array<FileResult | DirectoryResult>): string[] => {
  return res
    .map((value) => {
      if ('apiName' in value) {
        return `
            ${value.apiName}: {
              selector: '${value.apiName}',
              ...${value.apiName},
            }
            `
      }
      return createExport(value.results).flat()
    })
    .flat()
}

getFiles().then(async (result) => {
  const imports = createImport(result)
  const exports = createExport(result)
  await writeFile(
    FILE,
    `${imports.join(`\n`)}
        \n
        type ApiConfig = {
        selector: string
        singleFixture: any
        listFixture?: any
        path: string | null
        fixtureId: string | null
      }

      function typeHelper<K extends PropertyKey>(obj: Record<K, ApiConfig>): Record<K, ApiConfig> {
        return obj
      }
      \n`,
    async (err: Error) => {
      if (err) throw err
      appendFile(FILE, '\n\nconst api = typeHelper({', () => {
        appendFile(FILE, exports.join(`,\n`), () => {
          appendFile(FILE, '}) \n export default api', () => {
            exec(`prettier  --write  ${FILE}`)
          })
        })
      })
    },
  )
})
