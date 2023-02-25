import * as React from 'react';
import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/Home';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';

import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);
  return (
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={authCtx.isLoggedIn ? <Navigate to='/'/> : <SignupPage/>} />
          <Route path="/login/*"
                 element={authCtx.isLoggedIn ? <Navigate to='/' /> : <SigninPage/>} />
          <Route path="/profile" element={<HomePage/>} />
      </Routes>
  );
}

export default App;
