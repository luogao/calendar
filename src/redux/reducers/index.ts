import { combineReducers } from "redux";
import events, { EventStateType } from "./events";
import tags, { TagStateType } from './tags'

export interface StoreStateType {
  events: EventStateType
  tags: TagStateType
}

export default combineReducers({ events, tags });
