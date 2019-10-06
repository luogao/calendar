import React from 'react'
import './App.css'
import html2canvas from 'html2canvas'
import nanoid from 'nanoid'
import 'date-fns'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import './main.scss'
import { DialogContentText } from '@material-ui/core'
import { CALENDAR_STORE_TAG_KEY, CALENDAR_STORE_KEY } from './constants'
import EventEditor from './components/EventEditor'
import TagEditor from './components/Tags/components/TagEditor'
import Tags from './components/Tags'
// import LC from './AVStore'

// webpack must be configured to do this
const emptyEvent = {
  title: '无标题',
  start: new Date(),
  end: new Date(),
  backgroundColor: '#000000',
  borderColor: '#000000',
  textColor: '#ffffff',
  allDay: true,
  tagId: ''
}

const emptyTags = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  title: '',
  id: ''
}

function App() {
  const storeEvent = localStorage.getItem(CALENDAR_STORE_KEY)
    ? JSON.parse(localStorage.getItem(CALENDAR_STORE_KEY))
    : []
  const storeTags = localStorage.getItem(CALENDAR_STORE_TAG_KEY)
    ? JSON.parse(localStorage.getItem(CALENDAR_STORE_TAG_KEY))
    : []

  const [event, setEvent] = React.useState(storeEvent)
  const [tags, setTags] = React.useState(storeTags)
  const [eventModalOpen, setEventModalOpen] = React.useState(false)
  const [tagModalOpen, setTagModalOpen] = React.useState(false)
  const [isEdit, setIsEdit] = React.useState(false)
  const [tagIsEdit, setTagIsEdit] = React.useState(false)
  const [deleteConfirmDialogOpen, setDleteConfirmDialogOpen] = React.useState(false)
  const [currentEvent, setCurrentEvent] = React.useState(emptyEvent)
  const [currentTag, setCurrentTag] = React.useState(emptyTags)

  let fc = React.useRef()
  let calendarWrapper = React.useRef()

  React.useEffect(() => {
    localStorage.setItem(CALENDAR_STORE_KEY, JSON.stringify(event))
    localStorage.setItem(CALENDAR_STORE_TAG_KEY, JSON.stringify(tags))
  })

  function handleStartDateChange(date) {
    setCurrentEvent({ ...currentEvent, start: date })
  }

  function handleEndDateChange(date) {
    setCurrentEvent({ ...currentEvent, end: date })
  }

  function handleClickOpen() {
    setEventModalOpen(true)
  }

  function editEvent() {
    const targetIndex = event.findIndex(e => e.id === currentEvent.id)
    event.splice(targetIndex, 1)
    setEvent([...event, currentEvent])
  }

  function addEvent() {
    const eventId = nanoid(8)
    const tagId = nanoid(8)
    const _currentEvent = {
      ...currentEvent,
      id: eventId,
      tagId
    }
    setEvent([...event, _currentEvent])
    const newTag = {
      id: tagId,
      tag: '2222',
      color: currentEvent.textColor,
      backgroundColor: currentEvent.backgroundColor
    }
    setTags([...tags, newTag])
  }

  function handleSaveEvent() {
    isEdit ? editEvent() : addEvent()
    handleClose()
    setCurrentEvent(emptyEvent)
  }

  function handleClose() {
    setEventModalOpen(false)
  }

  function handleDeleteAll() {
    setEvent([])
    handleDeleteConfirmClose()
  }

  function handleSave() {
    html2canvas(document.querySelector('.main-content-wrapper'), {
      ignoreElements: el => el.className === 'fc-right'
    }).then(function(canvas) {
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
    const prefix = 'calendar'
    const id = nanoid(5)
    return `${prefix}-${id}`
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
    setCurrentEvent(emptyEvent)
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

  function handleDeleteConfirmClose() {
    setDleteConfirmDialogOpen(false)
  }

  function handleDeleteAllPress() {
    setDleteConfirmDialogOpen(true)
  }

  function handleEventDrop(e) {
    const { title, start, end, backgroundColor, borderColor, textColor, id, allDay } = e.event
    const targetIndex = event.findIndex(e => e.id === id)
    event.splice(targetIndex, 1)
    setEvent([...event, { title, start, end, backgroundColor, borderColor, textColor, id, allDay }])
  }

  function handleDeleteTag(tag) {
    console.log(tag)
    const newTags = tags.filter(el => el.id !== tag.id)
    setTags(newTags)
  }

  function handleEditTag(tag) {
    console.log(tag)
    setTagIsEdit(true)
  }

  function handleAddTag() {
    setTagModalOpen(true)
  }

  function closeTagModal() {
    setTagModalOpen(false)
  }

  function deleteTag() {
    closeTagModal()
  }

  function handleTagTitleChange(e) {
    setCurrentTag({ ...currentTag, title: e.target.value })
  }

  function handleTagBgChange(e) {
    setCurrentTag({ ...currentTag, backgroundColor: e.target.value })
  }

  function handleTagTextColorChange(e) {
    setCurrentTag({ ...currentTag, textColor: e.target.value })
  }

  function handleSaveTag () {
    
  }

  return (
    <div className="App">
      <main>
        <div className="main-content-wrapper">
          <div className="calendar-wrapper" ref={calendarWrapper}>
            <FullCalendar
              header={{
                left: 'title',
                center: '',
                right: ' prev today next'
              }}
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
          <div className="tags-wrapper">
            <Tags tags={tags} handleDeleteTag={handleDeleteTag} handleEditTag={handleEditTag} />
          </div>
        </div>
        <div className="side-bar">
          <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
            保存
          </Button>
          <Button onClick={handleDeleteAllPress} variant="contained" color="secondary" fullWidth>
            删除全部
          </Button>
        </div>
      </main>
      <EventEditor
        eventModalOpen={eventModalOpen}
        handleClose={handleClose}
        isEdit={isEdit}
        currentEvent={currentEvent}
        handleTitleInput={handleTitleInput}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        handleTextColorChange={handleTextColorChange}
        handleBgColorChange={handleBgColorChange}
        handleDelete={handleDelete}
        handleCancel={handleCancel}
        handleSaveEvent={handleSaveEvent}
        handleAddTag={handleAddTag}
      />
      <TagEditor
        modalOpen={tagModalOpen}
        handleClose={closeTagModal}
        isEdit={tagIsEdit}
        currentTag={currentTag}
        handleTitleInput={handleTagTitleChange}
        handleTextColorChange={handleTagTextColorChange}
        handleBgColorChange={handleTagBgChange}
        handleDelete={deleteTag}
        handleCancel={closeTagModal}
        handleSave={handleSaveTag}
      />
      <Dialog
        open={deleteConfirmDialogOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">注意</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            此举很危险, 请确认是否继续!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            取消
          </Button>
          <Button onClick={handleDeleteAll} color="default" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default App
