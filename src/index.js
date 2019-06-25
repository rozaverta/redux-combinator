import {isFunc, isNull, isString} from "typeof-utility";

const comb = {}, defaultValueNames = {};

function getKey(context) {
	return `key:${context}`
}

function add(type, context, reducer) {

	if (!comb[type]) {
		comb[type] = {
			keys: []
		};
	}

	const key = getKey(context);

	if (comb[type][key]) {
		throw new Error(`Duplicate pairs of the reducer context/type: '${context}/${type}'.`)
	}

	comb[type].keys.push(key);
	comb[type][key] = {
		context,
		reducer
	}
}

/**
 * Add new reducer
 *
 * @param {Function} reducer
 * @param {String} context
 * @param {String|String[]} actionTypes
 * @param {*} defaultValue
 */
export function addReducer(reducer, context = null, actionTypes = null, defaultValue = null) {

	if (!context) {
		context = reducer.reducerContext || "*"
	}

	if (!actionTypes) {
		actionTypes = reducer.reducerActionTypes
	}

	if (isString(context) && isFunc(reducer)) {

		if (!Array.isArray(actionTypes)) {
			actionTypes = [actionTypes]
		}

		for (let i = 0, length = actionTypes.length; i < length; i++) {
			if (isString(actionTypes[i])) {
				add(actionTypes[i], context, reducer)
			} else {
				throw new Error('Expected the action type to be a string.')
			}
		}

		if (context !== "*") {
			if (!isNull(defaultValue)) {
				defaultValueNames[context] = defaultValue
			} else if (!isNull(reducer.reducerDefaultValue)) {
				defaultValueNames[context] = reducer.reducerDefaultValue
			}
		}
	} else {
		throw new Error('Expected the reducer to be a function and context to be a string.')
	}
}

/**
 * Root reducer
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {*}
 */
export function rootReducer(state, action) {
	const type = action.type;

	if (comb.hasOwnProperty(type)) {
		const keys = comb[type].keys, length = keys.length;

		for (let i = 0; i < length; i++) {
			const
				part = comb[type][keys[i]],
				{context, reducer} = part;

			if (context === "*") {
				state = reducer(state, action)
			} else {
				const nameState = reducer(
					state.hasOwnProperty(context) ? state[context] : defaultValueNames[context], action, state
				);
				state = {
					...state, [context]: nameState
				}
			}
		}
	}

	return state;
}
