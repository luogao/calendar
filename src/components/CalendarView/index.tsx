import React, { Component } from 'react'
import _ from 'lodash'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
// import zhCnLocale from '@fullcalendar/core'
import { EventType } from '../../types'
import { View, Duration, EventApi } from '@fullcalendar/core'

const zhCnLocale = {
  code: 'zh-cn',
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1,
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  },
  buttonText: {
    prev: '上月',
    next: '下月',
    today: '今天',
    month: '月',
    week: '周',
    day: '日',
    list: '日程'
  },
  weekLabel: '周',
  allDayText: '全天',
  eventLimitText: function(n: number) {
    return '另外 ' + n + ' 个'
  },
  noEventsMessage: '没有事件显示'
}

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
  fcRef: any
  event: EventType[] | []
  handleEventClick: (arg: CalendarEventClickArgType) => boolean | void

  handleDateClick: (arg: CalendarDateClickArgType) => void

  handleSelect: (arg: CalendarEventSelectArgType) => void

  handleEventDrop: (arg: CalendarEventDropArgType) => void

  handleDateRender: (arg: CalendarDatesRenderArgType) => void
}

class CalendarView extends Component<CalendarViewProps> {
  render() {
    console.log('CalendarView render', this.props.event)
    const {
      fcRef,
      event,
      handleEventClick,
      handleDateClick,
      handleSelect,
      handleEventDrop,
      handleDateRender
    } = this.props
    return (
      <FullCalendar
        header={{
          left: 'title',
          center: '',
          right: ' prev today next'
        }}
        height='parent'
        ref={fcRef}
        events={event}
        eventClick={handleEventClick}
        selectable
        eventStartEditable
        droppable
        editable
        dateClick={handleDateClick}
        select={handleSelect}
        locale={zhCnLocale}
        defaultView='dayGridMonth'
        plugins={[dayGridPlugin, interactionPlugin]}
        eventDrop={handleEventDrop}
        datesRender={handleDateRender}
      />
    )
  }
}

export default CalendarView
