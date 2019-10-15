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

const createRouteContent = (routeName) => {
  const routeContent = 
`const express = require('express');
const router = express.Router();

const queries = require('../queries/${routeName}.js');

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

const createMainAppContent = (routeName) => {
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

const createMainIndexContent = () => {
  const indexContent = 
`const app = require('./app');
const port = parseInt(process.env.PORT || 3000);

app.listen(port)
  .on('error', console.error.bind(console))
  .on('listening', console.log.bind(console, 'Listening on http://localhost:' + port));
`
  return indexContent
}

const createDbFileContent = () => {
  const dbFileContent = 
`const CONFIG = require('./knexfile')[process.env.NODE_ENV || 'development'];
module.exports = require('knex')(CONFIG);
`
  return dbFileContent
}

const createKnexFileContent = (dbName) => {
  const knexFileContent = 
`module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/${dbName}',
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/${dbName}',
  },
};
`
  return knexFileContent
}

const createPackageJsonContent = (projName) => {
  const packageContent = 
`{
  "name": "${projName}",
  "version": "0.1.0",
  "description": "${projName} - Created with knex-express CLI",
  "license": "ISC",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "watch": "nodemon index.js"
  },
  "dependencies": {}
}
`
  return packageContent
}

const createQueryContent = (routeName) => {
  const queryContent = 
`const database = require('../database-connection');

module.exports = {
  list() {
    return database('${routeName}').select();
  },
  read(id) {
    return database('${routeName}').select().where('id', id).first();
  },
  create(id) {
    return database('${routeName}')
      .insert()
      .where('id', id)
      .returning('*')
      .then(record => record[0]);
  },
  update(id) {
    return database('${routeName}')
      .update()
      .where('id', id)
      .returning('*')
      .then(record => record[0]);
  },
  delete(id) {
    return database('${routeName}').delete().where('id', id);
  }
};
`
  return queryContent
}

const createStaticJsonContent = async (routeName) => {
  const staticApiContent =
`{
  "${routeName}": [
    {
      "id": 1,
      "name": "First ${routeName}",
      "integer": 101,
      "boolean": true,
      "long_text": "Chuck Norris can slam a revolving door. Chuck Norris is the reason why Waldo is hiding. Chuck Norris can lead a horse to water AND make it drink. Chuck Norris doesn't flush his toilet; he scares the shit out of it.",
      "image_url": "https://www.dogideas.net/wp-content/uploads/West-Highland-White-Terrier-Westie-Dogs.jpg",
      "date": "2018-03-18T02:14:00.000Z",
      "null": null
    },
    {
      "id": 2,
      "name": "Second ${routeName}",
      "integer": 102,
      "boolean": false,
      "long_text": "Outer space exists because it's afraid to be on the same planet with Chuck Norris. Chuck Norris does not get frostbite; Chuck Norris bites frost. Chuck Norris doesn't wear a watch; HE decides what time it is.",
      "image_url": "https://d32l83enj9u8rg.cloudfront.net/wp-content/uploads/golden-doodle-620-403-1.jpg",
      "date": "2019-06-15T11:47:00.000Z",
      "null": null
    },
    {
      "id": 3,
      "name": "Third ${routeName}",
      "integer": 103,
      "boolean": true,
      "long_text": "When the Boogeyman goes to sleep every night, he checks his closet for Chuck Norris. Chuck Norris' sleep number is roundhouse. The Great Wall of China was originally created to keep Chuck Norris out.",
      "image_url": "https://cf.ltkcdn.net/dogs/images/std/237577-675x450-Cavachon-Puppy.jpg",
      "date": "2018-10-09T06:33:00.000Z",
      "null": null
    }
  ]
}
`
  return staticApiContent;
}
