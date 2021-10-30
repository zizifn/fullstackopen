/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
import {css} from 'lit';
export const styles = css`:host{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;font-size:calc(10px + 2vmin);color:#1a2b42;max-width:960px;margin:0 auto;text-align:center;background-color:var(--full-stack-open-background-color)}main{flex-grow:1}.logo{margin-top:36px;animation:app-logo-spin infinite 20s linear}@keyframes app-logo-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.app-footer{font-size:calc(12px + .5vmin);align-items:center}.app-footer a{margin-left:5px}`;