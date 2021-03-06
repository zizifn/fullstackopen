/* eslint-disable import/order */
import { FullStackOpenState } from './reducer.js';
import { createSelector } from 'reselect';

const getConfigSelector = (state: FullStackOpenState) => state.config;
const getLoginInfoSelector = (state: FullStackOpenState) => state.loginInfo;
const getAuthingSelector = (state: FullStackOpenState) => state.config.authing;

export const getLoginUrlSelector = createSelector(getAuthingSelector, (authing) => authing?.loginUrl || '');
export const getHostNameSelector = createSelector(getConfigSelector, (config) => config.hostName || '');
export const isLoginSelector = createSelector(getLoginInfoSelector, (config) => config.isLogin);
export const getUserInfo = createSelector(getLoginInfoSelector, (loginInfo) => loginInfo);


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