import { state } from 'lit/decorators/state.js';
import { css, html, LitElement } from 'lit';
import { connect } from 'pwa-helpers';
import { repeat } from 'lit/directives/repeat.js';
import { counterStore } from './redux/reducer.js';
import { updateComplete, updateTodoStatus } from './redux/action.js';
import { getVisibleTodosSelector } from './redux/selector.js';

export class TestElement extends connect(counterStore)(LitElement) {

    static styles = css`
    .complete {
        display:flex;
    }`;

    @state()
    count: number = 0;

    todoItem: string = '';

    todoItemComplete: boolean = false;

    @state()
    todos: Array<{ todo: string, complete: boolean }> = [];

    stateChanged(state1: any) {
        this.count = state1.count;
        this.todos = getVisibleTodosSelector(state1);
    }

    render() {
        return html` <div>
      <div>${this.count}</div>
      <div class="complete">
      <input type="text" vaule=${this.todoItem} @change=${(e: Event) => { this.todoItem = (e.target as HTMLInputElement).value }} />
          <label for="complete">complete</label>
          <input type="checkbox" id="complete" @change=${(e: any) => {
                this.todoItemComplete = e.target.checked;
            }}>
        </div>
            <button @click=${() => counterStore.dispatch(updateTodoStatus({ todo: this.todoItem, complete: this.todoItemComplete }))}>
                add todo </button>
                <div div class="todo" >
                    ${repeat(
                this.todos,
                (todo, index) => html` <li>${index}: ${todo.todo} ${todo.complete}</li> `
            )}
            <div class="filter">
            <label for="complete">complete</label>
          <input type="checkbox" id="showComplete" @change=${(e: any) => {
                const showComplete = e.target.checked;
                if (showComplete) {
                    counterStore.dispatch(updateComplete(showComplete));
                }
            }}>
            </div>
        </div>
            </button>
            </div>`;
    }
}
