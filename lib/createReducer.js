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

function isContextAndType(value) {
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
		getKey = function getKey(context) {
			return (0, _typeofUtility.isSymbol)(context) ? context : "key:" + context;
		},
		getDef = function getDef(context, def) {
			if (defaultValues.hasOwnProperty(context)) {
				def = defaultValues[context];

				if ((0, _typeofUtility.isFunc)(def)) {
					def = def();
				}
			}

			return def;
		},
		append = function append(context, type, reducer) {
			if (!comb[type]) {
				comb[type] = {
					keys: []
				};
			}

			var key = getKey(context);

			if (comb[type][key]) {
				throw new Error(
					"Duplicate pairs of the reducer context/type: '" +
					context +
					"/" +
					type +
					"'."
				);
			}

			comb[type].keys.push(key);
			comb[type][key] = {
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

	reducer.add = function(reducer, context, actionTypes, defaultValue) {
		if (context === void 0) {
			context = null;
		}

		if (actionTypes === void 0) {
			actionTypes = null;
		}

		if (defaultValue === void 0) {
			defaultValue = null;
		}

		if (!context) {
			context = reducer.reducerContext || "*";
		}

		if (!actionTypes) {
			actionTypes = reducer.reducerActionTypes;
		}

		if (isContextAndType(context) && (0, _typeofUtility.isFunc)(reducer)) {
			if (!Array.isArray(actionTypes)) {
				actionTypes = [actionTypes];
			}

			for (var i = 0, type, length = actionTypes.length; i < length; i++) {
				type = actionTypes[i];

				if (isContextAndType(type)) {
					append(context, type, reducer);
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

	return reducer;
}
