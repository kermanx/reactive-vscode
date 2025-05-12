/* eslint-disable no-console */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import chalk from 'chalk'
import prompts from 'prompts'
import corePackage from '../core/package.json'
import tGitignore from './templates/gitignore'
import tLaunch from './templates/launch'
import tPackage from './templates/package'
import tReadme from './templates/readme'
import tSrc from './templates/src'
import tTsconfig from './templates/tsconfig'
import tTsdownConfig from './templates/tsdownConfig'
import tVscodeignore from './templates/vscodeignore'
import { banner } from './utils/banner'
import { packageManager, runCommand } from './utils/pkgManager'
import { isValidPackageName, toValidPackageName } from './utils/pkgName'

async function main() {
  console.log()
  console.log(banner)
  console.log()

  const cwd = process.cwd()

  let displayName = process.argv.slice(2).filter(s => /^[\w\- ]+$/.test(s)).map(s => s.trim()).join(' ') || 'Your Extension'
  let publisher = ''
  let identifier = ''
  let targetDir = ''

  await prompts(
    [
      {
        name: 'displayName',
        type: 'text',
        message: 'What\'s the display name of your extension?',
        initial: displayName,
        onState: state => displayName = state.value || displayName,
      },
      {
        name: 'identifier',
        type: 'text',
        message: 'What\'s the package name of your extension?',
        initial: () => identifier = toValidPackageName(displayName),
        validate: id => isValidPackageName(id) || 'Invalid package.json name',
        onState: state => identifier = state.value || identifier,
      },
      {
        name: 'publisher',
        type: 'text',
        message: 'What\'s your publisher name?',
        initial: publisher,
        validate: pub => isValidPackageName(pub) || 'Invalid publisher name',
        onState: state => publisher = state.value || publisher,
      },
      {
        name: 'targetDir',
        type: 'text',
        message: 'Which directory do you want to scaffold the project in?',
        initial: () => targetDir = identifier,
        validate: dir =>
          !fs.existsSync(path.resolve(cwd, dir))
          || 'Target directory already exists, please choose another name',
        onState: state => targetDir = state.value || targetDir,
      },
    ],
    {
      onCancel: () => {
        console.log()
        console.log(`${chalk.red('×')} Aborted.`)
        console.log()
        process.exit(1)
      },
    },
  )

  const root = path.resolve(cwd, targetDir)

  console.log()
  console.log(`Scaffolding project in ${root}...`)

  fs.mkdirSync(root, { recursive: true })
  process.chdir(root)

  fs.writeFileSync('package.json', tPackage(publisher, identifier, displayName, `^${corePackage.version}`))
  fs.writeFileSync('tsconfig.json', tTsconfig)
  fs.writeFileSync('.gitignore', tGitignore)
  fs.writeFileSync('.vscodeignore', tVscodeignore)
  fs.writeFileSync('tsdown.config.ts', tTsdownConfig)
  fs.writeFileSync('README.md', tReadme(publisher, identifier, displayName))

  fs.mkdirSync('src')
  const srcCode = tSrc(identifier, displayName)
  for (const [name, code] of Object.entries(srcCode))
    fs.writeFileSync(`src/${name}.ts`, code)

  fs.mkdirSync('.vscode')
  fs.writeFileSync('.vscode/launch.json', tLaunch)

  console.log()
  console.log('Done. Now run:')
  console.log()
  console.log(chalk.bold.green(`  cd ${targetDir}`))
  console.log(chalk.bold.green(`  ${packageManager} install`))
  console.log(chalk.bold.green(`  code .`))
  console.log(chalk.bold.green(`  ${runCommand} dev`))
  console.log()
}

main()
