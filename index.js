#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const program = require('commander');
('use strict');
const inquirer = require('inquirer');
const chalk = require('chalk');

let questions = [
  {
    type: 'input',
    name: 'project_name',
    message: 'Project name'
  },
  {
    type: 'input',
    name: 'routeName',
    message: 'What would you like to name the sample API route?',
    default: 'puppies'
  },
  {
    type: 'confirm',
    name: 'dbSetup',
    message: 'Would you like to set up a database?'
  },
  {
    type: 'list',
    name: 'dbType',
    message: 'What type of database would you like to use?',
    choices: [
      'SQL',
      'NoSQL'
    ],
    when: function(answers) {
      return answers.dbSetup;
    }
  },
  {
    type: 'list',
    name: 'SQLSelect',
    message: 'What SQL database would you like to install?',
    choices: [
      'PostgreSQL',
      'SQLite',
      'MySQL',
      'MariaDB',
      'Other'
    ],
    when: function(answers) {
      return answers.dbType === 'SQL';
    }
  },
  {
    type: 'list',
    name: 'NoSQLSelect',
    message: 'What NoSQL database would you like to install?',
    choices: [
      'MongoDB',
      'Other'
    ],
    when: function(answers) {
      return answers.dbType === 'NoSQL';
    }
  },
  {
    type: 'confirm',
    name: 'knexSetup',
    message: 'Would you like to use knex?',
    when: function(answers) {
      return answers.dbType === 'SQL';
    }
  },
  {
    type: 'confirm',
    name: 'mongooseSetup',
    message: 'Would you like to use mongoose?',
    when: function(answers) {
      return answers.dbType === 'NoSQL';
    }
  },
  {
    type: 'confirm',
    name: 'testingSetup',
    message: 'Would you like to add testing (Mocha/Chai)?',
  },
];

inquirer.prompt(questions).then(answers => {
  const projName = answers.project_name;
  const routeName = answers.routeName;
  console.log(JSON.stringify(answers, null, 2));
  const pathToVerify = path.join(__dirname, projName);
  if (!fs.existsSync(pathToVerify)) {
    checkRequestedInput(projName, routeName);
  } else {
    console.error(chalk.red(`Directory ${projName} already exists in ${__dirname}. Please try another name for the project.`))
  }
});

function checkRequestedInput(projName, routeName) {
  const basePath = ensureDirectory(projName);
  const routePath = ensureRouteDirectory(projName, 'routes');
  createTemplateFile(basePath, 'index.js');
  createTemplateFile(basePath, 'README.md', projName);
  createTemplateFile(basePath, '.gitignore');
  createRouteFile(routePath, `${routeName}.js`);
}

function ensureDirectory(projName) {
  const pathToVerify = path.join(__dirname, projName);
  mkdirp.sync(pathToVerify);
  return pathToVerify;
}

function ensureRouteDirectory(projName) {
  const routerPath = path.join(__dirname, projName, 'routes');
  mkdirp.sync(routerPath);
  return routerPath;
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
    console.error(`File ${targetFile} already exists`);
  }
  return targetFile;
}

function createRouteFile(routePath, fileName) {
  const targetRouterFile = path.join(routePath, fileName);
  fs.writeFileSync(targetRouterFile, `'I love puppies!!!'`, 'utf8');
  return targetRouterFile;
}
