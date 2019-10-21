#!/usr/bin/env node
const program = require('commander');
const create = require('../lib/create');

program
  .command('create')
  .option('[projectName]')
  .alias('c')
  .description('Create new Express project')
  .action(function(command) {
    create(command);
    // console.log(command);
  });

program.parse(process.argv);