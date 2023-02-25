import { GET, POST } from "./fetch-auth-action";

// 토큰을 만드는 함수
const createTokenHeader = (token:string) => {
    // auth-action.ts 내부에서만 사용
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
}

// 토큰의 만료시간을 계산하는 함수
const calculateRemainingTime = (expirationTime:number) => {
    // auth-action.ts 내부에서만 사용
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
};

// 토큰 값과 만료시간을 부여받으면 그것을 localStorage 내부에 저장해주는 함수
export const loginTokenHandler = (token:string, expirationTime:number) => {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', String(expirationTime));

    const remainingTime = calculateRemainingTime(expirationTime);
    return remainingTime;       // 남은 시간을 반환
}

// localStorage 내부에 토큰이 존재하는지 검색하는 함수
export const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime') || '0';

    const remaingTime = calculateRemainingTime(+ storedExpirationDate);

    if(remaingTime <= 1000) {                               // 만약 시간이 1초 아래로 남았으면
        localStorage.removeItem('token');               // 자동으로 토큰을 삭제
        localStorage.removeItem('expirationTime');
        return null;
    }

    // 만약 존재한다면, 만료까지 남은 시간과 토큰값을 같이 객체로 반환
    return {
        token: storedToken,
        duration: remaingTime
    }
}

// 회원가입 URL로 POST 방식으로 호출하는 함수
export const signupActionHandler = (userID: string, userPW: string, nickname: string) => {
    const URL = '/auth/signup';
    const signupObject = { userID, userPW, nickname };
    const response = POST(URL, signupObject, {});
    return response;            // 통신으로 반환된 RESPONSE를 반환 (반환 타입: Promise<AxiosResponse<any, any> | null>)
};

// 로그인 URL을 POST 방식으로 호출하는 함수
export const loginActionHandler = (userID:string, userPW:string) => {
    const URL = '/auth/login';
    const loginObject = { userID, userPW };
    const response = POST(URL, loginObject, {});
    return response;
}

// 로그아웃을 해주는 함수
export const logoutActionHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('nickname');
};

// 유저의 정보를 GET 방식으로 호출하는 함수
export const getUserActionHandler = (token:string) => {
    const URL = '/member/me';
    const response = GET(URL, createTokenHeader(token));        // 토큰값을 헤더에 넣고 호출함
    return response;
}

// 닉네임을 바꿔주는 함수
export const changeNicknameActionHandler = ( nickname:string, token: string ) => {
    // TOKEN 값을 헤더에 붙여줘서 POST 방식으로 호출하나
    // 닉네임에는 바꿀 닉네임만 값으로 보내줌
    const URL = '/member/nickname';
    const changeNicknameObj = { nickname };
    const response = POST(URL, changeNicknameObj, createTokenHeader(token));
    return response;
}

// 패스워드를 바꿔주는 함수
export const changePasswordActionHandler = (
    exPassword: string,
    newPassword: string,
    token: string
) => {
    // TOKEN 값을 헤더에 붙여줘서 POST 방식으로 호출하나
    // 패스워드는 전의 패스워드와 현재의 패스워드 둘다 보내줘야 함
    const URL = '/member/password';
    const changePasswordObj = { exPassword, newPassword };
    const response = POST(URL, changePasswordObj, createTokenHeader(token));
    return response;
}