import { createSelector } from 'reselect';

// Selectors (1)
const getTodosSelector = (state: { todos: { todo: string, complete: boolean }[] }) => state.todos;
const getFilterSelector = (state: { showComplete: any; }) => state.showComplete;

export const getVisibleTodosSelector = createSelector(
    getTodosSelector, getFilterSelector,
    (todos, filter) => {
        switch (filter) {
            case true:
                return todos.filter(todo => todo.complete);
            case false:
                return todos.filter(todo => !todo.complete);
            default:
                return todos;
        }
    }
);