import React, { Component } from 'react'
import _ from 'lodash'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import { EventType } from '../../types'
import { View, Duration, EventApi } from '@fullcalendar/core'

export interface CalendarEventSelectArgType {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
  resource?: any;
  jsEvent: MouseEvent;
  view: View;
}

export interface CalendarEventClickArgType {
  el: HTMLElement;
  event: EventApi;
  jsEvent: MouseEvent;
  view: View;
}

export interface CalendarDateClickArgType {
  date: Date;
  dateStr: string;
  allDay: boolean;
  resource?: any;
  dayEl: HTMLElement;
  jsEvent: MouseEvent;
  view: View;
}


export interface CalendarEventDropArgType {
  el: HTMLElement;
  event: EventApi;
  oldEvent: EventApi;
  delta: Duration;
  revert: () => void;
  jsEvent: Event;
  view: View;
}



export interface CalendarDatesRenderArgType {
  view: View;
  el: HTMLElement;
}
interface CalendarViewProps {
  fcRef: any;
  event: EventType[] | [];
  handleEventClick: (arg: CalendarEventClickArgType) => boolean | void;

  handleDateClick: (arg: CalendarDateClickArgType) => void;

  handleSelect: (arg: CalendarEventSelectArgType) => void;

  handleEventDrop: (arg: CalendarEventDropArgType) => void;

  handleDateRender: (arg: CalendarDatesRenderArgType) => void;

}

class CalendarView extends Component<CalendarViewProps> {
  render () {
    console.log('CalendarView render')
    const { fcRef, event, handleEventClick, handleDateClick, handleSelect, handleEventDrop, handleDateRender } = this.props
    return (
      <FullCalendar
        header={ {
          left: 'title',
          center: '',
          right: ' prev today next'
        } }
        height='parent'
        ref={ fcRef }
        events={ event }
        eventClick={ handleEventClick }
        selectable
        eventStartEditable
        droppable
        editable
        // themeSystem="cosmo"
        theme="cosmo"
        dateClick={ handleDateClick }
        select={ handleSelect }
        locale={ zhCnLocale }
        defaultView='dayGridMonth'
        plugins={ [ dayGridPlugin, interactionPlugin ] }
        eventDrop={ handleEventDrop }
        datesRender={ handleDateRender }
      />
    )
  }

  shouldComponentUpdate (nextProps: CalendarViewProps) {
    return _.isEqual(nextProps.event, this.props.event)
  }
}


export default CalendarView
