export const updateTodoStatus = (todo: { todo: string, complete: boolean }) => ({
    type: 'ADD_TODO',
    todo
});

export const updateComplete = (showComplete: boolean | null) => ({
    type: 'SHOW_COMPLETED',
    showComplete
});