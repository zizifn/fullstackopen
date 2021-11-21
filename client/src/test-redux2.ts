import { state } from 'lit/decorators/state.js';
import { css, html, LitElement } from 'lit';
import { connect } from 'pwa-helpers';
import { repeat } from 'lit/directives/repeat.js';
import { counterStore } from './redux/reducer.js';
import { updateComplete, updateTodoStatus } from './redux/action.js';
import { getVisibleTodosSelector } from './redux/selector.js';

export class TestElement2 extends connect(counterStore)(LitElement) {
    static styles = css`
    .todo {
      border: 1px solid blue;
      min-height: 20px;
    }
  `;

    @state()
    count: number = 0;

    todoItem: string = '';

    todoItemComplete: boolean = false;

    @state()
    todos: Array<{ todo: string; complete: boolean }> = [];

    stateChanged(state1: any) {
        this.count = state1.count;
        this.todos = getVisibleTodosSelector(state1);
    }

    render() {
        return html` <div>
        <div class="todo">
          ${repeat(
            this.todos,
            (todo, index) =>
                html` <li>${index}: ${todo.todo} ${todo.complete}</li> `
        )}
        </div>
    </div>`;
    }
}
