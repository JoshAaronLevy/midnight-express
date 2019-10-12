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
1. Create a custom initial route name
   a. This creates an example route with base API calls
   b. Default is 'puppies'
1. Choose a data source
⋅⋅1. 'Static JSON' will generate a JSON file with sample data
⋅⋅1. 'Database' will allow you to select a database to include in the dependencies
⋅⋅1. 'Both' will create a JSON file and initialize database prompts
1. Choose a database type (if selected either 'Database' or 'Both' as the data source)
⋅⋅1. Select either 'SQL' or 'NoSQL'
1. Choose one of the following SQL databases (if 'SQL' was selected as the database type)
⋅⋅1. PostgreSQL
⋅⋅1. SQLite
⋅⋅1. MySQL
⋅⋅1. MariaDB
⋅⋅1. Other (Skips install, in case desired database is not in the list)
1. Choose a NoSQL database (if 'NoSQL' was selected as the database type)
⋅⋅1. MongoDB
⋅⋅1. Other (Skips install, in case desired database is not in the list)
1. Implement testing library with one of the following
⋅⋅1. Mocha/Chai
⋅⋅1. Jest
⋅⋅1. None
