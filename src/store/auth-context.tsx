import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import * as authAction from './auth-action';
import {toast} from "react-toastify";

let logoutTimer: NodeJS.Timeout;

type Props = { children?: React.ReactNode }
type UserInfo = { userID: string, nickname: string};
type LoginToken = {
    grantType: string,
    accesstoken: string,
    tokenExpiresIn: number
}

// createContext는 각각의 컴포넌트에 포함되는 객체를 만드는 로직
const AuthContext = React.createContext({
    // 객체 안에는 state와 state를 컨트롤하는 함수를 넣음
    // 이후 이 state와 함수들은 인스턴스로 불러오게 됨
    token: '',
    userObj: { userID: '', nickname: '' },
    isLoggedIn: false,
    isSuccess: false,
    isGetSuccess: false,
    signup: (userID: string, userPW: string, nickname:string) =>  {},
    login: (userID:string, userPW: string) => {},
    logout: () => {},
    getUser: () => {},
    changeNickname: (nickname:string) => {},
    changePassword: (exPassword: string, newPassword: string) => {}
});


// Context의 Provider 역할, Context의 변화를 알리는 Provider 컴포넌트를 반환하는 함수
// Provider의 value로는 생성하거나 로직을 구현한 state와 함수들을 넣어주고, props.children을 통해 wrapping될 모든 컴포넌트에게 적용되게 함
// 여기에서는 index.tsx를 wrapping할 예정이므로 모든 tsx에게 적용이 됨
export const AuthContextProvider:React.FC<Props> = (props) => {

    const tokenData = authAction.retrieveStoredToken();     // token을 확인하는 함수를 실행하여 안의 값을 넣어줌

    let initialToken:any;
    if (tokenData) {            // 존재한다면
        initialToken = tokenData.token!;        // initialToken의 값은 tokenData의 token 값이 됨
    }

    const [token, setToken] = useState(initialToken);       // token을 token이라는 상태에 넣어줌
    const [userObj, setUserObj] = useState({       // userObj는 사용자의 정보를 담기 위한 객체
        userID: '',
        nickname: ''
    });

    // isSuccess, isGetSuccess는 정확히 데이터가 나왔는지, 비동기 시스템에서의 처리를 위한 상태
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isGetSuccess, setIsGetSuccess ] = useState<boolean>(false);

    const userIsLoggedIn = !!token;     // token이 존재하냐 안하냐에 따라 값이 변함

    // 회원가입을 하는 함수
    const signupHandler = (userID:string, userPW: string, nickname: string) => {        // Form에서 받은 변수들
        setIsSuccess(false);
        const response = authAction.signupActionHandler(userID, userPW, nickname);      // 받은 변수들을 signupActionHandler에 넣어줌
        // Promise 객체인 response를 비동기처리를 통해
        response.then((result) => {
            if (result !== null) {              // Promise 내부의 result가 null이 아닐 경우(error가 없을 경우),
                toast.success(<h5> 회원가입이 완료되었습니다.<br/>로그인 하세요😎 </h5>, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000});
                setIsSuccess(true);       // isSuccess의 상태를 변화시켜서 성공했음을 나타냄
            }
        });
    }

    // 로그인을 하는 함수
    const loginHandler = (userID:string, userPW: string) => {
        setIsSuccess(false);

        const data = authAction.loginActionHandler(userID, userPW);     // loginActionHandler에서 받아온 데이터에서 토큰을 추출해냄
        data.then((result) => {
            if (result !== null) {
                const loginData:LoginToken = result.data;
                setToken(loginData.accesstoken);                        // 전역상태에 token의 값을 설정
                logoutTimer = setTimeout(                               // 만료시간이 지나면 로그아웃 실행
                    logoutHandler,
                    authAction.loginTokenHandler(loginData.accesstoken, loginData.tokenExpiresIn)       // 만료시간은 auth-action.ts의 loginTokenhandler에 토큰과 토큰 만료일을 넣고 반환된 값을 기준으로 삼음
                );

                setIsSuccess(true);
            }
        })
    };

    // 로그아웃하는 함수
    const logoutHandler = useCallback(() => {       // useEffect를 통해 토큰이 없어지면 자동으로 로그아웃을 실행하게 할 것이므로, 무한루프를 막기 위해 useCallback으로 감싸줌
        setToken('');                                 // token의 상태를 빈 값으로 만들어줌
        authAction.logoutActionHandler();                   // localStorage의 토큰값을 지움
        if (logoutTimer) {                                  // logoutTimer가 존재한다면
            clearTimeout(logoutTimer);                      // Timer도 지워줌
        }
    }, []);

    const getUserHandler = () => {
        setIsGetSuccess(false);
        const data = authAction.getUserActionHandler(token);    // getUserActionHandler에 전역 상태에 있는 token의 값을 넣어주고 Promise 객체인 data를 받음
        data.then((result) => {
            if (result != null) {                              // data가 null이 아닐 경우
                const userData:UserInfo = result.data;
                setUserObj(userData);                           // 안의 객체를 뽑아내 userObj 상태에 객체를 넣음
                setIsGetSuccess(true);
            }
        })
    };

    const changeNicknameHandler = (nickname:string) => {
        setIsSuccess(false);

        const data = authAction.changeNicknameActionHandler(nickname, token);
        data.then((result) => {
            if (result !== null) {
                const userData:UserInfo = result.data;
                setUserObj(userData);
                setIsSuccess(true);
            }
        })
    };

    const changePaswordHandler = (exPassword:string, newPassword: string) => {
        setIsSuccess(false);
        const data = authAction.changePasswordActionHandler(exPassword, newPassword, token);
        data.then((result) => {
            if (result !== null) {          // 에러 없이 제대로 실행될 경우
                setIsSuccess(true);
                logoutHandler();            // 로그아웃시킴
            }
        });
    };
    
    // retrieveStoredToken으로 받은 token 값과 logoutHandler를 종속변수로 삼는 useEffect 훅
    useEffect(() => {                 // 만료시간이 될 경우 자동으로 logoutHandler를 실행시킴
        if(tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);


    const contextValue = {
        token,
        userObj,
        isLoggedIn: userIsLoggedIn,
        isSuccess,
        isGetSuccess,
        signup: signupHandler,
        login: loginHandler,
        logout: logoutHandler,
        getUser: getUserHandler,
        changeNickname: changeNicknameHandler,
        changePassword: changePaswordHandler
    }

    return(
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;