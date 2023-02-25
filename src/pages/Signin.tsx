import * as React from 'react';
import * as Yup  from "yup";
import { Formik } from "formik";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import CssBaseline from "@mui/material/CssBaseline";
import { Avatar, Paper, TextField } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '../modules/components/Typography';
import AppFooter from '../modules/views/AppFooter';
import AppAppBar from '../modules/views/AppAppBar';
import withRoot from '../modules/withRoot';
import { blueGrey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { useContext } from "react";
import AuthContext from "../store/auth-context";

// 유효성 검사를 위한 yup 라이브러리 기능을 변수에 담는다
const ValidationSchema = Yup.object().shape({
    userID: Yup.string()
        .required("아이디를 입력하세요!"),
    userPW: Yup.string()
        .required("패스워드를 입력하세요!"),
});

function SignIn() {
    const authCtx = useContext(AuthContext);

    const submit  = async (values: any) => {
        const {userID, userPW} = values;
        authCtx.login(userID, userPW);
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
                        backgroundImage: 'url(https://images.unsplash.com/photo-1558486012-817176f84c6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=740&q=80)',
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
                        <Avatar sx={{m: 1, bgcolor: blueGrey[500]}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{mb: 4}} fontFamily="YangJin">
                            Sign In
                        </Typography>
                        <Formik
                            initialValues={{
                                userID: "",
                                userPW: "",
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
                                    </Grid>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        sx={{mt: 3, mb: 2}}
                                    >
                                        로그인
                                    </Button>
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Link href="/signup" variant="body2">
                                                아직 회원이 아니신가요? 회원가입하기
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

export default withRoot(SignIn);