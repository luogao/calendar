import React, { Component } from 'react'
import _ from 'lodash'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import PropTypes from 'prop-types'
class CalendarView extends Component {
  render() {
    console.log('CalendarView render')
    const { fcRef, event, handleEventClick, handleDateClick, handleSelect, handleEventDrop, handleDateRender } = this.props
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
        theme='cosmo'
        defaultView='dayGridMonth'
        plugins={[dayGridPlugin, interactionPlugin]}
        eventDrop={handleEventDrop}
        datesRender={handleDateRender}
      />
    )
  }

  shouldComponentUpdate(nextProps) {
    return _.isEqual(nextProps.event, this.props.event)
  }
}

CalendarView.propTypes = {
  fcRef: PropTypes.object.isRequired,
  event: PropTypes.array.isRequired,
  handleEventClick: PropTypes.func.isRequired,
  handleDateClick: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleEventDrop: PropTypes.func.isRequired,
  handleDateRender: PropTypes.func.isRequired
}

export default CalendarView
