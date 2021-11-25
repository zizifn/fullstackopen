/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
import {css} from 'lit';
export const styles = css`:host{position:fixed;top:0px;left:0px;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:99999;display:flex;align-items:center;justify-content:center}.login{background-color:#fff;padding:1.25rem;border-radius:1rem;display:flex;align-items:center;flex-direction:column;justify-content:center}.login>*{margin-top:1rem}.login .text-input{caret-color:#4e6ef2;position:relative;box-sizing:border-box;padding:.625rem 1.25rem;margin:0;height:2rem;line-height:1.25rem;width:20rem;border:1px solid #b8b8b8;font-size:1.125rem;color:#1f1f1f;transition:.3s;border-radius:8px}.login .login-btn{line-height:1.25rem;border-radius:5px;box-shadow:0 6px 16px 0 rgba(78,111,242,.3);font-size:1.125rem;color:#1f1f1f;cursor:pointer}.login .social-media{border-top:1px solid gray;width:100%;padding-top:.5rem}`;