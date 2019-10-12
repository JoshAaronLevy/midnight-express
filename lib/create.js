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

let questions = [
  {
    type: 'input',
    name: 'project_name',
    message: 'Project name',
    validate: function(answer) {
      if (answer.length > 3) {
        return true;
      } else {
        return "Please enter a project name (min. 3 characters)";
      }
    }
  },
  {
    type: 'input',
    name: 'routeName',
    message: 'What would you like to name the sample API route?',
    default: 'puppies',
    validate: function(answer) {
      if (answer.length > 3) {
        return true;
      } else {
        return "Please enter a default route name";
      }
    }
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
    console.log(chalk.green(
      `Constructing ` +
      chalk.green.bold(`${projName}`) + 
      `. Prepare for liftoff...`));
    const pathToVerify = path.join(process.cwd(), projName);
    if (!fs.existsSync(pathToVerify)) {
      const basePath = ensureDirectory(projName);
      checkRequestedInput(projName, routeName);
      runner(basePath);
    } else {
      console.error(chalk.red(`Directory ${projName} already exists in ${process.cwd()}. Please try another name for the project.`))
    }
  });
}

function checkRequestedInput(projName, routeName) {
  const basePath = ensureDirectory(projName);
  const routePath = ensureRouteDirectory(projName, 'routes');
  const assetPath = ensureAssetDirectory(projName, 'assets');
  createAppFile(basePath, 'app.js', routeName);
  createIndexFile(basePath, 'index.js');
  createTemplateFile(basePath, 'README.md', projName);
  createTemplateFile(basePath, '.gitignore');
  createRouteFile(routePath, `${routeName}.js`, routeName);
  createAssetFile(assetPath, `${routeName}.json`, routeName);
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

function ensureAssetDirectory(projName) {
  const assetPath = path.join(process.cwd(), projName, 'assets');
  mkdirp.sync(assetPath);
  return assetPath;
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

function createAppFile(routePath, fileName, routeName) {
  const targetAppFile = path.join(routePath, fileName);
  fs.writeFileSync(targetAppFile, createMainAppContent(routeName), 'utf8');
  return targetAppFile;
}

function createIndexFile(routePath, fileName) {
  const targetIndexFile = path.join(routePath, fileName);
  fs.writeFileSync(targetIndexFile, createMainIndexContent(), 'utf8');
  return targetIndexFile;
}

function createRouteFile(routePath, fileName, routeName) {
  const targetRouterFile = path.join(routePath, fileName);
  fs.writeFileSync(targetRouterFile, createRouteContent(routeName), 'utf8');
  return targetRouterFile;
}

function createAssetFile(routePath, fileName, routeName) {
  const targetAssetFile = path.join(routePath, fileName);
  fs.writeFileSync(targetAssetFile, '', 'utf8');
  return targetAssetFile;
}

function createRouteContent(routeName) {
  const routeContent = 
`const express = require('express');
const router = express.Router();

const queries = require('../queries');

router.get('/', (request, response, next) => {
  queries.list('${routeName}').then(${routeName} => {
    response.json({
      ${routeName}
    });
  }).catch(next);
});

router.get('/:id', (request, response, next) => {
  queries.read(request.params.id).then(${routeName} => {
    ${routeName}
      ?
      response.json({
        ${routeName}
      }) :
      response.sendStatus(404)
  }).catch(next);
});

router.post('/', (request, response, next) => {
  queries.create(request.body).then(${routeName} => {
    response.status(201).json({
      ${routeName}: ${routeName}
    });
  }).catch(next);
});

router.put('/:id', (request, response, next) => {
  queries.update(request.params.id, request.body).then(${routeName} => {
    response.json({
      ${routeName}: ${routeName}[0]
    });
  }).catch(next);
});

router.delete('/:id', (request, response, next) => {
  queries.delete(request.params.id).then(() => {
    response.sendStatus(204);
  }).catch(next);
});

module.exports = router;
`
  return routeContent
}

function createMainAppContent(routeName) {
  const appContent = 
`const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const ${routeName} = require('./routes/${routeName}');

app.use(bodyParser.json());
app.use(cors());

app.use('/${routeName}', ${routeName});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err.stack : {}
  });
});

module.exports = app;
`
  return appContent
}

function createMainIndexContent() {
  const indexContent = 
`const app = require('./app');
const port = parseInt(process.env.PORT || 3000);

app.listen(port)
  .on('error', console.error.bind(console))
  .on('listening', console.log.bind(console, 'Listening on http://localhost:' + port));
`
  return indexContent
}

function createPackageJsonContent(projName) {
  const packageDependencies = {}
  const packageContent = 
`{
  "name": "${projName}",
  "version": "0.1.0",
  "description": "${projName} - Created with midnight-express CLI",
  "author": "",
  "license": "ISC",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "watch": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": ${packageDependencies}
}
`
  return packageContent
}
