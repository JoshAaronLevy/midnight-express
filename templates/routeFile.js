module.exports = function createRouteContent(routeName) {
  const routeContent = 
`const express = require('express');
const router = express.Router();

const queries = require('../queries/${routeName}.js');

router.get('/', (request, response, next) => {
  queries.list('${routeName}').then(${routeName} => {
    response.json({
      ${routeName}
    });
  }).catch(next);
});

router.get('/:id', (request, response, next) => {
  queries.read(request.params.id).then(${routeName} => {
    ${routeName}
      ?
      response.json({
        ${routeName}
      }) :
      response.sendStatus(404)
  }).catch(next);
});

router.post('/', (request, response, next) => {
  queries.create(request.body).then(${routeName} => {
    response.status(201).json({
      ${routeName}: ${routeName}
    });
  }).catch(next);
});

router.put('/:id', (request, response, next) => {
  queries.update(request.params.id, request.body).then(${routeName} => {
    response.json({
      ${routeName}: ${routeName}[0]
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
  return routeContent
}