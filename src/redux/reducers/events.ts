import { EVENT_ACITON_TYPE } from "../actionTypes";
import { EventType } from "../../types";
import { CALENDAR_STORE_KEY } from "../../constants";


const storeEvent = localStorage.getItem(CALENDAR_STORE_KEY)

export interface EventStateType {
  events: EventType[] | []
  selectedEvent: EventType | null
  currentViewEvents: EventType[] | []
}

const initialState: EventStateType = {
  events: storeEvent ? JSON.parse(storeEvent) : [],
  currentViewEvents: [],
  selectedEvent: null
};

type EventAction =
  | { type: EVENT_ACITON_TYPE.ADD, payload: { event: EventType } }
  | { type: EVENT_ACITON_TYPE.SET, payload: { events: EventType[] | [] } }
  | { type: EVENT_ACITON_TYPE.SET_CURRENT_EVENTS, payload: { currentViewEvents: EventType[] | [] } }
  | { type: EVENT_ACITON_TYPE.SET_SELECTED_EVENT, payload: { selectedEvent: EventType | null } }


export default function (state = initialState, action: EventAction) {
  switch (action.type) {
    case EVENT_ACITON_TYPE.ADD: {
      const { event } = action.payload;
      return {
        ...state,
        events: [
          ...state.events,
          event
        ]
      };
    }
    case EVENT_ACITON_TYPE.SET: {
      const { events } = action.payload;
      localStorage.setItem(CALENDAR_STORE_KEY, JSON.stringify(events))
      return {
        ...state,
        events
      };
    }
    case EVENT_ACITON_TYPE.SET_CURRENT_EVENTS: {
      const { currentViewEvents } = action.payload;
      return {
        ...state,
        currentViewEvents
      };
    }
    case EVENT_ACITON_TYPE.SET_SELECTED_EVENT: {
      const { selectedEvent } = action.payload;
      return {
        ...state,
        selectedEvent
      };
    }
    default:
      return state;
  }
}
