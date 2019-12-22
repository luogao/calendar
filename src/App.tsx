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
import { EventType, StateType, TagType } from './types'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { CalendarDatesRenderArgType, CalendarEventDropArgType } from './components/CalendarView'
import { getImgSrc, generate, downloadFile } from './utils'
import { connect, DispatchProp } from 'react-redux'
import { addEvent, setEvents } from './redux/actions/events'
import { StoreStateType } from './redux/reducers'
import { setTags } from './redux/actions/tags'

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

interface AppState {
  deleteConfirmDialogOpen: boolean
  currentTag: TagType
}
interface AppProps {}

class App extends React.Component<AppProps & DispatchProp, AppState> {
  state = {
    deleteConfirmDialogOpen: false,
    currentTag: emptyTag
  }
  // const [event, setEvent] = React.useState<EventType[] | []>(
  //   storeEvent ? JSON.parse(storeEvent) : []
  // )
  // const [currentViewEvents, setCurrentViewEvents] = React.useState<EventType[] | []>([])
  // const [tags, setTags] = React.useState<TagType[] | []>(storeTags ? JSON.parse(storeTags) : [])
  // const [eventModalOpen, setEventModalOpen] = React.useState<boolean>(false)
  // const [tagModalOpen, setTagModalOpen] = React.useState<boolean>(false)
  // const [isEdit, setIsEdit] = React.useState<boolean>(false)
  // const [tagIsEdit, setTagIsEdit] = React.useState<boolean>(false)
  // const [deleteConfirmDialogOpen, setDleteConfirmDialogOpen] = React.useState<boolean>(false)
  // const [currentEvent, setCurrentEvent] = React.useState<EventType>(emptyEvent)
  // const [currentTag, setCurrentTag] = React.useState<TagType>(emptyTag)
  // const [selectedTags, setSelectedTags] = React.useState<TagType[] | []>(getSelectedTags())
  // const [selectedTag, setSelectTag] = React.useState('')

  // let fc = React.useRef<FullCalendar>(null)
  // let calendarWrapper = React.useRef<HTMLDivElement>(null)

  // function getSelectedTags() {
  //   const eventTags = currentViewEvents.filter(el => el.tagId).map(el => el.tagId)
  //   const selectedTags = tags.filter(tag => eventTags.includes(tag.id))
  //   return selectedTags
  // }

  // React.useEffect(() => {
  //   setSelectedTags(getSelectedTags())
  // }, [event, tags])

  // React.useEffect(() => {
  //   localStorage.setItem(CALENDAR_STORE_TAG_KEY, JSON.stringify(tags))
  // }, [tags])

  // React.useEffect(() => {
  //   localStorage.setItem(CALENDAR_STORE_KEY, JSON.stringify(event))
  // }, [event])

  // function handleStartDateChange(date: MaterialUiPickersDate) {
  //   setCurrentEvent({ ...currentEvent, start: date })
  // }

  // function handleEndDateChange(date: MaterialUiPickersDate) {
  //   setCurrentEvent({ ...currentEvent, end: date })
  // }

  // function handleClickOpen() {
  //   setEventModalOpen(true)
  // }

  // function editEvent() {
  //   const targetIndex = event.findIndex(e => e.id === currentEvent.id)
  //   event.splice(targetIndex, 1)
  //   const _event = [...event, currentEvent]
  //   setEvent(_event)
  // }

  // function addEvent() {
  //   const eventId = nanoid(8)
  //   const _currentEvent = {
  //     ...currentEvent,
  //     id: eventId
  //   }
  //   setEvent([...event, _currentEvent])
  // }

  // function handleSaveEvent() {
  //   isEdit ? editEvent() : addEvent()
  //   handleClose()
  //   setCurrentEvent(emptyEvent)
  // }

  // function handleClose() {
  //   setEventModalOpen(false)
  // }

  handleDeleteAll = () => {
    this.props.dispatch(setEvents([]))
    this.handleDeleteConfirmClose()
  }

  handleSave = () => {
    const mainTarget = document.querySelector('main')
    if (mainTarget) {
      html2canvas(mainTarget, {
        ignoreElements: el => el.className === 'fc-right' || el.className === 'action-btns'
      }).then(function(canvas: HTMLCanvasElement) {
        downloadFile(generate(), getImgSrc(canvas))
      })
    }
  }
  setCurrentTag = (tag: TagType) => {
    this.setState({
      currentTag: tag
    })
  }

