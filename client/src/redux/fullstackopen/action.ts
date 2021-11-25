import { Config, LoginInfo } from "./reducer.js";

export const updateConfig = (hostName: string) => ({
    type: 'UPDATE_CONFIG_HOSTNAME',
    payload: hostName
});

export const updateLoginInfo = (loginInfo: LoginInfo) => ({
    type: 'UPDATE_LOGIN_INFO',
    payload: loginInfo
});
