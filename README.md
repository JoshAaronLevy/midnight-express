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
  a. This creates an example route with base API calls
  b. Default is 'puppies'
3. Choose a data source
  a. 'Static JSON' will generate a JSON file with sample data
  b. 'Database' will allow you to select a database to include in the dependencies
  c. 'Both' will create a JSON file and initialize database prompts
4. Choose a database type (if selected either 'Database' or 'Both' as the data source)
  a. Select either 'SQL' or 'NoSQL'
5. Choose one of the following SQL databases (if 'SQL' was selected as the database type)
  a. PostgreSQL
  b. SQLite
  c. MySQL
  d. MariaDB
  e. Other (Skips install, in case desired database is not in the list)
6. Choose a NoSQL database (if 'NoSQL' was selected as the database type)
  a. MongoDB
  b. Other (Skips install, in case desired database is not in the list)
7. Implement testing library with one of the following
  a. Mocha/Chai
  b. Jest
  c. None
