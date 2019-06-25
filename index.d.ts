type ActionType = string | number | Symbol;
type Context = "*" | string | number | Symbol;

interface Action extends Object {
    type: ActionType;
}

interface State extends Object {

}

interface Reducer extends Function {
    (state: "*", action: Action): State;
    <S = State>(state: S, action: Action, globalState: State): S;

    readonly reducerContext?: Context;
    readonly reducerActionTypes?: ActionType | ActionType[];
    readonly reducerDefaultValue?: any;
}

interface ReducerFunction extends Function {
    (state: State, action: Action): State;

    add(reducer: Reducer, context?: Context, actionTypes?: ActionType | ActionType[], defaultValue?: any): void;
    setDefault(value: any, context?: Context, override?: boolean): void;
}

/**
 * Create new reducer combinator.
 *
 * @param {Object} def
 * @returns {Function}
 */
export function createReducer(def?: any): ReducerFunction;

/**
 * Root reducer.
 *
 * @param state
 * @param action
 */
export function rootReducer(state: State, action: Action): State;

/**
 * Add new reducer.
 *
 * @param {Function} reducer
 * @param {String|Number|Symbol} context
 * @param {String|String[]} actionTypes
 * @param {*} defaultValue
 */
export function addReducer(reducer: Reducer, context?: Context, actionTypes?: ActionType | ActionType[], defaultValue?: any): void;

/**
 * Set default context value. Use `*` for global context.
 *
 * @param value
 * @param {String|Number|Symbol} context
 * @param {Boolean} override
 */
export function setDefault(value: any, context?: Context, override?: boolean): void;