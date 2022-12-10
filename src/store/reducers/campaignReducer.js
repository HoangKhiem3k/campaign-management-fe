import { FETCH_CAMPAIGNS_ERROR, FETCH_CAMPAIGNS_START, FETCH_CAMPAIGNS_SUCCESS, MOVE_DATA_UPDATE_TO_STORE } from '../types/campaignType';
const initialState = {
  isLoading: false,
  listCampaign: [],
  campaignUpdate: null,
  totalRecords: 0,
}
const campaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGNS_START:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_CAMPAIGNS_SUCCESS:
      state.totalRecords = action.payload.totalRecord
      state.listCampaign = action.payload.content
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_CAMPAIGNS_ERROR:
      state.listCampaign = []
      return {
        ...state,
        isLoading: false,
      };
      case MOVE_DATA_UPDATE_TO_STORE:
      state.campaignUpdate = action.payload
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default campaignReducer;