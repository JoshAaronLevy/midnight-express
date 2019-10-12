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

   2. 'Database' will allow you to select a database to include in the dependencies

   3. 'Both' will create a JSON file and initialize database prompts

4. Choose a database type (if selected either 'Database' or 'Both' as the data source)

   1. 'SQL'

   2. 'NoSQL'

5. Choose one of the following SQL databases (if 'SQL' was selected as the database type)

   1. PostgreSQL

   2. SQLite

   3. MySQL

   4. MariaDB

   5. Other (Skips install, in case desired database is not in the list)

6. Choose a NoSQL database (if 'NoSQL' was selected as the database type)

   1. MongoDB

   2. Other (Skips install, in case desired database is not in the list)

7. Implement testing library with one of the following

   1. Mocha/Chai

   2. Jest

   3. None
