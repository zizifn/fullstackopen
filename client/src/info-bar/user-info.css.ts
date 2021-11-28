/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
import {css} from 'lit';
export const styles = css`:host{position:fixed;top:0px;left:0px;width:100vw;background:rgba(0,0,0,.5);z-index:99999;height:2rem}.info-bar{display:flex;align-items:center;justify-content:flex-end}.username{position:relative}.username .name-section{height:1.5rem}.username .user-dropdown{display:none;position:absolute;background-color:#fff;right:0}.username .user-dropdown.show{display:block}.username .user-dropdown ul{padding:.625rem;margin:0;list-style-type:none}.username .user-dropdown ul li{white-space:nowrap;padding:.3125rem}.username .user-dropdown ul li:hover{background:#eff2f6}`;