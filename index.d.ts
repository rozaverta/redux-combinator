type ActionType = string;
type Context = "*" | string;

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

export function addReducer(reducer: Reducer, context?: Context, actionTypes?: ActionType | ActionType[], defaultValue?: any): void;

export function rootReducer(state: State, action: Action): State;
