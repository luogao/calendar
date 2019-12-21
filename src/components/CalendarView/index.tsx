import React, { Component } from 'react'
import _ from 'lodash'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import { EventType } from '../../types'
import { View, Duration, EventApi } from '@fullcalendar/core'
import { connect, DispatchProp } from 'react-redux'
import { StoreStateType } from '../../redux/reducers'
import { getTimestampByDate } from '../../utils'
import { zhCnLocale } from '../../constants'
import { setEvents, setCurrentViewEvents } from '../../redux/actions/events'

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
  // handleEventClick: (arg: CalendarEventClickArgType) => boolean | void

  // handleDateClick: (arg: CalendarDateClickArgType) => void

  // handleSelect: (arg: CalendarEventSelectArgType) => void
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
      extendedProps: { tagId = '' }
    } = e.event
    const targetIndex = events.findIndex(e => e.id === id)
    events.splice(targetIndex, 1)

    this.props.dispatch(
      setEvents([
        ...events,
        { title, start, end, backgroundColor, borderColor, textColor, id, allDay, tagId }
      ])
    )
  }

  handleDateRender = ({ view, el }: CalendarDatesRenderArgType) => {
    const { events } = this.props
    const { activeEnd, activeStart } = view
    const currentViewEvents = events.filter(e => {
      return (
        e.start &&
        e.end &&
        getTimestampByDate(e.start) > getTimestampByDate(activeStart) &&
        getTimestampByDate(e.end) < getTimestampByDate(activeEnd)
      )
    })
    console.log({ currentViewEvents })
    this.props.dispatch(setCurrentViewEvents(currentViewEvents))
  }

  handleSelect = (e: CalendarEventSelectArgType) => {
    console.log(e)
  }

  handleDateClick = (e: CalendarDateClickArgType) => {
    console.log(e)
  }

  handleEventClick = (e: CalendarEventClickArgType) => {
    console.log(e)
  }

  render() {
    console.log('CalendarView render', this.props)
    const { events } = this.props
    return (
      <FullCalendar
        header={{
          left: 'title',
          center: '',
          right: ' prev today next'
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
}

const mapStateToProps = (state: StoreStateType) => {
  return {
    events: state.events.events
  }
}

export default connect(mapStateToProps)(CalendarView)
