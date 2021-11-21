export const updateTodoStatus = (todo: { todo: string, complete: boolean }) => ({
    type: 'ADD_TODO',
    todo
});

export const updateComplete = (result: boolean) => ({
    type: 'SHOW_COMPLETED',
    showComplete: result
});