import {isEmpty, isFunc, isNull, isNumeric, isString, isSymbol} from "typeof-utility";

function isContextAndActionType(value)
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
		getDef = (context, def) => {
			if(defaultValues.hasOwnProperty(context)) {
				def = defaultValues[context];
				if(isFunc(def)) {
					def = def()
				}
			}
			return def
		},
		append = (actionType, context, reducer) => {

			if (!comb[actionType]) {
				comb[actionType] = {
					keys: []
				};
			}

			const key = isSymbol(context) ? context : `key:${context}`;

			if (comb[actionType][key]) {
				throw new Error(`Duplicate pairs of the reducer actionType/context: '${actionType}/${context}'.`)
			}

			comb[actionType].keys.push(key);
			comb[actionType][key] = {
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

	reducer.add = (reducer, actionTypes, context, defaultValue) => {

		if (actionTypes == null) {
			actionTypes = reducer.reducerActionTypes;
			if(isEmpty(actionTypes)) {
				throw new Error('Action type(s) is empty.')
			}
		}

		if (context == null) {
			context = reducer.reducerContext || "*"
		}

		if (isContextAndActionType(context) && isFunc(reducer)) {

			if (!Array.isArray(actionTypes)) {
				actionTypes = [actionTypes]
			}

			for (let i = 0, actionType, length = actionTypes.length; i < length; i++) {
				actionType = actionTypes[i];
				if (isContextAndActionType(actionType)) {
					append(actionType, context, reducer)
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

	reducer.getDefault = (context) => {
		if(context == null) {
			context = "*"
		}
		return defaultValues.hasOwnProperty(context) ? defaultValues[context] : (void 0)
	};

	return reducer;
}
