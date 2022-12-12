// import Axios from 'axios';
import axios from 'axios';
import { BACKEND_DOMAIN } from '../config/settingSystem';
import { logoutSuccess } from '../store/actions/authActions';
import { checkAccessToken, checkRefreshToken } from '../utils/checkEXPToken';
import { authServices } from './authService';
const checkToken = async (dispatch, navigate) => {
  if (checkAccessToken() === false) {
    if (checkRefreshToken() === false) {
      await authServices.deleteRefreshToken()
      localStorage.clear()
      await dispatch(logoutSuccess())
      navigate('/login')
    } else {
      const res = await authServices.refreshAccessToken()
      localStorage.setItem('access_token',res.data.access_token)
      localStorage.setItem('access_token_exp',res.data.access_token_exp)
    }
  } else {
    return;
  }
}
export const campaignServices = {
  createCampaign: async (formData,dispatch,navigate) => {
    await checkToken(dispatch, navigate);
    return axios({
      url: `${BACKEND_DOMAIN}/create-campaign`,
      method: 'POST',
      data: formData,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type' : 'multipart/form-data'
      }
    })
  },
  fetchCampaignPagination: async (data,dispatch,navigate) => {
    await checkToken(dispatch, navigate);
    return axios({
      url: `${BACKEND_DOMAIN}/get-campaigns-search?key_word=${data.keyWord}&page_number=${data.pageNumber}&start_time=${data.startTime}&end_time=${data.endTime}`,
      method: 'GET',
      data,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      }
    })
  },
  softDeleteCampaign: async (data,dispatch,navigate) => {
    await checkToken(dispatch, navigate);
    return axios({
      url: `${BACKEND_DOMAIN}/soft-delete-campaign`,
      method: 'POST',
      data,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type' : 'multipart/form-data'
      }
    })
  },
  updateCampaign:async (formData,dispatch,navigate) => {
    await checkToken(dispatch, navigate);
    return axios({
      url: `${BACKEND_DOMAIN}/update-campaign`,
      method: 'POST',
      data: formData,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  exportCampaignData: () => {
    return axios({
      url: `${BACKEND_DOMAIN}/campaigns/export`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
