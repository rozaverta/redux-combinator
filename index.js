"use strict";

exports.__esModule = true;
exports.addReducer = addReducer;
exports.rootReducer = rootReducer;

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

var comb = {},
	defaultValueNames = {};

function getKey(context) {
	return "key:" + context;
}

function add(type, context, reducer) {
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
}
/**
 * Add new reducer
 *
 * @param {Function} reducer
 * @param {String} context
 * @param {String|String[]} actionTypes
 * @param {*} defaultValue
 */

function addReducer(reducer, context, actionTypes, defaultValue) {
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

	if (
		(0, _typeofUtility.isString)(context) &&
		(0, _typeofUtility.isFunc)(reducer)
	) {
		if (!Array.isArray(actionTypes)) {
			actionTypes = [actionTypes];
		}

		for (var i = 0, length = actionTypes.length; i < length; i++) {
			if ((0, _typeofUtility.isString)(actionTypes[i])) {
				add(actionTypes[i], context, reducer);
			} else {
				throw new Error("Expected the action type to be a string.");
			}
		}

		if (context !== "*") {
			if (!(0, _typeofUtility.isNull)(defaultValue)) {
				defaultValueNames[context] = defaultValue;
			} else if (!(0, _typeofUtility.isNull)(reducer.reducerDefaultValue)) {
				defaultValueNames[context] = reducer.reducerDefaultValue;
			}
		}
	} else {
		throw new Error(
			"Expected the reducer to be a function and context to be a string."
		);
	}
}
/**
 * Root reducer
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {*}
 */

function rootReducer(state, action) {
	var type = action.type;

	if (comb.hasOwnProperty(type)) {
		var keys = comb[type].keys,
			length = keys.length;

		for (var i = 0; i < length; i++) {
			var part = comb[type][keys[i]],
				context = part.context,
				reducer = part.reducer;

			if (context === "*") {
				state = reducer(state, action);
			} else {
				var _extends2;

				var nameState = reducer(
					state.hasOwnProperty(context)
						? state[context]
						: defaultValueNames[context],
					action,
					state
				);
				state = _extends(
					{},
					state,
					((_extends2 = {}), (_extends2[context] = nameState), _extends2)
				);
			}
		}
	}

	return state;
}
