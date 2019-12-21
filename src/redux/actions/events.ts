import { EVENT_ACITON_TYPE } from "../actionTypes";
import { EventType } from "../../types";

export const addEvent = (event: EventType) => ({
  type: EVENT_ACITON_TYPE.ADD,
  payload: {
    event
  }
});

export const setEvents = (events: EventType[] | []) => ({
  type: EVENT_ACITON_TYPE.SET,
  payload: {
    events
  }
})

export const setCurrentViewEvents = (currentViewEvents: EventType[] | []) => ({
  type: EVENT_ACITON_TYPE.SET_CURRENT_EVENTS,
  payload: {
    currentViewEvents
  }
})

export const setSelectedEvent = (event: EventType) => ({
  type: EVENT_ACITON_TYPE.SET_SELECTED_EVENT,
  payload: {
    event
  }
})