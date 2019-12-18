
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

export interface EventType {
  id: string
  tagId: string
  title: string
  start: Date | MaterialUiPickersDate
  end: Date | MaterialUiPickersDate
  backgroundColor: string
  borderColor: string
  textColor: string
  allDay: boolean
}

export interface TagType {
  backgroundColor: string
  textColor: string
  title: string
  id: string
}

export type EventAction =
  | { type: 'setEvent', payload: EventType[] | [] }
  | { type: 'setCurrentViewEvents'; amount: number, payload: EventType[] | [] };



export interface StateType {
  event: EventType[] | []
  currentViewEvents: EventType[] | []
}
