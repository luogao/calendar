import { combineReducers } from "redux";
import events, { EventStateType } from "./events";

export interface StoreStateType { 
  events: EventStateType
}

export default combineReducers({ events });
