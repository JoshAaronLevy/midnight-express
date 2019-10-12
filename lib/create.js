#!/usr/bin/env node
'use strict'
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const runner = require('./runner.js');
const handlebars = require('handlebars');
const templateSpec = require('../templates/express');

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
    type: 'list',
    name: 'dataSource',
    message: 'What data source would you like to add?',
    choices: [
      'Static JSON',
      'Database',
      'Both'
    ]
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
      return answers.dataSource === 'Database' || answers.dataSource === 'Both';
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
  // {
  //   type: 'confirm',
  //   name: 'knexSetup',
  //   message: 'Would you like to use knex?',
  //   when: function(answers) {
  //     return answers.dbType === 'SQL';
  //   }
  // },
  // {
  //   type: 'confirm',
  //   name: 'mongooseSetup',
  //   message: 'Would you like to use mongoose?',
  //   when: function(answers) {
  //     return answers.dbType === 'NoSQL';
  //   }
  // },
  {
    type: 'list',
    name: 'testingSetup',
    message: 'What testing library would you like to implement?',
    choices: [
      'Mocha/Chai',
      'Jest',
      'None'
    ]
  }
];

module.exports = function () {
  inquirer.prompt(questions).then(answers => {
    const projName = answers.project_name;
    const routeName = answers.routeName;
    console.log('Constructing project. Please wait...');
    const pathToVerify = path.join(process.cwd(), projName);
    if (!fs.existsSync(pathToVerify)) {
      const basePath = ensureDirectory(projName);
      checkRequestedInput(projName, routeName);
      // indexJs(routeName);
      runner(basePath);
    } else {
      console.error(chalk.red(`Directory ${projName} already exists in ${process.cwd()}. Please try another name for the project.`))
    }
  });
}

function checkRequestedInput(projName, routeName) {
  const basePath = ensureDirectory(projName);
  const routePath = ensureRouteDirectory(projName, 'routes');
  createTemplateFile(basePath, 'index.js');
  createTemplateFile(basePath, 'README.md', projName);
  createTemplateFile(basePath, '.gitignore');
  createRouteFile(routePath, `${routeName}.js`);
}

function ensureDirectory(projName) {
  const pathToVerify = path.join(process.cwd(), projName);
  mkdirp.sync(pathToVerify);
  return pathToVerify;
}

function ensureRouteDirectory(projName) {
  const routerPath = path.join(process.cwd(), projName, 'routes');
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
  const routeTemplate = handlebars.compile(templateSpec)
  console.log(routeTemplate({}))
  fs.writeFileSync(targetRouterFile, routeTemplate({}), 'utf8');
  return targetRouterFile;
}
