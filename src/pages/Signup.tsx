import React, { useContext, useEffect } from 'react';
import * as Yup  from "yup";
import { Formik } from "formik";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import CssBaseline from "@mui/material/CssBaseline";
import {Avatar, Paper, TextField} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '../modules/components/Typography';
import AppFooter from '../modules/views/AppFooter';
import AppAppBar from '../modules/views/AppAppBar';
import withRoot from '../modules/withRoot';
import { pink } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AuthContext from '../store/auth-context';

// 유효성 검사를 위한 yup 라이브러리 기능을 변수에 담는다
const ValidationSchema = Yup.object().shape({
    userID: Yup.string()
        .required("아이디를 입력하세요!")
        .matches(
            /^[^ㄱ-ㅎ ㅏ-ㅣ 가-힣]*$/,
            "아이디에 한글은 입력할 수 없습니다!"
        ),
    userPW: Yup.string()
        .min(8, "비밀번호는 최소 8자리 이상입니다")
        .max(16, "비밀번호는 최대 16자리입니다")
        .required("패스워드를 입력하세요!")
        .matches(
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]*$/,
            "영문자, 숫자, 특수문자를 포함해야 합니다!"
        ),
    nickname: Yup.string()
        .min(2, "닉네임은 최소 2글자 이상 입력해야 합니다!")
        .max(10, "닉네임은 최대 10글자입니다!")
        .matches(
            /^[가-힣a-zA-Z][^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
            "닉네임에 특수문자는 포함할 수 없으며, 숫자로 시작할 수 없습니다!"
        )
        .required("닉네임을 입력하세요!")
});

function SignUp() {
    let navigate = useNavigate();
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        if (authCtx.isSuccess) {
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [authCtx.isSuccess])

    const submit  = async (values: any) => {
        const {userID, userPW, nickname} = values;

        authCtx.signup(userID, userPW, nickname);
    };

    return (
        <React.Fragment>
            <AppAppBar/>
            <Grid container component="main" sx={{height: '100vh'}}>
                <CssBaseline/>
                <ToastContainer/>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1605003179269-c446bb939f00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            marginTop: 8,
                            marginLeft: 5,
                            marginRight: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{m: 1, bgcolor: pink[500]}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{mb: 4}} fontFamily="YangJin">
                            Sign Up
                        </Typography>
                        <Formik
                            initialValues={{
                                userID: "",
                                userPW: "",
                                nickname: "",
                            }}
                            validationSchema={ValidationSchema}
                            onSubmit={submit}
                            validateOnMount={true}>
                            {({ values,
                                  errors,
                                  handleChange,
                                  handleSubmit,
                                  isSubmitting }) => (
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoFocus
                                            fullWidth
                                            id="userID"
                                            label="아이디"
                                            name="userID"
                                            value={values.userID}
                                            onChange={handleChange}
                                            helperText={errors.userID ? errors.userID : ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="userPW"
                                            label="비밀번호"
                                            type="password"
                                            id="userPW"
                                            autoComplete="new-password"
                                            value={values.userPW}
                                            onChange={handleChange}
                                            helperText={errors.userPW ? errors.userPW : ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="nickname"
                                            label="닉네임"
                                            id="nickname"
                                            autoComplete="off"
                                            value={values.nickname}
                                            onChange={handleChange}
                                            helperText={errors.nickname ? errors.nickname : ''}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{mt: 3, mb: 2}}
                                >
                                    회원가입
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link href="/login" variant="body2">
                                            이미 회원이신가요? 로그인하기
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                            )}
                        </Formik>
                    </Box>
                </Grid>
            </Grid>
            <AppFooter/>
        </React.Fragment>
    );
}

export default withRoot(SignUp);