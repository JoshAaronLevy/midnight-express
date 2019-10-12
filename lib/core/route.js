const express = require('express');
const router = express.Router();

const queries = require('../queries/skills');

router.get('/', (request, response, next) => {
  queries.list('skills').then(skills => {
    response.json({
      skills
    });
  }).catch(next);
});

router.get('/:id', (request, response, next) => {
  queries.read(request.params.id).then(skill => {
    skill
      ?
      response.json({
        skill
      }) :
      response.sendStatus(404)
  }).catch(next);
});

router.post('/', (request, response, next) => {
  queries.create(request.body).then(skill => {
    response.status(201).json({
      skill: skill
    });
  }).catch(next);
});

router.put('/:id', (request, response, next) => {
  queries.update(request.params.id, request.body).then(skill => {
    response.json({
      skill: skill[0]
    });
  }).catch(next);
});

router.delete('/:id', (request, response, next) => {
  queries.delete(request.params.id).then(() => {
    response.sendStatus(204);
  }).catch(next);
});

module.exports = router;