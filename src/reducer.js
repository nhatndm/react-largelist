import {
  FETCH_PROPERTY_DATA,
  SAVE_CURRENT_TIMESTAMP,
  SAVE_CURRENT_UNITS
} from "./type";

export const reducer = (
  state = {
    data: [],
    timeStamp: {},
    units: []
  },
  action
) => {
  switch (action.type) {
    case FETCH_PROPERTY_DATA:
      return {
        data: action.data
      };
    case SAVE_CURRENT_TIMESTAMP:
      return {
        ...state,
        timeStamp: {
          startTime: action.timeStamp.startTime,
          endTime: action.timeStamp.endTime
        }
      };
    case SAVE_CURRENT_UNITS:
      return {
        ...state,
        units: action.units
      };
    default:
      return state;
  }
};
