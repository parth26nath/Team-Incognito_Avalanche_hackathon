import { removeAuthuser, setAuthUser } from "@/core/helper/localstorage";
import {
  REMOVE_LOGGED_USER,
  SET_LOGGED_USER,
  SET_LOGGED_USER_DATA,
  RELOAD_PROFILE_DATA,
  PROFILE_RELOAD,
} from "../constant";

const initialState = {
  isLoggedIn: false,
  authUser: null,
  reloadAuth: false,
  commonData: {},
  reloadProfile: false,
  profileReload: false,
  profile: null,
};

const account = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_LOGGED_USER:
      setAuthUser(payload);
      return {
        ...state,
        authUser: payload,
      };
    case REMOVE_LOGGED_USER:
      removeAuthuser();
      return {
        ...state,
        ...payload,
      };
    case SET_LOGGED_USER_DATA:
      return {
        ...state,
        profile: payload,
      };
    case RELOAD_PROFILE_DATA:
      return {
        ...state,
        reloadProfile: payload,
      };
    case PROFILE_RELOAD: {
      return {
        ...state,
        profileReload: payload,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default account;
