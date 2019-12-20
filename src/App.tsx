import React, { useReducer } from 'react'
import './App.css'
import './main.scss'
import html2canvas from 'html2canvas'
import nanoid from 'nanoid'
import 'date-fns'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { DialogContentText } from '@material-ui/core'
import { CALENDAR_STORE_TAG_KEY, CALENDAR_STORE_KEY } from './constants'
import EventEditor from './components/EventEditor'
import TagEditor from './components/Tags/components/TagEditor'
import Tags from './components/Tags'
import CalendarView, {
  CalendarEventSelectArgType,
  CalendarDateClickArgType,
  CalendarEventClickArgType
} from './components/CalendarView'
import FullCalendar from '@fullcalendar/react'
import { EventType, EventAction, StateType, TagType } from './types'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { CalendarDatesRenderArgType, CalendarEventDropArgType } from './components/CalendarView'

// import LC from './AVStore'
const storeEvent = localStorage.getItem(CALENDAR_STORE_KEY)
const storeTags = localStorage.getItem(CALENDAR_STORE_TAG_KEY)
// webpack must be configured to do this
const emptyEvent = {
  id: '',
  title: '无标题',
  start: new Date(),
  end: new Date(),
  backgroundColor: '#000000',
  borderColor: '#000000',
  textColor: '#ffffff',
  allDay: true,
  tagId: ''
}

const emptyTag = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  title: '',
  id: ''
}

const eventReducer = (state: StateType, action: EventAction) => {
  switch (action.type) {
    case 'setEvent':
      return {
        ...state,
        event: action.payload
      }
    case 'setCurrentViewEvents':
      return {
        ...state,
        currentViewEvents: action.payload
      }
    default:
      return state
  }
}

const initialState: StateType = {
  event: storeEvent ? JSON.parse(storeEvent) : [],
  currentViewEvents: []
}

