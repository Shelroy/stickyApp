import axios from "axios";
import authHeader from "./authHeader";

const API_URL = 'http://localhost:5000/users/login';
// const API_URL = 'login';
const getAccess = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};


export default {
 getAccess
};