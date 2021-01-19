import { appendFileSync, readdirSync, writeFile } from 'fs'
import { exec } from 'child_process'

type FileResult = {
  name: string
  path: string
  apiName: string | null
}

type DirectoryResult = {
  results: Array<DirectoryResult | FileResult>
  path: string
  group: string
}

const API_PATH = './src/api/'
const FILE = `${API_PATH}index.ts`

function camelize(str?: string) {
  return str
    ? str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, '')
    : null
}

function getFiles(path: string): Array<DirectoryResult | FileResult> {
  const entries = readdirSync(path, { withFileTypes: true })

  // Get files within the current directory and add a path key to the file objects
  const isOnlyFiles = entries.every((file) => !file.isDirectory())
  const files = isOnlyFiles
    ? entries
        .filter((file) => file.name === 'index.ts')
        .map((file) => ({
          ...file,
          path,
          apiName: camelize(path.match(/([^/]*)\/*$/)?.[1].replace('-', ' ')),
        }))
        .filter(({ apiName }) => apiName)
    : []

  const folders = entries.filter((folder) => folder.isDirectory())

  const newFiles: DirectoryResult[] = folders.map((folder) => {
    const results = getFiles(`${path}${folder.name}/`)
    return {
      results,
      path: `${path}${folder.name}`,
      group: folder.name,
    }
  })

  return [...files, ...newFiles.flat()]
}

const createImport = (res: Array<FileResult | DirectoryResult>): string[] => {
  return res
    .map((value) => {
      if ('apiName' in value) {
        return `import * as ${value.apiName} from './${value.path
          .split(API_PATH)
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
            ${value.apiName}
            `
      }
      return createExport(value.results).flat()
    })
    .flat()
}

const result = getFiles(API_PATH)
const importLines = createImport(result)
const exportLines = createExport(result)

writeFile(
  FILE,
  `${importLines.join(`\n`)}
        \n
        type ApiConfig = {
        singleFixture: any
        listFixture?: any
        path: string | null
        fixtureId: string | null
      }

      function typeHelper<K extends PropertyKey>(obj: Record<K, ApiConfig>): Record<K, ApiConfig> {
        return obj
      }
      \n`,
  (err) => {
    if (err) throw err
    appendFileSync(FILE, '\n\nconst api = typeHelper({')
    appendFileSync(FILE, exportLines.join(`,\n`))
    appendFileSync(FILE, '}) \n export default api')
    exec(`prettier --write ${FILE}`)
  },
)
