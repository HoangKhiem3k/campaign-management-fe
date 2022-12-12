// import { login } from '../../services/authService';
import { LIMIT_NUM_CAMPAIGN, STATUS_CODE } from '../../config/settingSystem';
import { campaignServices } from '../../services/campaignService';
import { toast } from 'react-toastify';
import { CREATE_CAMPAIGN_ERROR, CREATE_CAMPAIGN_START, CREATE_CAMPAIGN_SUCCESS, FETCH_CAMPAIGNS_ERROR, FETCH_CAMPAIGNS_START, FETCH_CAMPAIGNS_SUCCESS, MOVE_DATA_UPDATE_TO_STORE } from '../types/campaignType';
import { turnOffLoader, turnOnLoader } from './loaderAction';
// create action
export const createCampaignAction = (formData,  navigate) => {
  return async (dispatch) => {
    dispatch(createStart());
    try {
      dispatch(turnOnLoader());
      const res = await campaignServices.createCampaign(formData, dispatch, navigate)
      console.log("res create ", res.data)
      if (res.data.statusCode === STATUS_CODE.SUCCESS_CREATED) {
        dispatch(turnOffLoader());
        toast.success("Create a new campaign succeed!")
        dispatch(fetchAllCampaignPaginationAction('', 1, '', '', dispatch, navigate))
      } else {
        dispatch(turnOffLoader());
        toast.error(res.data.errors.banner[0])
        dispatch(createFailed())
      }
    } catch (e) {
      dispatch(turnOffLoader());
      dispatch(createFailed())
    }
  }
};
export const createStart = () => {
  return {
    type: CREATE_CAMPAIGN_START
  }
}
export const createSuccess = (payload) => {
  return {
    type: CREATE_CAMPAIGN_SUCCESS,
    payload
  }
}
export const createFailed = () => {
  return {
    type: CREATE_CAMPAIGN_ERROR,
  }
}

export const fetchAllCampaignPaginationAction = (keyWord, pageNumber, startTime, endTime, navigate) => {
  return async (dispatch) => {
    dispatch(fetchStart());
    try {
      dispatch(turnOnLoader());
      let dataFetch = {
        keyWord, pageNumber, startTime, endTime
      }
      const res = await campaignServices.fetchCampaignPagination(dataFetch, dispatch, navigate)
      console.log("res fetch" , res.data)
      if (res.data.statusCode === STATUS_CODE.SUCCESS) {
        dispatch(turnOffLoader());
        dispatch(fetchSuccess(res.data))
      } else {
        dispatch(turnOffLoader());
        dispatch(fetchFailed())
      }
    } catch (e) {
      dispatch(turnOffLoader());
      dispatch(fetchFailed())
    }
  }
};
export const fetchStart = () => {
  return {
    type: FETCH_CAMPAIGNS_START
  }
}
export const fetchSuccess = (payload) => {
  return {
    type: FETCH_CAMPAIGNS_SUCCESS,
    payload
  }
}
export const fetchFailed = () => {
  return {
    type: FETCH_CAMPAIGNS_ERROR,
  }
}
// soft delete campaign 
export const softDeleteCampaignAction = (data,  navigate) => {
  return async (dispatch) => {
    dispatch(softDeleteStart());
    try {
      dispatch(turnOnLoader());
      const res = await campaignServices.softDeleteCampaign(data, dispatch, navigate)
      console.log("res delete", res.data)

      if (res.data.statusCode === STATUS_CODE.SUCCESS) {
        dispatch(turnOffLoader());
        toast.success("Deleted campaign succeed!")
        dispatch(fetchAllCampaignPaginationAction('', 1, '', '', dispatch, navigate))
      } else {
        dispatch(turnOffLoader());
        toast.error(res.data.message)
        dispatch(softDeleteFailed())
      }
    } catch (e) {
      dispatch(turnOffLoader());
      dispatch(softDeleteFailed())
    }
  }
};
export const softDeleteStart = () => {
  return {
    type: CREATE_CAMPAIGN_START
  }
}
export const softDeleteSuccess = (payload) => {
  return {
    type: CREATE_CAMPAIGN_SUCCESS,
    payload
  }
}
export const softDeleteFailed = () => {
  return {
    type: CREATE_CAMPAIGN_START
  }
}
// moveDataUpdateToStoreAction
export const moveDataUpdateToStoreAction = (payload) => {
  return async (dispatch) => {
    dispatch(moveData(payload));
  }
}
export const moveData = (payload) => {
  return {
    type: MOVE_DATA_UPDATE_TO_STORE,
    payload
  }
}
// update campaign
export const updateCampaignAction = (data, currentPage,  navigate) => {
  return async (dispatch) => {
    dispatch(updateStart());
    try {
      dispatch(turnOnLoader());
      const res = await campaignServices.updateCampaign(data, dispatch, navigate)
      console.log("res update", res.data)
      if (res.data.statusCode === STATUS_CODE.SUCCESS) {
        dispatch(turnOffLoader());
        toast.success("Update campaign succeed!")
        dispatch(fetchAllCampaignPaginationAction('', currentPage, '', '', dispatch, navigate))
      } else {
        if (res.data.statusCode === 403) {
          dispatch(turnOffLoader());
          toast.error(res.data.message)
        }
        if (res.data.statusCode === 400) {
          dispatch(turnOffLoader());
          toast.error(res.data.errors.banner[0])
        }
      }
    } catch (e) {
      dispatch(turnOffLoader());
    }
  }
};
export const updateStart = () => {
  return {
    type: CREATE_CAMPAIGN_START
  }
}
export const updateSuccess = (payload) => {
  return {
    type: CREATE_CAMPAIGN_SUCCESS,
    payload
  }
}
export const updateFailed = () => {
  return {
    type: CREATE_CAMPAIGN_START
  }
}