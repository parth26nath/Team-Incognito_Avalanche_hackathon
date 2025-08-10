import { createStore, applyMiddleware } from "redux";
// import { createSlice, configureStore, applyMiddleware } from '@reduxjs/toolkit'
import { composeWithDevTools } from "@redux-devtools/extension";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "@/core/redux/reducer";
import { logger } from "redux-logger";

const initialState = {};

export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(logger))
);
const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
