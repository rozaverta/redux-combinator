import {isFunc, isNull, isNumeric, isString, isSymbol} from "typeof-utility";

function isContextAndType(value)
{
	return isString(value) || isNumeric(value) || isSymbol(value)
}

/**
 * Create new reducer
 *
 * @param {Object} def
 * @returns {Function}
 */
export default function createReducer(def = {}) {

	const
		comb = {},
		defaultValues = {},
		getKey = context => isSymbol(context) ? context : `key:${context}`,
		getDef = (context, def) => {
			if(defaultValues.hasOwnProperty(context)) {
				def = defaultValues[context];
				if(isFunc(def)) {
					def = def()
				}
			}
			return def
		},
		append = (context, type, reducer) => {

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
		};

	const reducer = (state, action) => {

		if(state === void 0) {
			state = getDef("*", def)
		}

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
					const contextState = reducer(
						state.hasOwnProperty(context) ? state[context] : getDef(context), action, state
					);
					state = {
						...state, [context]: contextState
					}
				}
			}
		}

		return state;
	};

	reducer.add = (reducer, context = null, actionTypes = null, defaultValue = null) => {

		if (!context) {
			context = reducer.reducerContext || "*"
		}

		if (!actionTypes) {
			actionTypes = reducer.reducerActionTypes
		}

		if (isContextAndType(context) && isFunc(reducer)) {

			if (!Array.isArray(actionTypes)) {
				actionTypes = [actionTypes]
			}

			for (let i = 0, type, length = actionTypes.length; i < length; i++) {
				type = actionTypes[i];
				if (isContextAndType(type)) {
					append(context, type, reducer)
				} else {
					throw new Error('Expected the action type to be a string, numeric or symbol.')
				}
			}

			// Set default value for context
			if (! defaultValues.hasOwnProperty(context)) {
				if (!isNull(defaultValue)) {
					defaultValues[context] = defaultValue
				} else if (!isNull(reducer.reducerDefaultValue)) {
					defaultValues[context] = reducer.reducerDefaultValue
				}
			}

		} else {
			throw new Error('Expected the reducer to be a function and context to be a string, numeric or symbol.')
		}
	};

	reducer.setDefault = (value, context = "*", override = true) => {
		if( override || ! defaultValues.hasOwnProperty(context) ) {
			defaultValues[context] = value
		}
	};

	return reducer;
}
