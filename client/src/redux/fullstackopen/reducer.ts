import { createStore } from "redux";
interface Config {
    hostName?: string;
}

interface LoginInfo {
    isLogin: boolean,
    userName: string,
    jwtToken: string;
}

interface FullStackOpenState {
    config: Config;
    loginInfo: LoginInfo
}

const INIT_STATE: FullStackOpenState = {
    config: {},
    loginInfo: {} as LoginInfo
}
const fullStackOpenReducer = (state: FullStackOpenState = INIT_STATE, action: any) => {
    let newState: FullStackOpenState = {} as FullStackOpenState;
    switch (action.type) {
        case 'UPDATE_CONFIG_HOSTNAME':
            newState = {
                ...state,
                config: {
                    ...state.config,
                    hostName: action.payload
                }
            };
            break;
        case 'UPDATE_LOGIN_INFO':
            newState = {
                ...state,
                loginInfo: {
                    ...action.payload
                }
            };
            break;
        default:
            newState = state;
    }

    return newState;
}

// const counterStore = createStore(counterReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__()(1));
const fullStackOpenStore = createStore(fullStackOpenReducer);


// counterStore.subscribe(
//     () => {
//         console.log(counterStore.getState().count);
//     }
// )
export {
    fullStackOpenStore,
    Config,
    FullStackOpenState,
    LoginInfo
};
