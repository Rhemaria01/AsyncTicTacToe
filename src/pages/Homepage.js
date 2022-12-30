import React,{useEffect,useContext} from 'react'
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'

import "../css/Homepage.css"
const Homepage = () => {
  const context = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      context.setUser(user);
    }
  }, [])

  return (
    context.user ? <Navigate to='/home' /> :
    <div className='homepage'>
        <div className='homepage-title'>
            <h1>async</h1>
            <h2>tic tac toe</h2>
        </div>
        <div className='homepage-buttons'>
            <button className='login'><Link to="/login" className='link' exact="true">Login</Link></button>
            <button className='register'><Link to="/register" className='link' exact="true">Register</Link></button>
        </div>    
    </div>
    
  )
}

export default Homepage