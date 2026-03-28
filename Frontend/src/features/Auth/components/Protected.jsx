import React from 'react'
import { useAuth } from '../hook/useAuth'
import { Navigate } from 'react-router';

const Protected = ({ children }) => {
    const { User , loading} = useAuth();

    if(loading){
        return <div>Loading...</div>
    }
    
    if(!loading && !User){
        return <Navigate to="/login"/>;
    }

  return (
    children
  )
}

export default Protected