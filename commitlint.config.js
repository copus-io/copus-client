const fs = require('fs');
const data = fs.readFileSync('./.czrc', { encoding: 'utf-8' });
const czrc = JSON.parse(data);

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', Object.keys(czrc.types)],
  },
};
