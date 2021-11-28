/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
import {css} from 'lit';
export const styles = css`:host{display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;color:#1a2b42;max-width:960px;margin:0 auto;background-color:var(--full-stack-open-background-color)}.login{display:flex;flex-direction:column}.login .notshow{display:none}.login .username{display:flex}.login .username label{width:5rem}.login .pwd{display:flex}.login .pwd label{width:5rem}.login .login-btn{align-self:flex-start;background-color:#fff;border:1px solid gray}.title{margin-top:1rem}.info li::marker{color:#74767a}.info .loginError{color:red}`;