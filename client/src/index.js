import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
  import App from "./components/App";
  import Login  from "./components/Login";
 

  import Register from "./components/Register";
  import ProtectedRoute from "./components/ProtectedRoute";

ReactDOM.render(
<BrowserRouter>
    <Routes>
      <Route exact path="register" element={<Register />} />
      <Route exact path="login" element={<Login />} />

      <Route exact path='/' element={<ProtectedRoute/>}>
            <Route exact path='/' element={<App/>}/>
       </Route>




    </Routes>
    </BrowserRouter>, 
    document.getElementById("root"));
