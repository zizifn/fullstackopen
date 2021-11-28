import './login/Login.js';
import './info-bar/User-Info.js';

import { FullStackOpen } from './FullStackOpen.js';
import { TestElement } from './test-redux.js';
import { TestElement2 } from './test-redux2.js';

// const guard = new AuthingGuard('619ddd69dc964a797191d905')

// // 事件监听
// guard.on('load', (authClient) => console.log(authClient))
// guard.on('login', (user) => {
//     console.log(user)
// })

customElements.define('full-stack-open', FullStackOpen);
customElements.define('test-element', TestElement);
customElements.define('test-element2', TestElement2);

