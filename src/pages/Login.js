import React,{useContext,useState, useEffect} from 'react'
import { UserContext } from '../context/UserContext'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import Home from './Home'

import Back from '../components/Back'
import "../css/Auth.css"
import { redirect } from 'react-router';


const Login = () => {
    const context = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({
        error: false,
        message: ''
    });

    const signinUser = async (e) => {
        e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    context.setUser(user);



    
    // ...
     })
    .catch((error) => {
    setError({
        error: true,
        message: error.message
    });
    
    });
    }
  return (
    <>
        
        {context.user ? <Home /> : <>
        <Back />
        <form className='authpage auth-form'>
        <div>
            <h4>Login</h4>
            <h2>Please enter your details</h2>
            <h4>Your name</h4>
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            <h4>Your password</h4>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
            <button type="button"  className='error-btn' hidden={!error.error}>{error.message}</button>
            <button type="submit" onClick={e => signinUser(e)} className='regis-btn' >Login</button>
        </div>    
        </form>    
        </>}
    </>
  )
}

export default Login