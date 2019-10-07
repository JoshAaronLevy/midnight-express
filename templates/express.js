module.exports = [
  `const express = require('express');
  const app = express();
  `,
  {
    keyName: 'useCORS',
    prompt: `Would you like cors lite?`,
    options: [
      {
        display: 'Yes',
        code: `
      app.use(require('cors')());
      `
      }
    ]
  }
];

function renderTemplate(template) {
  const output = [];

  for (let i = 0; i < template.length; i++) {
    if (typeof template[i] === 'string') {
      output.push(template[i])
    } else {
      output.push({
        type: 'list',
        name: template[i].keyName,
        message: template[i].prompt,
        choices: template[i].options.map(opt => opt.display),
        filter: function(selection) {
          return template[i].options.find(opt => opt === selection);
        }
      });
    }
    
  }
  return 
}
    