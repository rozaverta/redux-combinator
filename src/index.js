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
 * @param {String|String[]} actionTypes
 * @param {String|Number|Symbol} context
 * @param {*} defaultValue
 */
function addReducer(reducer, actionTypes, context, defaultValue) {
	rootReducer.add(reducer, actionTypes, context, defaultValue)
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

/**
 * Get default context value. Use `*` for global context.
 *
 * @param context
 * @returns {*}
 */
function getDefault(context) {
	return rootReducer.getDefault(context)
}

export {createReducer, rootReducer, addReducer, setDefault, getDefault};