function App() {
  const [state, dispatch] = useReducer(eventReducer, initialState)
  const [event, setEvent] = React.useState<EventType[] | []>(
    storeEvent ? JSON.parse(storeEvent) : []
  )
  const [currentViewEvents, setCurrentViewEvents] = React.useState<EventType[] | []>([])
  const [tags, setTags] = React.useState<TagType[] | []>(storeTags ? JSON.parse(storeTags) : [])
  const [eventModalOpen, setEventModalOpen] = React.useState<boolean>(false)
  const [tagModalOpen, setTagModalOpen] = React.useState<boolean>(false)
  const [isEdit, setIsEdit] = React.useState<boolean>(false)
  const [tagIsEdit, setTagIsEdit] = React.useState<boolean>(false)
  const [deleteConfirmDialogOpen, setDleteConfirmDialogOpen] = React.useState<boolean>(false)
  const [currentEvent, setCurrentEvent] = React.useState<EventType>(emptyEvent)
  const [currentTag, setCurrentTag] = React.useState<TagType>(emptyTag)
  const [selectedTags, setSelectedTags] = React.useState<TagType[] | []>(getSelectedTags())
  const [selectedTag, setSelectTag] = React.useState('')

  let fc = React.useRef<FullCalendar>(null)
  let calendarWrapper = React.useRef<HTMLDivElement>(null)
  function getTimestampByDate(date: Date) {
    return new Date(date).getTime()
  }

  function getSelectedTags() {
    const eventTags = currentViewEvents.filter(el => el.tagId).map(el => el.tagId)
    const selectedTags = tags.filter(tag => eventTags.includes(tag.id))
    return selectedTags
  }

  React.useEffect(() => {
    // fc && console.log(fc.current.calendar.view)
    console.log('empty depen')
  }, [])

  React.useEffect(() => {
    setSelectedTags(getSelectedTags())
  }, [event, tags])

  React.useEffect(() => {
    localStorage.setItem(CALENDAR_STORE_TAG_KEY, JSON.stringify(tags))
  }, [tags])

  React.useEffect(() => {
    localStorage.setItem(CALENDAR_STORE_KEY, JSON.stringify(event))
  }, [event])

  function handleStartDateChange(date: MaterialUiPickersDate) {
    setCurrentEvent({ ...currentEvent, start: date })
  }

  function handleEndDateChange(date: MaterialUiPickersDate) {
    setCurrentEvent({ ...currentEvent, end: date })
  }

  function handleClickOpen() {
    setEventModalOpen(true)
  }

  function editEvent() {
    const targetIndex = event.findIndex(e => e.id === currentEvent.id)
    event.splice(targetIndex, 1)
    const _event = [...event, currentEvent]
    setEvent(_event)
  }

  function addEvent() {
    const eventId = nanoid(8)
    const _currentEvent = {
      ...currentEvent,
      id: eventId
    }
    setEvent([...event, _currentEvent])
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
    const mainTarget = document.querySelector('main')
    if (mainTarget) {
      html2canvas(mainTarget, {
        ignoreElements: el => el.className === 'fc-right' || el.className === 'action-btns'
      }).then(function(canvas: HTMLCanvasElement) {
        downloadFile(generate(), getImgSrc(canvas))
      })
    }
  }

  function getImgSrc(canvas: HTMLCanvasElement) {
    const dataUrl = canvas.toDataURL('image/png')
    return dataUrl
  }

  function base64Img2Blob(code: string) {
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

  function downloadFile(fileName: string, content: string) {
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

  function handleSelect(e: CalendarEventSelectArgType) {
    const { end, start } = e
    setIsEdit(false)
    setCurrentEvent({ ...currentEvent, end, start })
    handleClickOpen()
  }

  function handleDateClick(e: CalendarDateClickArgType) {
    // console.log('handleDateClick', e)
  }

  function handleEventClick(e: CalendarEventClickArgType) {
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
    } = e.event as any
    setCurrentEvent({
      title,
      start,
      end,
      backgroundColor,
      borderColor,
      textColor,
      id,
      allDay,
      tagId
    })
    setIsEdit(true)
    handleClickOpen()
  }

  function handleDelete() {
    const newEvent = event.filter(e => e.id !== currentEvent.id)
    setEvent([...newEvent])
    setCurrentEvent(emptyEvent)
    handleClose()
  }

  function handleTitleInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setCurrentEvent({
      ...currentEvent,
      title: e.target.value
    })
  }

  function handleTextColorChange(e: { hex: string }) {
    setCurrentEvent({
      ...currentEvent,
      textColor: e.hex
    })
  }

  function handleBgColorChange(e: { hex: string }) {
    setCurrentEvent({
      ...currentEvent,
      backgroundColor: e.hex,
      borderColor: e.hex
    })
  }

  function handleDeleteConfirmClose() {
    setDleteConfirmDialogOpen(false)
  }

  function handleDeleteAllPress() {
    setDleteConfirmDialogOpen(true)
  }

  function handleEventDrop(e: CalendarEventDropArgType) {
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
    const targetIndex = event.findIndex(e => e.id === id)
    event.splice(targetIndex, 1)
    setEvent([
      ...event,
      { title, start, end, backgroundColor, borderColor, textColor, id, allDay, tagId }
    ])
  }

  function handleDeleteTag(tag: TagType) {
    const newTags = tags.filter(el => el.id !== tag.id)
    setTags(newTags)
  }

  function handleEditTag(tag: TagType) {
    setCurrentTag(tag)
    setTagIsEdit(true)
    openTagModal()
  }

  function handleAddTag() {
    openTagModal()
  }

  function openTagModal() {
    setTagModalOpen(true)
  }

  function closeTagModal() {
    setCurrentTag(emptyTag)
    setTagModalOpen(false)
  }

  function deleteTag() {
    closeTagModal()
  }

  function handleTagTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentTag({ ...currentTag, title: e.target.value })
  }

  function handleTagBgChange(e: { hex: string }) {
    setCurrentTag({ ...currentTag, backgroundColor: e.hex })
  }

  function handleTagTextColorChange(e: { hex: string }) {
    setCurrentTag({ ...currentTag, textColor: e.hex })
  }

  function createTag() {
    setTags([...tags, { ...currentTag, id: nanoid(8) }])
  }

  function updateTag() {
    const targetIndex = tags.findIndex(el => el.id === currentTag.id)
    tags[targetIndex] = currentTag
    setTags([...tags])
  }

  function handleSaveTag() {
    if (currentTag.id) {
      updateTag()
    } else {
      createTag()
    }
    closeTagModal()
  }

  function handleTagChange(
    e: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>,
    child: React.ReactNode
  ) {
    if (e.target.value) {
      const tag = tags.find(t => t.id === e.target.value)
      if (tag) {
        setCurrentEvent({
          ...currentEvent,
          borderColor: tag.backgroundColor,
          backgroundColor: tag.backgroundColor,
          textColor: tag.textColor,
          tagId: tag.id
        })
      }
    }
  }

  function handleDateRender({ view, el }: CalendarDatesRenderArgType) {
    const { activeEnd, activeStart } = view
    const currentViewEvents = event.filter(e => {
      return (
        e.start &&
        e.end &&
        getTimestampByDate(e.start) > getTimestampByDate(activeStart) &&
        getTimestampByDate(e.end) < getTimestampByDate(activeEnd)
      )
    })
    // setCurrentViewEvents(currentViewEvents)
    // dispatch({ type: 'setCurrentViewEvents', payload: currentViewEvents })
  }

  return (
    <div className='App'>
      <main>
        <div className='main-content-wrapper'>
          <div className='calendar-wrapper' ref={calendarWrapper}>
            <CalendarView
              event={event}
              fcRef={fc}
              handleEventClick={handleEventClick}
              handleDateClick={handleDateClick}
              handleSelect={handleSelect}
              handleEventDrop={handleEventDrop}
              handleDateRender={handleDateRender}
            />
          </div>
        </div>
        <div className='side-bar'>
          <div className='tags-wrapper'>
            <Tags
              tags={selectedTags}
              isDisplay
              handleDeleteTag={handleDeleteTag}
              handleEditTag={handleEditTag}
              canDelete={false}
            />
          </div>
          <div className='action-btns'>
            <Button onClick={handleSave} variant='contained' color='primary' fullWidth>
              保存
            </Button>
            <Button onClick={handleDeleteAllPress} variant='contained' color='secondary' fullWidth>
              删除全部
            </Button>
          </div>
        </div>
      </main>
      <EventEditor
        eventModalOpen={eventModalOpen}
        handleClose={handleClose}
        isEdit={isEdit}
        allTags={tags}
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
        handleEditTag={handleEditTag}
        handleDeleteTag={handleDeleteTag}
        handleTagChange={handleTagChange}
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
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>注意</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            此举很危险, 请确认是否继续!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color='primary'>
            取消
          </Button>
          <Button onClick={handleDeleteAll} color='default' autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default App
