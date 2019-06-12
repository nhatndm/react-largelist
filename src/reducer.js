import { FETCH_PROPERTY_DATA } from "./type";

export const reducer = (
  state = {
    data: []
  },
  action
) => {
  switch (action.type) {
    case FETCH_PROPERTY_DATA:
      return {
        data: action.data
      };
    default:
      return state;
  }
};
