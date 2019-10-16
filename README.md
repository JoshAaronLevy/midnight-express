# Midnight Express

A Node/Express CLI with database integration

## Installation

`npm i -g midnight-express`

## Getting Started

* Set up a new midnight-express project with

`midnight-express create`

* Follow the following prompts

## Prompts

1. Name your project

2. Create a custom initial route name

   1. This creates an example route with base API calls

   2. Default is 'puppies'

3. Choose a data source

   1. 'Static JSON' will generate a JSON file with sample data

   2. 'Database' will allow you to select a SQL database to include in the dependencies

4. Choose one of the following SQL databases (NOTE: implements Knex.js for queries)

   1. PostgreSQL

   2. SQLite

   3. MySQL

   4. MariaDB

   5. Other (Skips install, in case desired database is not in the list)
