import React,{useContext} from 'react'
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'

import "../css/Homepage.css"
const Homepage = () => {
  const context = useContext(UserContext);

  return (
    context.user ? <Navigate to='/home' /> :
    <div className='homepage'>
        <div className='homepage-title'>
            <h1>async</h1>
            <h2>tic tac toe</h2>
        </div>
        <div className='homepage-buttons'>
           <Link to="/login" className='link' exact="true"> <input type="button" className='login' value={"Login"} /></Link>
            <Link to="/register" className='link' exact="true"><input type="button" className='register' value={"Register"}/></Link>
        </div>    
    </div>
    
  )
}

export default Homepage