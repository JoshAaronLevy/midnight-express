#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

// const program = require('commander');

// program
//   .command('new <template>', 'create a new scaffolded template')
//   .action(function (template, opts) {
//     console.log('creating template "' + template + '"')
//   })

// .command('cry [service]', 'makes angular work');

// program
//   .option('-f, --float <number>', 'float argument', parseFloat)
//   .option('-i, --integer <number>', 'integer argument', myParseInt)
//   .option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0)
//   .option('-c, --collect <value>', 'repeatable value', collect, [])
//   .option('-l, --list <items>', 'comma separated list', commaSeparatedList)
// ;

// program.parse(process.argv);

function checkRequestedInput() {
  if (process.argv.length < 4)
    throw new Error('Make sure you give 2 arguments!');
  const [runtime, scriptName, command, option] = process.argv;
  console.log(`Script was asked to ${command} with ${option}!!! :catdance:`);
  
  const basePath = ensureDirectory(option)
  createTemplateFile(basePath, 'index.js')
  console.log('\n\nDUNZOS!')
}

function ensureDirectory(pathName) {
  const pathToVerify = path.join(__dirname, pathName);
  mkdirp.sync(pathToVerify);
  return pathToVerify;
}

function createTemplateFile(basePath, fileName) {
  const targetFile = path.join(basePath, fileName);
  if (!fs.existsSync(targetFile)) {
    fs.writeFileSync(targetFile, `TEST!`, 'utf8');
  } else {
    console.error('OOPs file already exists:', targetFile);
  }
  return targetFile;
}

checkRequestedInput();
