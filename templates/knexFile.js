module.exports = function createKnexFileContent(dbName) {
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