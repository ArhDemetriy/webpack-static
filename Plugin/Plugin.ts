import { Compiler } from "webpack"
import * as fs from "fs"
import * as path from 'path'
import { PartitionImports } from "./core/PartitionImports"
import { SettingsPartitionImports, InterfacePartitionImports } from "./core/types"

type PluginOptions = {
  sources: string[],
  startDirs: string[],
  basenameImportFiles: string,
}
interface WebpackPlugin{
  apply(compiler: Compiler): void;
}
interface Plugin{
}

class Plugin implements WebpackPlugin, Plugin{
  apply(compiler: Compiler) {
  }
  protected readonly fileSistem: Map<string, Map<string, string>> = new Map()
  constructor(options: PluginOptions) {
    console.log(options);

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

export {
  Plugin,
}
