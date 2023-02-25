import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from "react-toastify";

type ServerError = { errorMessage: string };

interface FetchData {
    method: string,
    url: string,
    data? : {},
    header : {},
}

// 에러를 catch하는 부분만 따로 추상화를 해서, 제시되는 메소드 변수에 따라 다른 로직이 구현되도록 함
// 에러가 캐치되면 모두 null을 반환
const fetchAuth = async (fetchData: FetchData) => {
    const method = fetchData.method;
    const url = fetchData.url;
    const data = fetchData.data;
    const header = fetchData.header;

    try {
        const response:AxiosResponse<any, any> | false =
            (method === 'get' && (await axios.get(url, header))) ||
            (method === 'post' && (await axios.post(url, data, header))) ||
            (method === 'put' && (await axios.put(url, data, header))) ||
            (method === 'delete' && (await axios.delete(url, header)));

        if (!response) {
            toast.error("로그인에 실패했습니다 😭", {
                position: "top-center",
                autoClose: 1500,
            });
            return null;
        }

        return response;
    } catch(err) {
        if (axios.isAxiosError(err)) {
            const serverError = err as AxiosError<ServerError>;
            if (serverError && serverError.response) {
                toast.error(serverError.response.data + " 😭", {
                    position: "top-center",
                    autoClose: 1500,
                });
                return null;
            }
        }

        toast.error(err + " 😭", {
            position: "top-center",
            autoClose: 1500,
        });
        return null;
    }
}

// Rest API에서 주로 쓰이는 GET, POST, PUT, DELETE를 각각의 메소드로 분리
const GET = ( url:string, header:{} ) => {
    const response = fetchAuth({ method: 'get', url, header});
    return response;
};

const POST = ( url:string, data:{}, header:{}) => {
    const response = fetchAuth({ method: 'post', url, data, header});
    return response;
};

const PUT = async ( url:string, data: {}, header:{}) => {
    const response = fetchAuth({method: 'put', url, data, header});
    return response;
};

const DELETE = async ( url:string, header:{} ) => {
    const response = fetchAuth({ method: 'delete', url, header });
    return response;
}

export { GET, POST, PUT, DELETE }