import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const API_register = "http://localhost:5000/users/register";
// const API_register = "users/register";
export default function Register() {

  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(false);

  let navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prevValue) => {
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
  const registerUser = async () => {

    try {
      const response = await axios.post(API_register, {
        username: values.username,
        password: values.password,
      });
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log(response.data.token);
        return navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError(true);
    };
  
  
  
  };
  const onSubmit = (e)=>{
    e.preventDefault();
    registerUser();
  }
    

  return (
    <div>
      <Header />

      <div className="container">
        <h1>Sign up</h1>
          {errors.username}
        {error && <p className="error">Username already taken</p>}
        

        <form className="form" onSubmit= {(e) => onSubmit(e)} >
          <input
          
            type="email"
            className="form-input"
            onChange={handleChange}
            value={values.username}
            name="username"
            placeholder="Enter your Email"
            autoComplete="off"
            id = "username"
            required
           

          />
          {/* {errors.username && <p> {errors.username} </p>} */}

          <input
            type="password"
            className="form-input"
            onChange={handleChange}
            value={values.password}
            name="password"
            placeholder="Password"
            autoComplete="off"
            required
          />
          {/* {errors.password && <p> {errors.password} </p>} */}
          <Button
            // onClick = {registerUser }
            className="form-button"
            variant="warning"
            size="lg"
            type = "submit"          
          >
            Register
          </Button>

          <div className="bottom-message ">
            <Link to="/login" className="login-message">
              <p>Login to your Sticky account </p>
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
