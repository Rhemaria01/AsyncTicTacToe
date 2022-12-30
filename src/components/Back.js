import React from 'react'
import {useNavigate} from 'react-router-dom'
import {IoIosArrowBack} from 'react-icons/io'
const Back = () => {
    const navigate = useNavigate();
  return (
    <button onClick={()=>navigate(-1)} className='back-button'><IoIosArrowBack /></button>
  )
}

export default Back