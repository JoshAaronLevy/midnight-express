#!/usr/bin/env node
'use strict'
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const runner = require('./runner.js');
const dbRunner = require('./dbRunner.js');
const ora = require('ora');
const createPackageJsonContent = require('../templates/packageJson.js')
const createRouteContent = require('../templates/routeFile.js')
const createMainAppContent = require('../templates/appFile.js')
const createStaticJsonContent = require('../templates/staticJson.js')
const createQueryContent = require('../templates/queryFile.js')
const createMainIndexContent = require('../templates/indexFile.js')
const createKnexFileContent = require('../templates/knexFile.js')
const createDbFileContent = require('../templates/dbConnFile.js')

let questions = [
  {
    type: 'input',
    name: 'project_name',
    message: 'Project name',
    validate: function(answer) {
      const pathToVerify = path.join(process.cwd(), answer);
      if (fs.existsSync(pathToVerify) && pathToVerify !== process.cwd()) {
        console.error(chalk.red(`\n` + 
        `Directory ${answer} already exists in ${process.cwd()}. Please try another name for the project.`))
      } else if (answer.length === 0) {
        return "Please enter a project name";
      } else {
        return true;
      }
    }
  },
  {
    type: 'input',
    name: 'routeName',
    message: 'What would you like to name the sample API route?',
    default: 'puppies',
    validate: function(answer) {
      const pass = answer.match(/^[A-Za-z0-9_-]*$/)
      if (answer.length > 0 && pass) {
        return true;
      } else {
        return "Please enter a default route name (alphanumeric characters only)";
      }
    }
  },
  {
    type: 'list',
    name: 'dataSource',
    message: 'Which data source would you like to implement?',
    choices: [
      'Static JSON',
      'Database'
    ]
  },
  {
    type: 'input',
    name: 'dbName',
    message: 'What is the name of your database?',
    when: function(answers) {
      return answers.dataSource === 'Database';
    },
    validate: function(answer) {
      const pass = answer.match(/^[A-Za-z0-9_-]*$/)
      if (answer.length > 0 && pass) {
        return true;
      } else {
        return "Please enter a database name (alphanumeric characters only)";
      }
    }
  },
  {
    type: 'list',
    name: 'SQLSelect',
    message: 'Which SQL database would you like to install?',
    choices: [
      'PostgreSQL',
      'SQLite',
      'MySQL',
      'MariaDB',
      'Other'
    ],
    when: function(answers) {
      return answers.dataSource === 'Database';
    }
  }
  // {
  //   type: 'list',
  //   name: 'testingSetup',
  //   message: 'Which testing library would you like to implement?',
  //   choices: [
  //     'Mocha/Chai',
  //     'Jest',
  //     'None'
  //   ]
  // }
];

module.exports = async function () {
  inquirer.prompt(questions).then(async (answers) => {
    // const spinner = ora(`Constructing project. Sit tight...`).start()
    try {
      const projName = answers.project_name;
      const routeName = answers.routeName;
      const dbName = answers.dbName;
      const dataSource = answers.dataSource;
      console.log(chalk.green(
        `Constructing ` +
        chalk.green.bold(`${projName}`) + 
        `. Prepare for liftoff...`));
      const basePath = ensureDirectory(projName);
      await checkRequestedInput(projName, routeName, dbName);
      await runner(basePath);
      // spinner.succeed(`Project ${projName} successfully created!`);
    } catch (err) {
      // spinner.fail(err.message)
    }
  });
}

const checkRequestedInput = async (projName, routeName, dbName) => {
  const basePath = ensureDirectory(projName);
  const routePath = ensureRouteDirectory(projName, 'routes');
  const queryPath = ensureQueryDirectory(projName, 'queries');
  const assetPath = ensureAssetDirectory(projName, 'assets');
  createAppFile(basePath, 'app.js', routeName);
  createIndexFile(basePath, 'index.js');
  createDbFile(basePath, 'database-connection.js');
  createKnexFile(basePath, 'knexfile.js', dbName);
  createPackageJsonFile(basePath, 'package.json', projName);
  createTemplateFile(basePath, 'README.md', projName);
  createTemplateFile(basePath, '.gitignore');
  createRouteFile(routePath, `${routeName}.js`, routeName);
  createQueryFile(queryPath, `${routeName}.js`, routeName);
  createAssetFile(assetPath, `${routeName}.json`, routeName);
}

const ensureDirectory = (projName) => {
  const pathToVerify = path.join(process.cwd(), projName);
  mkdirp.sync(pathToVerify);
  return pathToVerify;
}

const ensureRouteDirectory = (projName) => {
  const routerPath = path.join(process.cwd(), projName, 'routes');
  mkdirp.sync(routerPath);
  return routerPath;
}

const ensureQueryDirectory = (projName) => {
  const routerPath = path.join(process.cwd(), projName, 'queries');
  mkdirp.sync(routerPath);
  return routerPath;
}

const ensureAssetDirectory = (projName) => {
  const assetPath = path.join(process.cwd(), projName, 'assets');
  mkdirp.sync(assetPath);
  return assetPath;
}

const createTemplateFile = (basePath, fileName, projName) => {
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

const createAppFile = (routePath, fileName, routeName) => {
  const targetAppFile = path.join(routePath, fileName);
  fs.writeFileSync(targetAppFile, createMainAppContent(routeName), 'utf8');
  return targetAppFile;
}

const createIndexFile = (routePath, fileName) => {
  const targetIndexFile = path.join(routePath, fileName);
  fs.writeFileSync(targetIndexFile, createMainIndexContent(), 'utf8');
  return targetIndexFile;
}

const createPackageJsonFile = (routePath, fileName, projName) => {
  const targetPackageJsonFile = path.join(routePath, fileName);
  fs.writeFileSync(targetPackageJsonFile, createPackageJsonContent(projName), 'utf8');
  return targetPackageJsonFile;
}

const createDbFile = (routePath, fileName) => {
  const targetDbFile = path.join(routePath, fileName);
  fs.writeFileSync(targetDbFile, createDbFileContent(), 'utf8');
  return targetDbFile;
}

const createKnexFile = (routePath, fileName, dbName) => {
  const targetKnexFile = path.join(routePath, fileName);
  fs.writeFileSync(targetKnexFile, createKnexFileContent(dbName), 'utf8');
  return targetKnexFile;
}

const createRouteFile = (routePath, fileName, routeName) => {
  const targetRouterFile = path.join(routePath, fileName);
  fs.writeFileSync(targetRouterFile, createRouteContent(routeName), 'utf8');
  return targetRouterFile;
}

const createQueryFile = (queryPath, fileName, routeName) => {
  const targetRouterFile = path.join(queryPath, fileName);
  fs.writeFileSync(targetRouterFile, createQueryContent(routeName), 'utf8');
  return targetRouterFile;
}

const createAssetFile = (routePath, fileName, routeName) => {
  const targetAssetFile = path.join(routePath, fileName);
  fs.writeFileSync(targetAssetFile, createStaticJsonContent(routeName), 'utf8');
  return targetAssetFile;
}
