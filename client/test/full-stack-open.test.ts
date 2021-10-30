import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import { FullStackOpen } from '../src/FullStackOpen.js';
import '../src/full-stack-open.js';

describe('FullStackOpen', () => {
  let element: FullStackOpen;
  beforeEach(async () => {
    element = await fixture(html`<full-stack-open></full-stack-open>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
