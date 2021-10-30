import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './FullStackOpen.css'

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class FullStackOpen extends LitElement {
  @property({ type: String }) title = 'My app';

  static styles = styles;

  render() {
    return html`
    <div>
    <p>Notes</p>
    </div>
    `;
  }
}
