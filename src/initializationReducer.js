const ACTION_TYPE_INITIALIZATION = "REDUX_COMBINATOR/INIT";
const ACTION_TYPE_REBOOT = "REDUX_COMBINATOR/REBOOT";

export {ACTION_TYPE_INITIALIZATION, ACTION_TYPE_REBOOT};
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
	else if(type === ACTION_TYPE_REBOOT) {
		return payload;
	}
	else {
		return state;
	}
}

initializationReducer.reducerActionTypes = [ACTION_TYPE_INITIALIZATION, ACTION_TYPE_REBOOT];