import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const apiUrl = "http://localhost:5000/users/login";
// const apiUrl = "users/login";

function Login() {
  const [contact, setContact] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(false)
  let navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setContact((prevValue) => {
      if (name === "username") {
        return {
          username: value,
          password: prevValue.password,
        };
      } else if (name === "password") {
        return {
          username: prevValue.username,
          password: value,
        };
      }
    });
  }
  // Make a post request to the backend
  const login = async () => {
    try{
        const response = await axios.post(apiUrl, {
        username: contact.username,
        password: contact.password,
      });
        if (response.data.token) {
          console.log(response);
          localStorage.setItem("user", JSON.stringify(response.data));
          return navigate("/");
        }

    }catch(err) {
        setError(true);
      };

  }
  const onSubmit = (e)=>{
    e.preventDefault();
    login();
  }

  //######    END OF LOGIN FUNCTION  ##

  return (
    <div>
      <Header />
      <div className="container">

        <h1>Sign in</h1>
       

       <form className="form" onSubmit= {(e) => onSubmit(e)} >
        
          <input
            type="email"
            className="form-input"
            onChange={handleChange}
            value={contact.username}
            name="username"
            placeholder="Email"
            autoComplete="off"
            required
          />
          <input
            type="password"
            className="form-input"
            onChange={handleChange}
            value={contact.password}
            name="password"
            placeholder="Password"
            autoComplete="off"
          />

          <Button
           
            className="form-button"
            variant="warning"
            size="lg"
            type="submit"
          >
            Login
          </Button>
          
         
          <div className="bottom-message">
          <Link to="/register" className="login-message"> 
           <p>Signup for a Sticky account </p></Link>
           

          </div>
           
          
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
