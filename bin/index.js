#!/usr/bin/env node
const program = require('commander');
const create = require('../lib/create');

program
  .command('create')
  .alias('c')
  .description('Create new Express project')

  .action(function () {
    create();
  });

program.parse(process.argv);