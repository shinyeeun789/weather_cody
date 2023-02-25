import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { AuthContextProvider } from "./store/auth-context";

// URL의 이동을 토큰이 존재하냐 안하냐의 여부로 제어할 것이기 때문에 BrowserRouter를 App 위에 덮어줌
// Context 적용을 위해 AuthContextProvider를 덮어줌
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <AuthContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthContextProvider>
);