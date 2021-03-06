import React, { Component } from 'react'
import isEqual from 'lodash/isEqual'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventType } from '../../types'
import { View, Duration, EventApi } from '@fullcalendar/core'
import { connect, DispatchProp } from 'react-redux'
import { StoreStateType } from '../../redux/reducers'
import { zhCnLocale } from '../../constants'
import {
  setEvents,
  setCurrentEvent,
  toggleEventModal,
  setEventsRange,
} from '../../redux/actions/events'

export interface CalendarEventSelectArgType {
  start: Date
  end: Date
  startStr: string
  endStr: string
  allDay: boolean
  resource?: any
  jsEvent: MouseEvent
  view: View
}

export interface CalendarEventClickArgType {
  el: HTMLElement
  event: EventApi
  jsEvent: MouseEvent
  view: View
}

export interface CalendarDateClickArgType {
  date: Date
  dateStr: string
  allDay: boolean
  resource?: any
  dayEl: HTMLElement
  jsEvent: MouseEvent
  view: View
}

export interface CalendarEventDropArgType {
  el: HTMLElement
  event: EventApi
  oldEvent: EventApi
  delta: Duration
  revert: () => void
  jsEvent: Event
  view: View
}

export interface CalendarDatesRenderArgType {
  view: View
  el: HTMLElement
}

interface CalendarViewProps {
  events: EventType[] | []
  currentEvent: EventType
}

class CalendarView extends Component<CalendarViewProps & DispatchProp> {
  handleEventDrop = (e: CalendarEventDropArgType) => {
    const { events } = this.props
    const {
      title,
      start,
      end,
      backgroundColor,
      borderColor,
      textColor,
      id,
      allDay,
      extendedProps: { tagId = '' },
    } = e.event
    const targetIndex = events.findIndex((e) => e.id === id)
    events.splice(targetIndex, 1)

    this.props.dispatch(
      setEvents([
        ...events,
        { title, start, end, backgroundColor, borderColor, textColor, id, allDay, tagId },
      ])
    )
  }

  handleDateRender = ({ view, el }: CalendarDatesRenderArgType) => {
    const { activeEnd, activeStart } = view
    this.props.dispatch(setEventsRange({ start: activeStart, end: activeEnd }))
  }

  handleOpenEventModal = () => {
    this.props.dispatch(toggleEventModal(true))
  }

  handleSelect = (e: CalendarEventSelectArgType) => {
    const { end, start } = e
    this.props.dispatch(setCurrentEvent({ ...this.props.currentEvent, end, start }))
    this.handleOpenEventModal()
  }

  handleDateClick = (e: CalendarDateClickArgType) => {}

  handleEventClick = (e: CalendarEventClickArgType) => {
    const {
      title,
      start,
      end,
      backgroundColor,
      borderColor,
      textColor,
      id,
      allDay,
      extendedProps: { tagId = '' },
    } = e.event
    this.props.dispatch(
      setCurrentEvent({
        title,
        start,
        end: end ? end : start,
        backgroundColor,
        borderColor,
        textColor,
        id,
        allDay,
        tagId,
      })
    )
    this.handleOpenEventModal()
  }

  render() {
    const { events } = this.props
    return (
      <FullCalendar
        header={{
          left: 'title',
          center: '',
          right: ' prev today next',
        }}
        height='parent'
        events={events}
        eventClick={this.handleEventClick}
        selectable
        eventStartEditable
        droppable
        editable
        dateClick={this.handleDateClick}
        select={this.handleSelect}
        locale={zhCnLocale}
        defaultView='dayGridMonth'
        plugins={[dayGridPlugin, interactionPlugin]}
        eventDrop={this.handleEventDrop}
        datesRender={this.handleDateRender}
      />
    )
  }

  shouldComponentUpdate(nextProps: CalendarViewProps) {
    return !isEqual(nextProps.events, this.props.events)
  }
}

const mapStateToProps = (state: StoreStateType) => {
  return {
    events: state.events.events,
    currentEvent: state.events.currentEvent,
  }
}

export default connect(mapStateToProps)(CalendarView)
