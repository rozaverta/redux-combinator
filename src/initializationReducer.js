const ACTION_TYPE_INITIALIZATION = "REDUX_COMBINATOR/INIT";

export {ACTION_TYPE_INITIALIZATION};
export default function initializationReducer(state, action) {
	const {type, payload} = action;
	if(type === ACTION_TYPE_INITIALIZATION) {
		const {context, state: newState} = payload;
		if(context === "*") {
			return newState;
		}
		else {
			return {
				...state,
				[context]: newState,
			}
		}
	}
	else {
		return state;
	}
}

initializationReducer.reducerActionTypes = [ACTION_TYPE_INITIALIZATION];