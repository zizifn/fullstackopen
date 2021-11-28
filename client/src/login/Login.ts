import { LitElement, html } from 'lit';
import {
    LoginInfo,
    fullStackOpenStore,
} from '../redux/fullstackopen/reducer.js';
import {
    getHostNameSelector,
    getLoginUrlSelector,
    isLoginSelector,
} from '../redux/fullstackopen/selector.js';

import { connect } from 'pwa-helpers';
import { customElement } from 'lit/decorators/custom-element.js';
import { state } from 'lit/decorators.js';
import { styles } from './login.css.js';

@customElement('full-stack-login')
export class FullStackLogin extends connect(fullStackOpenStore)(LitElement) {
    static styles = styles;

    hostName: string = '';

    userName = '';

    pwd = '';

    @state()
    isLogin: boolean = true;

    logingUrl: string = '';

    stateChanged(fullStackOpenStoreParm: any) {
        this.hostName = getHostNameSelector(fullStackOpenStoreParm);
        this.isLogin = isLoginSelector(fullStackOpenStoreParm);
        this.logingUrl = getLoginUrlSelector(fullStackOpenStoreParm);
    }

    private async login() {
        console.log('username', this.userName);
        console.log('pwd', this.pwd);

        const loginResp = await fetch(`${this.hostName}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.userName,
                password: this.pwd,
            }),
        });
        if (loginResp.ok) {
            const result = await loginResp.json();
            localStorage.setItem('jwtToken', result.token);
            console.log(result);
            // this.loadNote();
            fullStackOpenStore.dispatch({
                type: 'UPDATE_LOGIN_INFO',
                payload: {
                    isLogin: true,
                    userName: result.username,
                    jwtToken: result.token,
                } as LoginInfo,
            });
        } else {
            console.error('login faild');
            localStorage.removeItem('jwtToken');
            // this.loginError = "login error";
            fullStackOpenStore.dispatch({
                type: 'UPDATE_LOGIN_INFO',
                payload: {
                    isLogin: false,
                } as LoginInfo,
            });
        }
    }

    private async loginAuthing() {
        window.location.replace(this.logingUrl);
    }


    render() {
        return html` <div class="login">
      <div class="username">
        <!-- <label for="username">username</label> -->
        <input
          class="text-input"
          id="username"
          type="text"
          vaule=${this.userName}
          @change=${(e: Event) => {
                this.userName = (e.target as HTMLInputElement).value;
            }}
          placeholder="user name"
        />
      </div>
      <div class="pwd">
        <input
          class="text-input"
          type="password"
          id="pwd"
          vaule=${this.pwd}
          @change=${(e: Event) => {
                this.pwd = (e.target as HTMLInputElement).value;
            }}
          placeholder="password"
        />
      </div>
      <button class="login-btn" @click=${this.login}>login</button>
      <button class="login-btn" @click=${this.loginAuthing}>login with authing</button>
      <div class="social-media">
      <button class="login-btn">github</button>
      <a href=${`https://github.com/login/oauth/authorize?scope=user&client_id=Iv1.1045dd5c49ad6688&redirect_uri=${this.hostName}/api/oauth/github/redirect`}>login with github</a>
      </div>
    </div>`;
    }
}
