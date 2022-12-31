import React,{useState,useContext} from 'react'
import { UserContext } from '../context/UserContext'
import Back from '../components/Back'

import db from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { doc, setDoc} from "firebase/firestore"; 
import "../css/Auth.css"
import { Link } from 'react-router-dom';



const Register = () => {
    const auth = getAuth();
    const context = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [register, setRegister] = useState(false);
    const [error, setError] = useState({
      error: false,
      message: ''
  });

     const   createUser  = async (e) => {
        e.preventDefault();
        if (userName.length < 6) {
            setError({
                error: true,
                message: 'Username should be atleast 6 characters long'
            });
            return;
        }
        if (name.length < 3) {
          setError({
              error: true,
              message: 'Username should be atleast 3 characters long'
          });
          return;
      }
        if (password.length < 6) {
            setError({
                error: true,
                message: 'Password should be atleast 6 characters long'
            });
            return;
        }

        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            setError({
                error: false,
                message: ''
            });
            setDoc(doc(db, "users", user.uid), {
                Name: name,
                Email: user.email,
                UserName: userName,
                userId: user.uid,
                Session: []
              });
            context.setUser(user);
            setRegister(true);
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
        <Back />

        <form className='authpage auth-form '>
        <div>
        <h4>Create account</h4>
        <h2>Let's get to know you better!</h2>

            <h4>Your name</h4>
            <input type="text" onChange={(e)=>setName(e.target.value)} placeholder="Type your name here" required={true} disabled={register} />
            <h4>Username</h4>
            <input type="text" onChange={(e)=>setUserName(e.target.value)} placeholder="Type your username here" required={true} disabled={register}/>
            
            <h4 hidden={register}>Email</h4>
            <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Type your email here" hidden={register}/>
            <h4>Password</h4>
            <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Type your password here" disabled={register}/>
            </div>  
            <div>
            <Link className='link' to="/login" exact="true"><button type="button"  className='congs-btn' hidden={!register} >Congratulations!!! Account created.</button></Link>
            <button type="button"  className='error-btn' hidden={!error.error}>{error.message}</button>
            <button type="submit" onClick={e => createUser(e)} className='regis-btn' disabled={register}>Register</button>
            </div>
        </form>
</>
  )
}

export default Register