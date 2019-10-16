module.exports = function createPackageJsonContent(projName) {
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