import { Authing, LoginInfo, fullStackOpenStore } from './redux/fullstackopen/reducer.js';
/* eslint-disable import/order */
import { LitElement, css, html } from 'lit';
import { getHostNameSelector, getLoginUrlSelector, isLoginSelector } from './redux/fullstackopen/selector.js';
import { property, query, state } from 'lit/decorators.js';
import { updateConfigAuth, updateConfigHostName, updateLoginInfo } from './redux/fullstackopen/action.js';

import { classMap } from 'lit/directives/class-map.js';
import { connect } from 'pwa-helpers';
import { styles } from './FullStackOpen.css';
import { until } from 'lit/directives/until.js';

export class FullStackOpen extends connect(fullStackOpenStore)(LitElement) {
  @property({ type: String }) title = 'My app';

  static styles = styles;

  @state()
  notes: Promise<Array<any>> = Promise.resolve([]);

  @state()
  isImportent: boolean = false;

  @state()
  loginError: string = '';

  @query('#noteContent')
  noteContent!: HTMLInputElement;

  // noteContent: string = '';

  hostName = '';

  @state()
  isLogin: boolean = true;

  logingUrl: string = '';

  private setImportent(e: Event) {
    this.isImportent = !this.isImportent;
  }

  private async updateNote(e: Event) {
    const note = {
      content: this.noteContent?.value,
      important: this.isImportent,
    };
    try {
      const resp = await fetch(`${this.hostName}/api/notes`, {
        method: 'POST',
        body: JSON.stringify(note),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        },
      });
      if (resp.ok) {
        this.noteContent.value = '';
        const result = await resp.json();
        const notes = await this.notes;
        notes.push(
          html`<li>
            ${result.important
              ? html`<strong>${result.content}</strong>`
              : `${result.content}`}
          </li>`
        );
        this.notes = Promise.resolve(notes);
      } else {
        throw new Error('return 400');
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  constructor() {
    super();
    if (window.location.hostname === 'localhost') {
      this.hostName = 'http://localhost:8080';
      fullStackOpenStore.dispatch(updateConfigHostName('http://localhost:8080'));
    }
    this.loadConfig();
  }

  private async loadConfig() {
    const configResp = await fetch(`${this.hostName}/api/config`);
    const config = await configResp.json();
    fullStackOpenStore.dispatch(updateConfigAuth({
      loginUrl: `${config.loginUrl}`,
      sessionEndUrl: config.sessionEndUrl
    } as Authing));
    this.loadUser();
  }

  private async loadUser() {
    const userResp = await fetch(`${this.hostName}/api/users`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
    if (userResp.status === 401) {
      console.error("login faild");
      localStorage.removeItem('jwtToken');
      this.loginError = "login error";
      fullStackOpenStore.dispatch(updateLoginInfo({
        isLogin: false
      } as LoginInfo));

      return;
    }
    const userResult = await userResp.json();
    if (userResult) {
      fullStackOpenStore.dispatch(updateLoginInfo({
        isLogin: true,
        userId: userResult.userid,
        userName: userResult.name
      } as LoginInfo));
    }
  }

  stateChanged(fullStackOpenStoreParm: any) {
    this.hostName = getHostNameSelector(fullStackOpenStoreParm);
    this.isLogin = isLoginSelector(fullStackOpenStoreParm);

    if (this.isLogin === true) {
      this.loadNote();
    }
  }

  private async loadNote() {
    const noteResp = await fetch(`${this.hostName}/api/notes`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
    if (noteResp.status === 401) {
      console.error("login faild");
      localStorage.removeItem('jwtToken');
      this.loginError = "login error";
      fullStackOpenStore.dispatch({
        type: 'UPDATE_LOGIN_INFO',
        payload: {
          isLogin: false
        } as LoginInfo
      });
      return;
    }
    const noteResult = await noteResp.json();
    this.notes = noteResult.map(
      (note: { important: boolean; content: string; }) => html`<li>
            ${note.important
          ? html`<strong>${note.content}</strong>`
          : `${note.content}`}
          </li>`
    );
  }

  render() {
    return html`
      <div class="userInfo">
        <full-stack-user-info></full-stack-user-info>
      </div>
      <div class="title">
        <p>Notes</p>
      </div>
      <div class=${classMap({ login: true })}>
        <full-stack-login class=${classMap({ notshow: this.isLogin !== false })}></full-stack-login>
      </div>
      <div class="info">
        <div>
          <button @click=${this.setImportent}>
            ${this.isImportent ? 'show important' : 'show not important'}
          </button>
        </div>
        <div>
          <ul>
            ${until(this.notes, html`<span>'Loading...'</span>`)}
          </ul>
        </div>
      </div>
      <div>
        <input id="noteContent" type="text" />
        <button @click=${this.updateNote}>save</button>
      </div>
    `;
  }
}