  // function handleCancel() {
  //   setCurrentEvent(emptyEvent)
  //   handleClose()
  // }

  // handleSelect = (e: CalendarEventSelectArgType) => {
  //   const { end, start } = e
  //   setIsEdit(false)
  //   setCurrentEvent({ ...currentEvent, end, start })
  //   handleClickOpen()
  // }

  // handleDateClick = (e: CalendarDateClickArgType) => {
  //   console.log('handleDateClick', e)
  // }

  // handleEventClick = (e: CalendarEventClickArgType) => {
  //   const {
  //     title,
  //     start,
  //     end,
  //     backgroundColor,
  //     borderColor,
  //     textColor,
  //     id,
  //     allDay,
  //     extendedProps: { tagId = '' }
  //   } = e.event as any
  //   setCurrentEvent({
  //     title,
  //     start,
  //     end,
  //     backgroundColor,
  //     borderColor,
  //     textColor,
  //     id,
  //     allDay,
  //     tagId
  //   })
  //   setIsEdit(true)
  //   handleClickOpen()
  // }

  // function handleDelete() {
  //   const newEvent = event.filter(e => e.id !== currentEvent.id)
  //   setEvent([...newEvent])
  //   setCurrentEvent(emptyEvent)
  //   handleClose()
  // }

  // function handleTitleInput(
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) {
  //   setCurrentEvent({
  //     ...currentEvent,
  //     title: e.target.value
  //   })
  // }

  //  handleTextColorChange=(e: { hex: string }) => {
  //   setCurrentEvent({
  //     ...currentEvent,
  //     textColor: e.hex
  //   })
  // }

  //  handleBgColorChange=(e: { hex: string }) =>{
  //   setCurrentEvent({
  //     ...currentEvent,
  //     backgroundColor: e.hex,
  //     borderColor: e.hex
  //   })
  // }

  setDleteConfirmDialogOpen = (open: boolean) => {
    this.setState({
      deleteConfirmDialogOpen: open
    })
  }

  handleDeleteConfirmClose = () => {
    this.setDleteConfirmDialogOpen(false)
  }

  handleDeleteAllPress = () => {
    this.setDleteConfirmDialogOpen(true)
  }

  handleEditTag = (tag: TagType) => {
    this.setCurrentTag(tag)
  }

  // function handleAddTag() {
  //   openTagModal()
  // }

  // function openTagModal() {
  //   setTagModalOpen(true)
  // }

  // createTag() {
  //   setTags([...tags, { ...currentTag, id: nanoid(8) }])
  // }

  // updateTag() {
  //   const targetIndex = tags.findIndex(el => el.id === currentTag.id)
  //   tags[targetIndex] = currentTag
  //   setTags([...tags])
  // }

  // handleSaveTag() {
  //   if (currentTag.id) {
  //     updateTag()
  //   } else {
  //     createTag()
  //   }
  //   closeTagModal()
  // }

  // function handleTagChange(
  //   e: React.ChangeEvent<{
  //     name?: string | undefined
  //     value: unknown
  //   }>,
  //   child: React.ReactNode
  // ) {
  //   if (e.target.value) {
  //     const tag = tags.find(t => t.id === e.target.value)
  //     if (tag) {
  //       setCurrentEvent({
  //         ...currentEvent,
  //         borderColor: tag.backgroundColor,
  //         backgroundColor: tag.backgroundColor,
  //         textColor: tag.textColor,
  //         tagId: tag.id
  //       })
  //     }
  //   }
  // }

  render() {
    return (
      <div className='App'>
        <main>
          <div className='main-content-wrapper'>
            <div className='calendar-wrapper'>
              <CalendarView />
            </div>
          </div>
          <div className='side-bar'>
            <div className='tags-wrapper'>
              <Tags isDisplay />
            </div>
            <div className='action-btns'>
              <Button onClick={this.handleSave} variant='contained' color='primary' fullWidth>
                保存
              </Button>
              <Button
                onClick={this.handleDeleteAllPress}
                variant='contained'
                color='secondary'
                fullWidth
              >
                删除全部
              </Button>
            </div>
          </div>
        </main>
        {/* <EventEditor
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
        />  */}
        <TagEditor />
        <Dialog
          open={this.state.deleteConfirmDialogOpen}
          onClose={this.handleDeleteConfirmClose}
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
            <Button onClick={this.handleDeleteConfirmClose} color='primary'>
              取消
            </Button>
            <Button onClick={this.handleDeleteAll} color='default' autoFocus>
              确认
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default connect()(App)
