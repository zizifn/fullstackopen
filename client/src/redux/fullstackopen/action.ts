import { Authing, LoginInfo } from "./reducer.js";

export const updateConfigHostName = (hostName: string) => ({
    type: 'UPDATE_CONFIG_HOSTNAME',
    payload: hostName
});
export const updateConfigAuth = (authing: Authing) => ({
    type: 'UPDATE_CONFIG_AUTH',
    payload: authing
});

export const updateLoginInfo = (loginInfo: LoginInfo) => {
    console.log('');
    return {
        type: 'UPDATE_LOGIN_INFO',
        payload: loginInfo
    }
};
