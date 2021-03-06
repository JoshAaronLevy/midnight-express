const handlebars = require('handlebars');

const templateSpec = 
`const express = require('express');
const router = express.Router();

const queries = require('../queries');

router.get('/', (request, response, next) => {
  queries.list('route').then(route => {
    response.json({
      route
    });
  }).catch(next);
});

router.get('/:id', (request, response, next) => {
  queries.read(request.params.id).then(route => {
    route
      ?
      response.json({
        route
      }) :
      response.sendStatus(404)
  }).catch(next);
});

router.post('/', (request, response, next) => {
  queries.create(request.body).then(route => {
    response.status(201).json({
      route: route
    });
  }).catch(next);
});

router.put('/:id', (request, response, next) => {
  queries.update(request.params.id, request.body).then(route => {
    response.json({
      route: route[0]
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

module.exports = templateSpec
