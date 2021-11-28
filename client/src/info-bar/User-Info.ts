import { customElement } from 'lit/decorators/custom-element.js';
import { LitElement, html } from 'lit';
import { connect } from 'pwa-helpers';
import { query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import {
    fullStackOpenStore,
    LoginInfo,
} from '../redux/fullstackopen/reducer.js';
import {
    getHostNameSelector,
    getUserInfo,
    isLoginSelector,
} from '../redux/fullstackopen/selector.js';
import { styles } from './user-info.css.js';

@customElement('full-stack-user-info')
export class FullStackOpenUserInfo extends connect(fullStackOpenStore)(
    LitElement
) {
    static styles = styles;

    hostName: string = '';

    userName = '';

    pwd = '';

    @state()
    userInfo: LoginInfo = {} as LoginInfo;

    @state()
    expandUserInfo: boolean = false;

    @query('#name-section')
    nameSection!: HTMLDivElement

    constructor() {
        super();
        window.addEventListener('click', event => {
            if (this.nameSection && !event.composedPath().includes(this.nameSection)) {
                this.expandUserInfo = false;
            }
        })
    }

    stateChanged(fullStackOpenStoreParm: any) {
        this.hostName = getHostNameSelector(fullStackOpenStoreParm);
        this.userInfo = getUserInfo(fullStackOpenStoreParm);
    }

    private static async logOut() {
        localStorage.removeItem('jwtToken');
        window.location.href = "/";
    }

    private static async keypress(ev: KeyboardEvent) {
        if (ev.code === 'Enter') {
            FullStackOpenUserInfo.logOut();
        }
    }

    render() {
        return html` <div class="info-bar">
      <div class="username">
        <button id="name-section" class=${classMap({ 'name-section': true })} @click=${() => {
                this.expandUserInfo = !this.expandUserInfo
            }}>${this.userInfo.userName}</button>
        <div id="user-info-dropdown" class=${classMap({ 'user-dropdown': true, show: this.expandUserInfo })}>
          <ul>
            <li>个人中心</li>
            <li @click=${FullStackOpenUserInfo.logOut} @keypress=${FullStackOpenUserInfo.keypress}>退出</li>
          </ul>
        </div>
      </div>
    </div>`;
    }
}
