/**
 * Take a path with a file name in it and extracts the name of the file from the path.
 *
 * ```ts
 * getFileName('https://domain.com/path/to/file.txt') // 'file.txt'
 * ```
 *
 * @param path The path to the file, including the file name.
 */
export default function getFileName(path: string) {
  const parts = path.split('/')
  const lastPart = parts[parts.length - 1]

  // Check if the end of the string matches with a dot followed by 3 or 4 letters
  if (lastPart.match(/\.[a-z|A-Z]{3,4}$/)) {
    return lastPart
  }

  return path
}
