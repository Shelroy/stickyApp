import React from "react";
import Highlight from '@material-ui/icons/Highlight';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";



function Header(props) {
  function logout(){
    localStorage.removeItem("user");
  

  };
  

  const login = props.login;
  return (
    <header>
    
     <h1>
     <Highlight />
      <Link to="/" style={{ textDecoration: 'none', color :'white'}}>Sticky</Link>
      </h1>

      

{
  login ?  <Button  
      onClick ={logout} 
      style={{ marginLeft: "auto" }}
      variant="outlined" 
      component = {Link} 
      to="/login">
      Logout
      </Button>
      :  
      
      <Button  
      style={{ marginLeft: "auto" }}
      variant="outlined" 
      component ={Link} 
      to="/login" >
      Login
      </Button>
     

}
      

      
      
  

  
    </header>
  );
}

export default Header;
