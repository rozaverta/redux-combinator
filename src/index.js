import createReducer from "./createReducer";

/**
 * Root reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {*}
 */
const rootReducer = createReducer();

/**
 * Add new reducer.
 *
 * @param {Function} reducer
 * @param {String|Number|Symbol} context
 * @param {String|String[]} actionTypes
 * @param {*} defaultValue
 */
function addReducer(reducer, context, actionTypes, defaultValue) {
	rootReducer.add(reducer, context, actionTypes, defaultValue)
}

/**
 * Set default context value. Use `*` for global context.
 *
 * @param value
 * @param {String|Number|Symbol} context
 * @param {Boolean} override
 */
function setDefault(value, context, override) {
	rootReducer.setDefault(value, context, override)
}

export {createReducer, rootReducer, addReducer, setDefault};
