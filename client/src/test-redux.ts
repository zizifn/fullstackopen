import { state } from 'lit/decorators/state.js';
import { css, html, LitElement } from 'lit';
import { connect } from 'pwa-helpers';
import { repeat } from 'lit/directives/repeat.js';
import { counterStore } from './redux/reducer.js';
import { updateComplete, updateTodoStatus } from './redux/action.js';
import { getVisibleTodosSelector } from './redux/selector.js';

export class TestElement extends connect(counterStore)(LitElement) {
    static styles = css`
    .main{
        margin-bottom: 20px;
    }
    .complete {
      display: flex;
    }
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
        return html` <div class="main">
      <div>${this.count}</div>
      <div class="complete">
      <input type="text" vaule=${this.todoItem} @change=${(e: Event) => {
                this.todoItem = (e.target as HTMLInputElement).value;
            }} />
          <label for="complete">complete</label>
          <input type="checkbox" id="complete" @change=${(e: any) => {
                this.todoItemComplete = e.target.checked;
            }}>
        </div>
            <button @click=${() =>
                counterStore.dispatch(
                    updateTodoStatus({
                        todo: this.todoItem,
                        complete: this.todoItemComplete,
                    })
                )}>
                add todo </button>
                <div class="todo" >
                    ${repeat(
                    this.todos,
                    (todo, index) =>
                        html` <li>${index}: ${todo.todo} ${todo.complete}</li> `
                )}</div>
            <div class="filter">
            <input type="radio" id="showComplete" name="filter" value="complete"
          @change=${(e: any) => {
                const showComplete = e.target.checked;
                if (showComplete) {
                    counterStore.dispatch(updateComplete(true));
                }
            }} >
  <label for="showNotComplete">complete</label>
  <input type="radio" id="showNotComplete" name="filter" value="notcomplete" @change=${(
                e: any
            ) => {
                const showComplete = e.target.checked;
                if (showComplete) {
                    counterStore.dispatch(updateComplete(false));
                }
            }}>
  <label for="all">not complete</label>
  <input type="radio" id="all" name="filter" value="all" @change=${(
                e: any
            ) => {
                const showComplete = e.target.checked;
                if (showComplete) {
                    counterStore.dispatch(updateComplete(null));
                }
            }} checked>
  <label for="showNotComplete">show all</label>
            </div>
            </button>
            </div>`;
    }
}
