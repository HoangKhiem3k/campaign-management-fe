import { ROLES, STATUS_CODE } from '../../config/settingSystem';
import { authServices } from '../../services/authService';
import { checkAccessToken } from '../../utils/checkEXPToken';
import { LOGIN_ERROR, LOGIN_START, LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../types/authType';
import { turnOffLoader, turnOnLoader } from './loaderAction';

// login action
export const loginAction = (loginInfo, navigate) => {
  return async (dispatch) => {
    dispatch(turnOnLoader());
    try {
      const res = await authServices.signin(loginInfo)
      if (res.data.statusCode === STATUS_CODE.SUCCESS) {
        localStorage.setItem('access_token', (res.data.access_token));
        localStorage.setItem('access_token_exp', (res.data.access_token_exp));
        localStorage.setItem('refresh_token', (res.data.refresh_token));
        localStorage.setItem('refresh_token_exp', (res.data.refresh_token_exp));
        const resUserInfor = await authServices.getUserInfor()
        dispatch(loginSuccess(resUserInfor.data.content))
        if (resUserInfor.data.content.role_name === ROLES.ADMIN) {
          return navigate('/admin')
        }
        if (resUserInfor.data.content.role_name === ROLES.DAC_MEMBER) {
          return navigate('/dac-member')
        }
        if (resUserInfor.data.content.role_name === ROLES.ADMIN) {
          return navigate('/advertiser')
        }
        dispatch(turnOffLoader())
      } else {
        alert(res.data.message);
        dispatch(loginFailed())
        dispatch(turnOffLoader())
      }
    } catch (e) {
      dispatch(loginFailed())
      dispatch(turnOffLoader())
    }
  }
};
export const loginStart = () => {
  return {
    type: LOGIN_START
  }
}
export const loginSuccess = (payload) => {
  return {
    type: LOGIN_SUCCESS,
    payload
  }
}
export const loginFailed = () => {
  return {
    type: LOGIN_ERROR,
  }
}
// logout 
export const logoutAction = (navigate) => {
  return async (dispatch) => {


    try {
      dispatch(turnOnLoader());
      if (checkAccessToken() === true) {
        await authServices.logout()
        await authServices.deleteRefreshToken()
        localStorage.clear()
        dispatch(logoutSuccess())
        navigate('/login')
        dispatch(turnOffLoader());
      } else {
        await authServices.deleteRefreshToken()
        localStorage.clear()
        dispatch(logoutSuccess())
        navigate('/login')
        dispatch(turnOffLoader());
      }
    } catch (e) {
      dispatch(turnOffLoader());
    }
  }
};
export const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};



