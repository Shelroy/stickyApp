import React, { useEffect, useState} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from "jwt-decode";
 
const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)  
  useEffect(() => {
    let token = localStorage.getItem('user')  
        if(token){
            let tokenExpiration = jwtDecode(token).exp;
            
          
            let dateNow = new Date();
            if(tokenExpiration < dateNow.getTime()){
            
                setIsAuthenticated(false)
            }else{
                setIsAuthenticated(true)
            }
        } else {
           setIsAuthenticated(false)
        }
  },[])


  if(isAuthenticated === null){
    return <></>
  }
  return isAuthenticated  ? <Outlet /> : <Navigate to="/login" />

};




export default ProtectedRoute;
