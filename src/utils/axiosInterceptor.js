import axios from "axios";
import { checkAccessToken, checkRefreshToken } from "./checkEXPToken";
import { authServices } from "../services/authService";
import { useDispatch } from "react-redux";
import { logoutAction } from "../store/actions/authActions";
import { useNavigate } from "react-router-dom";
let axiosCustom = axios.create();
axiosCustom.interceptors.request.use(
  async(config) => {
    if(checkAccessToken() === false) {
      if(checkRefreshToken() === false) {
      }else{
        let res = await authServices.refreshAccessToken()
      }
    }else{
      const dispatch = useDispatch();
      const navigate = useNavigate()
      dispatch(logoutAction(navigate))
    }
    return config;
  }, err => {
    return Promise.reject(err);
  }
);
export default axiosCustom;

