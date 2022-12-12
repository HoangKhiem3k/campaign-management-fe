import { combineReducers } from 'redux';
import authReducer from './authReducer';
import campaignReducer from './campaignReducer';
import loaderReducer from './loaderReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  campaign: campaignReducer,
  loader: loaderReducer
});

export default rootReducer;


