import { LitElement, html, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { classMap } from 'lit/directives/class-map.js';
import { styles } from './FullStackOpen.css';

export class FullStackOpen extends LitElement {
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

  userName = '';

  pwd = '';

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

  private async login() {
    console.log('username', this.userName);
    console.log('pwd', this.pwd);

    const loginResp = await fetch(`${this.hostName}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.userName,
        password: this.pwd
      })
    });
    if (loginResp.ok) {
      const result = await loginResp.json();
      // const jwtToken = {
      //   token: result.token
      // }
      localStorage.setItem('jwtToken', result.token)
      console.log(result);
      this.loadNote();
    } else {
      console.error("login faild");
      localStorage.removeItem('jwtToken');
      this.loginError = "login error";
    }

  }

  updateUserName(e: Event) {
    this.userName = (e.target as HTMLInputElement).value;
  }

  updatePwd(e: Event) {
    this.pwd = (e.target as HTMLInputElement).value;
  }

  constructor() {
    super();
    if (window.location.hostname === 'localhost') {
      this.hostName = 'http://localhost:3001';
    }
    this.loadNote();
  }

  private loadNote() {
    this.notes = fetch(`${this.hostName}/api/notes`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then(res => {
        if (res.status === 401) {
          console.error("login faild");
          localStorage.removeItem('jwtToken');
          this.loginError = "login error";
        }
        return res.json();
      })
      .then(notes => notes.map(
        (note: { important: boolean; content: string; }) => html`<li>
              ${note.important
            ? html`<strong>${note.content}</strong>`
            : `${note.content}`}
            </li>`
      )
      );
  }

  render() {
    return html`
      <div class="title">
        <p>Notes</p>
      </div>
      <div class="login">
        <div class="username">
          <label for="username">username</label>
          <input id="username" type="text" vaule=${this.userName} @change=${this.updateUserName} />
        </div>
        <div class="pwd">
          <label for="pwd">password</label>
          <input type="password" id="pwd" vaule=${this.pwd} @change=${this.updatePwd} />
        </div>
        <button class="login-btn" @click=${this.login} >login</button>
      </div>
      <div class="info">
        <div>
          <button @click=${this.setImportent}>
            ${this.isImportent ? 'show important' : 'show not important'}
          </button>
        </div>
        <div>
          <ul>
            ${until(this.notes, html`<span class=${classMap({ loginError: this.loginError || true })}>${this.loginError ? this.loginError : 'Loading...'}</span>`)}
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
