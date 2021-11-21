import { createStore } from "redux";

const INIT_STATE = {
    count: 0,
    todos: [] as { todo: string, complete: boolean }[],
    showComplete: undefined
}
const counterReducer = (state = INIT_STATE, action: any) => {
    let newState = { ...state };
    switch (action.type) {
        case 'INCREMENT':
            newState.count += 1;
            break;
        case 'DECREMENT':
            newState.count -= 1;
            break;
        case 'ZERO':
            newState.count = 0;
            break;
        case 'ADD_TODO':
            newState.todos = [...newState.todos, action.todo];
            break;
        case 'SHOW_COMPLETED':
            newState.showComplete = action.showComplete;
            break;
        default:
            newState = state;
    }

    return newState;
}

// const counterStore = createStore(counterReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__()(1));
const counterStore = createStore(counterReducer);


// counterStore.subscribe(
//     () => {
//         console.log(counterStore.getState().count);
//     }
// )
export {
    counterStore
};
