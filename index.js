'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/conditionize.min.js');
}
else {
  module.exports = require('./dist/conditionize.js');
}
