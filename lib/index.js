"use strict";

exports.__esModule = true;
exports.addReducer = addReducer;
exports.setDefault = setDefault;
exports.rootReducer = void 0;

var _createReducer = _interopRequireDefault(require("./createReducer"));

exports.createReducer = _createReducer.default;

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Root reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {*}
 */
var rootReducer = (0, _createReducer.default)();
/**
 * Add new reducer.
 *
 * @param {Function} reducer
 * @param {String|Number|Symbol} context
 * @param {String|String[]} actionTypes
 * @param {*} defaultValue
 */

exports.rootReducer = rootReducer;

function addReducer(reducer, context, actionTypes, defaultValue) {
	rootReducer.add(reducer, context, actionTypes, defaultValue);
}
/**
 * Set default context value. Use `*` for global context.
 *
 * @param value
 * @param {String|Number|Symbol} context
 * @param {Boolean} override
 */

function setDefault(value, context, override) {
	rootReducer.setDefault(value, context, override);
}
