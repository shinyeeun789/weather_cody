import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/auth-context';


const rightLink = {
    fontSize: 16,
    color: 'common.white',
    ml: 3,
};

function AppAppBar() {
    const authCtx = useContext(AuthContext);
    const [nickname, setNickname] = useState('');
    let isLogin = authCtx.isLoggedIn;
    let isGet = authCtx.isGetSuccess;

    const callback = (str:string) => {
        setNickname(str)
    }

    useEffect(() => {
        if (isLogin) {
            authCtx.getUser();
        }
    }, [isLogin]);

    useEffect(() => {
        if (isGet) {
            callback(authCtx.userObj.nickname);
        }
    }, [isGet]);

    const toggleLogoutHandler = () => {
        authCtx.logout();
    }

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }} />
                    <Link
                        variant="h6"
                        underline="none"
                        color="inherit"
                        href="/"
                        sx={{ fontSize: 24 }}
                    >
                        {'WEATHER_CODY🌞'}
                    </Link>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        {!isLogin && <Link
                            color="inherit"
                            variant="h6"
                            underline="none"
                            href="/login"
                            sx={rightLink}
                        >
                            {'Sign In'}
                        </Link>}
                        {!isLogin && <Link
                            variant="h6"
                            underline="none"
                            href="/signup"
                            sx={{ ...rightLink, color: 'secondary.main' }}
                        >
                            {'Sign Up'}
                        </Link>}
                        {isLogin && <Link
                            variant="h6"
                            underline="none"
                            onClick={toggleLogoutHandler}
                            sx={{ ...rightLink }}
                        >
                            {nickname + ' 님🐻‍❄️'}
                        </Link>}
                        {isLogin && <Link
                            variant="h6"
                            underline="none"
                            onClick={toggleLogoutHandler}
                            sx={{ ...rightLink, color: 'secondary.main', cursor: 'pointer' }}
                        >
                            {'Logout'}
                        </Link>}
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </div>
    );
}

export default AppAppBar;