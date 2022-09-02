import { combineReducers } from "redux";

import authReducer from "./AuthReducer";
import postReducer from "./PostReducer";
import chatReducer from "./ChatUserReducer";
import allPostReducer from './allPostReducer';

export const reducers = combineReducers({ authReducer, postReducer, chatReducer, allPostReducer })