import { Compiler } from "webpack"
import * as fs from "fs"
import * as path from 'path'

type PluginOptions = {
  startDirs: string[]
}
class Plugin {
  apply(compiler: Compiler) {
  }
  protected readonly fileSistem: Map<string, Map<string, string>> = new Map()
  constructor(options: PluginOptions) {
  }
  protected readdir(source: string) {
    for (const name of fs.readdirSync(source)) {
      const pathName = path.resolve(source, name)
      const fileStat = fs.statSync(pathName)
      if (fileStat.isDirectory) {

      } else if (fileStat.isFile) {

      }
    }
  }
}

export { Plugin }
