import React from 'react'
import './App.css'
import html2canvas from 'html2canvas'
import nanoid from 'nanoid'
import 'date-fns'
// import { ChromePicker } from 'react-color'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import zhCNLocale from 'date-fns/locale/zh-CN'

import './main.scss' // webpack must be configured to do this
const CALENDAR_STORE_KEY = 'calendar_event_store'
const emptyEvent = {
  title: '无标题',
  start: new Date(),
  end: new Date(),
  backgroundColor: '#000000',
  borderColor: '#000000',
  textColor: '#ffffff',
  allDay: true
}

function App() {
  const storeEvent = localStorage.getItem(CALENDAR_STORE_KEY) ? JSON.parse(localStorage.getItem(CALENDAR_STORE_KEY)) : []
  const [event, setEvent] = React.useState(storeEvent)
  const [open, setOpen] = React.useState(false)
  const [isEdit, setIsEdit] = React.useState(false)
  const [currentEvent, setCurrentEvent] = React.useState(emptyEvent)

  let fc = React.useRef()
  let calendarWrapper = React.useRef()
  // window.onresize = function() {
  //   // fc.updateSize()
  // }
  React.useEffect(() => {
    localStorage.setItem(CALENDAR_STORE_KEY, JSON.stringify(event))
  })

  function handleStartDateChange(date) {
    setCurrentEvent({ ...currentEvent, start: date })
  }

  function handleEndDateChange(date) {
    setCurrentEvent({ ...currentEvent, end: date })
  }

  function handleClickOpen() {
    setOpen(true)
  }

  function editEvent() {
    const targetIndex = event.findIndex(e => e.id === currentEvent.id)
    event.splice(targetIndex, 1)
    setEvent([...event, currentEvent])
  }

  function addEvent() {
    const _currentEvent = {
      ...currentEvent,
      id: nanoid(8)
    }
    setEvent([...event, _currentEvent])
  }

  function handleSaveEvent() {
    isEdit ? editEvent() : addEvent()
    handleClose()
    setCurrentEvent(emptyEvent)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleSave() {
    html2canvas(document.querySelector('.calendar-wrapper')).then(function(canvas) {
      downloadFile(generate(), getImgSrc(canvas))
    })
  }

  function getImgSrc(canvas) {
    const dataUrl = canvas.toDataURL('image/png')
    return dataUrl
  }

  function base64Img2Blob(code) {
    var parts = code.split(';base64,')
    var contentType = parts[0].split(':')[1]
    var raw = window.atob(parts[1])
    var rawLength = raw.length

    var uInt8Array = new Uint8Array(rawLength)

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], { type: contentType })
  }

  function generate() {
    const logoMarker = 'calendar'
    const date = new Date().toLocaleDateString()
    return `${logoMarker}-${date}`
  }

  function downloadFile(fileName, content) {
    var aLink = document.createElement('a')
    var blob = base64Img2Blob(content) //new Blob([content]);
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
  }

  function handleCancel() {
    setCurrentEvent(emptyEvent)
    handleClose()
  }

  function handleSelect(e) {
    console.log('handleSelect', e)
    const { end, start } = e
    setIsEdit(false)
    setCurrentEvent({ ...currentEvent, end, start })
    handleClickOpen()
  }

  function handleDateClick(e) {
    // console.log('handleDateClick', e)
  }

  function handleEventClick(e) {
    console.log('handleEventClick', e.event)
    const { title, start, end, backgroundColor, borderColor, textColor, id, allDay } = e.event
    setCurrentEvent({ title, start, end, backgroundColor, borderColor, textColor, id, allDay })
    setIsEdit(true)
    handleClickOpen()
  }

  function handleDelete() {
    const newEvent = event.filter(e => e.id !== currentEvent.id)
    setEvent([...newEvent])
    handleClose()
  }

  function handleTitleInput(e) {
    setCurrentEvent({
      ...currentEvent,
      title: e.target.value
    })
  }

  function handleTextColorChange(e) {
    setCurrentEvent({
      ...currentEvent,
      textColor: e.target.value
    })
  }

  function handleBgColorChange(e) {
    setCurrentEvent({
      ...currentEvent,
      backgroundColor: e.target.value,
      borderColor: e.target.value
    })
  }

  function handleEventDrop(e) {
    const { title, start, end, backgroundColor, borderColor, textColor, id, allDay } = e.event
    const targetIndex = event.findIndex(e => e.id === id)
    event.splice(targetIndex, 1)
    setEvent([...event, { title, start, end, backgroundColor, borderColor, textColor, id, allDay }])
  }

  return (
    <div className="App">
      <main>
        <div className="side-bar">
          <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
            保存
          </Button>
        </div>
        <div className="calendar-wrapper" ref={calendarWrapper}>
          <FullCalendar
            height="parent"
            ref={fc}
            events={event}
            eventClick={handleEventClick}
            selectable
            eventStartEditable
            droppable
            editable
            dateClick={handleDateClick}
            select={handleSelect}
            locale={zhCnLocale}
            theme="cosmo"
            defaultView="dayGridMonth"
            plugins={[dayGridPlugin, interactionPlugin]}
            eventDrop={handleEventDrop}
          />
        </div>
      </main>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="form-dialog-title">{isEdit ? '编辑日程' : '新建日程'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="日程内容"
            fullWidth
            placeholder="请输入日程内容"
            value={currentEvent.title}
            onInput={handleTitleInput}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhCNLocale}>
            <Grid container justify="space-between" spacing={3}>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  autoOk
                  fullWidth
                  format="yyyy-MM-dd"
                  margin="dense"
                  disableToolbar
                  variant="inline"
                  label="开始时间"
                  value={currentEvent.start}
                  onChange={handleStartDateChange}
                />
              </Grid>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  autoOk
                  fullWidth
                  format="yyyy-MM-dd"
                  margin="dense"
                  disableToolbar
                  variant="inline"
                  label="结束时间"
                  value={currentEvent.end}
                  onChange={handleEndDateChange}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
          <div className="color-picker-wrapper">
            <div className="color-picker-label">文字颜色</div>
            <input type="color" value={currentEvent.textColor} onChange={handleTextColorChange} />
          </div>
          <div className="color-picker-wrapper">
            <div className="color-picker-label">背景颜色</div>
            <input type="color" value={currentEvent.backgroundColor} onChange={handleBgColorChange} />
          </div>
        </DialogContent>
        <DialogActions>
          {currentEvent.id && (
            <Button onClick={handleDelete} color="secondary">
              删除
            </Button>
          )}
          <Button onClick={handleCancel} color="primary">
            取消
          </Button>
          <Button onClick={handleSaveEvent} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default App
