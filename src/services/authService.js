// import Axios from 'axios';
import axios from 'axios';
import { BACKEND_DOMAIN } from '../config/settingSystem';

export const authServices = {
  
  signin: (data) => {
    return axios({
      url: `${BACKEND_DOMAIN}/login`,
      method: 'POST',
      data
    })
  },
  getUserInfor: () => {
    return axios({
      url: `${BACKEND_DOMAIN}/profile`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') }
    })
  },
  logout: () => {
    const refreshToken = {
      refresh_token: localStorage.getItem('refresh_token'),
    }
    return axios({
      method: 'POST',
      url: `${BACKEND_DOMAIN}/logout`,
      data: refreshToken,
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') }
    })
  },
  deleteRefreshToken: () => {
    const refreshToken = {
      refresh_token: localStorage.getItem('refresh_token'),
    }
    return axios({
      method: 'POST',
      url: `${BACKEND_DOMAIN}/delete-refresh-token`,
      data: refreshToken,
    })
  },
  refreshAccessToken: () => {
    const refreshToken = {
      refresh_token: localStorage.getItem('refresh_token'),
    }
    return axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/refresh-token`,
      data: refreshToken,
    })
  }

}




// const login = (user) => {
//   return axios.post(`${API_URL}/login`, user);
// };

// const logout = () => {
//   localStorage.removeItem('user');
// };

// export { login, logout };
