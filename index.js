'use strict';

if (process.env.NODE_ENV === 'production') {
	module.exports = require('./cjs/redux-combinator.production.min.js');
} else {
	module.exports = require('./cjs/redux-combinator.development.js');
}