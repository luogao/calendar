
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

export interface StateType {
  event: EventType[] | []
  currentViewEvents: EventType[] | []
}


export type ReactClickEventHandleType = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined

export type ReactClickEventType = React.MouseEvent<HTMLButtonElement, MouseEvent>