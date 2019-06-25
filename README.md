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
// The wrapper for the `rootReducer.add` method
addReducer(reducerFirst, "taskList", ["ADD_TASK", "REMOVE_TASK", "FILL_TASK"], []); // alternative syntax
addReducer(reducerSecond);

// Dispatch actions
store.dispatch({ type: "FILL_TASK", payload: ["One", "Two", "More..."] });
store.dispatch({ type: "ADD_TASK", payload: "This is task" });
store.dispatch({ type: "REMOVE_TASK", payload: "Two" });

console.log(store.getState());
```

## Functions

<details>
<summary><h3><code>createReducer([def])</code></h3></summary>

> Create new reducer combinator.

Use this function when there are several `store` objects in your project (_`createStore (reducer)`_).
If you used only one root store (as Redux recommends), 
you should use the `rootReducer`, `addReducer`, and `setDefault` functions.

<strong>Arguments</strong>

1. `def: any` - Default store value, global context.

<strong>Returns</strong>

`Function` - new reducer function.

</details>



<details>
<summary><h3><strong><code>rootReducer(state, action)</code></strong></h3></summary>

> Root reducer.

This function was created by the `createReducer()` function.

<strong>Arguments</strong>

1. `state: Object` - The type of state to be held by the store.
2. `action: Object` - The type of actions which may be dispatched.

<strong>Returns</strong>

`Object` - Result mixed state.

</details>


<details>
<summary><h3><strong><code>addReducer(reducer, [context], [actionTypes], [defaultValue])</code></strong></h3></summary>

> Add new reducer.

This wrapper function is for the `createReducer().add` function.

<strong>Arguments</strong>

1. `reducer: Function` - Reducer function.
2. `context: String` - Context key, use `*` for global context (default).
3. `actionTypes: String|Number|Symbol|mixed[]` - Action type name or action type collection.
4. `defaultValue: any` - Any default value for used context. Ignored if added before.

> The reducer function (reducerFunction) may contain (as an alternative) the following properties. 
> In this case, it is not necessary to pass additional parameters to the function.

* `reducerFunction.reducerContext` - Context key.
* `reducerFunction.reducerActionTypes` - Action type name or action type collection.
* `reducerFunction.reducerDefaultValue` - Any default value for used context.

See the example above.

</details>


<details>
<summary><h3><strong><code>setDefault(value, [context], [override])</code></strong></h3></summary>

> Sets the default value for the context state.

This wrapper function is for the `createReducer().setDefault` function.

<strong>Arguments</strong>

1. `value: any` - The context value.
2. `context: String` - Context key, use `*` for global context.
3. `override: boolean = true` - Modify if exists. Default is `true`.

</details>


### License

Copyright © 2019, [GoshaV Maniako](https://github.com/rozaverta).
Released under the [MIT License](LICENSE).