module.exports = function createMainAppContent(routeName) {
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