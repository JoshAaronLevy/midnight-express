#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
'use strict';
var inquirer = require('inquirer');

var questions = [
  {
    type: 'input',
    name: 'project_name',
    message: "Project name"
  }
];

inquirer.prompt(questions).then(answers => {
  const projName = answers.project_name
  console.log(JSON.stringify(answers, null, 2));
  checkRequestedInput(projName);
});

function checkRequestedInput(projName) {
  const basePath = ensureDirectory(projName)
  createTemplateFile(basePath, 'index.js')
  createTemplateFile(basePath, 'README.md', projName)
  createTemplateFile(basePath, '.gitignore')
}

function ensureDirectory(pathName) {
  const pathToVerify = path.join(__dirname, pathName);
  mkdirp.sync(pathToVerify);
  return pathToVerify;
}

function createTemplateFile(basePath, fileName, projName) {
  const targetFile = path.join(basePath, fileName);
  if (!fs.existsSync(targetFile)) {
    if (fileName === 'README.md') {
      fs.writeFileSync(targetFile, `# ${projName}`, 'utf8');
    } else if (fileName === '.gitignore') {
      fs.writeFileSync(targetFile, 'node_modules', 'utf8');
    } else {
      fs.writeFileSync(targetFile, '', 'utf8');
    }
  } else {
    console.error('OOPs file already exists:', targetFile);
  }
  return targetFile;
}

