# redux-combinator

> Alternative reducer combinator for the redux library. Grouping action types and context names.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save redux-combinator
```

## Usage

Task list example.

> This is an example to understand how the library works. Please... In real life, do not do this!

```js
import { createStore } from 'redux';
import { rootReducer, addReducer } from 'redux-combinator';

// Create a Redux store holding the state of your app.
// Warning: Set default state!
let store = createStore(rootReducer, {});

// This reducer creates an array of tasks. The `taskList` context.
function reducerFirst(state, action) {
	
	switch (action.type) {
		case 'FILL_TASK':
			return action.payload.slice();
			
		case 'ADD_TASK':
			const copyForAdd = state.slice();
			copyForAdd.push(action.payload);
			return copyForAdd;
			
		case 'REMOVE_TASK':
			const index = state.indexOf(action.payload);
			if(index > -1) {
				const copyForRemove = state.slice();
				copyForRemove.splice(index, 1);
				return copyForRemove;
			}
			else {
				break;
			}
    }
    return state
}

// This reducer creates and supports tasks statistics. The `taskStat` context.
function reducerSecond(state, action, globalState) {
	
	// This action uses only this reducer.
	if(action.type === "CLEAR_TASK_STAT") {
		return {
			fill: 0, add: 0, remove: 0, total: 0
		}
	}
	
	// Update values for all action.
	let {
		fill, 
		add, 
		remove, 
		total: prevTotal
	} = state, 
	total = globalState.taskList.length;
	
	switch (action.type) {
		case 'FILL_TASK':
			fill++;
			break;
			
		case 'ADD_TASK':
			add ++;
			break;
			
		case 'REMOVE_TASK':
			if(prevTotal !== total) {
				remove ++
			}
			break;
	}
	
	return {fill, add, remove, total}
}

// Set reducer properties
reducerSecond.reducerContext = "taskStat";
reducerSecond.reducerActionTypes = ["ADD_TASK", "REMOVE_TASK", "FILL_TASK", "CLEAR_TASK_STAT"];
reducerSecond.reducerDefaultValue = {fill: 0, add: 0, remove: 0, total: 0};

// Add reducers
addReducer(reducerFirst, "taskList", ["ADD_TASK", "REMOVE_TASK", "FILL_TASK"], []); // alternative syntax
addReducer(reducerSecond);

// Dispatch actions
store.dispatch({ type: "FILL_TASK", payload: ["One", "Two", "More..."] });
store.dispatch({ type: "ADD_TASK", payload: "This is task" });
store.dispatch({ type: "REMOVE_TASK", payload: "Two" });

console.log(store.getState());
```

### License

Copyright © 2019, [GoshaV Maniako](https://github.com/rozaverta).
Released under the [MIT License](LICENSE).