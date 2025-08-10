import {
  GAME_FILTERS,
  RELOAD_PROFILE_DATA,
  REMOVE_LOGGED_USER,
  SET_LOGGED_USER,
  SET_LOGGED_USER_DATA,
} from "../constant";

export const loginAction = (payload) => {
  return {
    type: SET_LOGGED_USER,
    payload,
  };
};

export const logoutAction = () => {
  return {
    type: REMOVE_LOGGED_USER,
    payload: {
      isLoggedIn: false,
      token: "",
      authUser: "",
    },
  };
};

export const loggedProfileDataAction = (payload) => {
  return {
    type: SET_LOGGED_USER_DATA,
    payload,
  };
};

export const reloadProfileDataAction = (payload) => {
  return {
    type: RELOAD_PROFILE_DATA,
    payload,
  };
};

export const loadCommondataAction = (payload) => {
  return {
    type: GAME_FILTERS,
    payload,
  };
};

