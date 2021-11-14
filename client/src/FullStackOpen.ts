import { LitElement, html, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { styles } from './FullStackOpen.css';
import { until } from 'lit/directives/until.js';
import { htmls } from './FullStackOpen.html';

export class FullStackOpen extends LitElement {
  @property({ type: String }) title = 'My app';

  static styles = styles;

  @state()
  notes: Promise<Array<any>>;

  @state()
  isImportent: boolean = false;

  @query('#noteContent')
  noteContent!: HTMLInputElement;

  // noteContent: string = '';

  hostName = '';

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
        notes.push(html`<li>${result.important ? html`<strong>${result.content}</strong>` : `${result.content}`}</li>`);
        this.notes = Promise.resolve(notes);
      } else {
        throw new Error("return 400")
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  constructor() {
    super();
    if (window.location.hostname === 'localhost') {
      this.hostName = "http://localhost:3001";
    }
    this.notes = fetch(`${this.hostName}/api/notes`)
      .then(res => res.json())
      .then(notes =>
        notes.map(
          (note: { important: boolean; content: string; }) => html`<li>${note.important ? html`<strong>${note.content}</strong>` : `${note.content}`}</li>`
        )
      );
  }

  render() {
    return html`
      <div class="title">
        <p>Notes</p>
      </div>
      <div class="info">
        <div>
          <button @click=${this.setImportent}>
            ${this.isImportent ? 'show important' : 'show not important'}
          </button>
        </div>
        <div>
          <ul>
            ${until(this.notes, html`<span>Loading...</span>`)}
          </ul>
        </div>
      </div>
      <div>
        <input id="noteContent"
          type="text"
        />
        <button @click=${this.updateNote}>save</button>
      </div>
    `;
  }
}
