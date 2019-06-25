"use strict";

exports.__esModule = true;
exports.default = createReducer;

var _typeofUtility = require("typeof-utility");

function _extends() {
	_extends =
		Object.assign ||
		function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
			return target;
		};
	return _extends.apply(this, arguments);
}

function isContextAndActionType(value) {
	return (
		(0, _typeofUtility.isString)(value) ||
		(0, _typeofUtility.isNumeric)(value) ||
		(0, _typeofUtility.isSymbol)(value)
	);
}
/**
 * Create new reducer
 *
 * @param {Object} def
 * @returns {Function}
 */

function createReducer(def) {
	if (def === void 0) {
		def = {};
	}

	var comb = {},
		defaultValues = {},
		getDef = function getDef(context, def) {
			if (defaultValues.hasOwnProperty(context)) {
				def = defaultValues[context];

				if ((0, _typeofUtility.isFunc)(def)) {
					def = def();
				}
			}

			return def;
		},
		append = function append(actionType, context, reducer) {
			if (!comb[actionType]) {
				comb[actionType] = {
					keys: []
				};
			}

			var key = (0, _typeofUtility.isSymbol)(context)
				? context
				: "key:" + context;

			if (comb[actionType][key]) {
				throw new Error(
					"Duplicate pairs of the reducer actionType/context: '" +
					actionType +
					"/" +
					context +
					"'."
				);
			}

			comb[actionType].keys.push(key);
			comb[actionType][key] = {
				context: context,
				reducer: reducer
			};
		};

	var reducer = function reducer(state, action) {
		if (state === void 0) {
			state = getDef("*", def);
		}

		var type = action.type;

		if (comb.hasOwnProperty(type)) {
			var keys = comb[type].keys,
				length = keys.length;

			for (var i = 0; i < length; i++) {
				var part = comb[type][keys[i]],
					context = part.context,
					_reducer = part.reducer;

				if (context === "*") {
					state = _reducer(state, action);
				} else {
					var _extends2;

					var contextState = _reducer(
						state.hasOwnProperty(context) ? state[context] : getDef(context),
						action,
						state
					);

					state = _extends(
						{},
						state,
						((_extends2 = {}), (_extends2[context] = contextState), _extends2)
					);
				}
			}
		}

		return state;
	};

	reducer.add = function(reducer, actionTypes, context, defaultValue) {
		if (actionTypes == null) {
			actionTypes = reducer.reducerActionTypes;

			if ((0, _typeofUtility.isEmpty)(actionTypes)) {
				throw new Error("Action type(s) is empty.");
			}
		}

		if (context == null) {
			context = reducer.reducerContext || "*";
		}

		if (
			isContextAndActionType(context) &&
			(0, _typeofUtility.isFunc)(reducer)
		) {
			if (!Array.isArray(actionTypes)) {
				actionTypes = [actionTypes];
			}

			for (
				var i = 0, actionType, length = actionTypes.length;
				i < length;
				i++
			) {
				actionType = actionTypes[i];

				if (isContextAndActionType(actionType)) {
					append(actionType, context, reducer);
				} else {
					throw new Error(
						"Expected the action type to be a string, numeric or symbol."
					);
				}
			} // Set default value for context

			if (!defaultValues.hasOwnProperty(context)) {
				if (!(0, _typeofUtility.isNull)(defaultValue)) {
					defaultValues[context] = defaultValue;
				} else if (!(0, _typeofUtility.isNull)(reducer.reducerDefaultValue)) {
					defaultValues[context] = reducer.reducerDefaultValue;
				}
			}
		} else {
			throw new Error(
				"Expected the reducer to be a function and context to be a string, numeric or symbol."
			);
		}
	};

	reducer.setDefault = function(value, context, override) {
		if (context === void 0) {
			context = "*";
		}

		if (override === void 0) {
			override = true;
		}

		if (override || !defaultValues.hasOwnProperty(context)) {
			defaultValues[context] = value;
		}
	};

	reducer.getDefault = function(context) {
		if (context == null) {
			context = "*";
		}

		return defaultValues.hasOwnProperty(context)
			? defaultValues[context]
			: void 0;
	};

	return reducer;
}
