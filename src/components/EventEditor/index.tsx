import React, { Component } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import AddIcon from '@material-ui/icons/Add'
import zhCNLocale from 'date-fns/locale/zh-CN'
import Tags from '../Tags'
import GColorPicker from '../GColorPicker'
import { EventType, TagType, ReactClickEventHandleType } from '../../types'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { connect, DispatchProp } from 'react-redux'
import { StoreStateType } from '../../redux/reducers'
import { setCurrentEvent, toggleEventModal, setEvents } from '../../redux/actions/events'
import { toggleTagEditModal } from '../../redux/actions/tags'
import { emptyEvent } from '../../constants'
import nanoid from 'nanoid'

interface EventEditorProps {
  eventModalOpen: boolean
  isEdit: boolean
  currentEvent: EventType
  allTags: TagType[] | []
  events: EventType[] | []
}

class EventEditor extends Component<EventEditorProps & DispatchProp> {
  setCurrentEvent = (event: EventType) => {
    this.props.dispatch(setCurrentEvent(event))
  }

  handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setCurrentEvent({ ...this.props.currentEvent, title: e.target.value })
  }

  handleCancel = () => {
    this.handleModalClose()
  }

  handleModalClose = () => {
    this.props.dispatch(toggleEventModal(false))
    this.setCurrentEvent(emptyEvent)
  }

  handleAddTag = () => {
    this.props.dispatch(toggleTagEditModal(true))
  }

  handleTagChange = (
    e: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>,
    child: React.ReactNode
  ) => {
    if (e.target.value) {
      const tag = this.props.allTags.find(t => t.id === e.target.value)
      if (tag) {
        this.setCurrentEvent({
          ...this.props.currentEvent,
          borderColor: tag.backgroundColor,
          backgroundColor: tag.backgroundColor,
          textColor: tag.textColor,
          tagId: tag.id
        })
      }
    }
  }

  handleStartDateChange = (date: MaterialUiPickersDate) => {
    this.setCurrentEvent({ ...this.props.currentEvent, start: date })
  }

  handleEndDateChange = (date: MaterialUiPickersDate) => {
    this.setCurrentEvent({ ...this.props.currentEvent, end: date })
  }

  handleTextColorChange = (e: { hex: string }) => {
    this.setCurrentEvent({
      ...this.props.currentEvent,
      textColor: e.hex
    })
  }

  handleBgColorChange = (e: { hex: string }) => {
    this.setCurrentEvent({
      ...this.props.currentEvent,
      backgroundColor: e.hex,
      borderColor: e.hex
    })
  }

  handleDelete = () => {
    this.props.dispatch(
      setEvents(this.props.events.filter(event => event.id !== this.props.currentEvent.id))
    )
  }

  editEvent = () => {
    const events = (this.props.events as Array<EventType>).map(event => {
      if (event.id !== this.props.currentEvent.id) {
        return event
      } else {
        return this.props.currentEvent
      }
    })
    this.props.dispatch(setEvents(events))
  }

  addEvent = () => {
    const eventId = nanoid(8)
    const _currentEvent = {
      ...this.props.currentEvent,
      id: eventId
    }
    this.props.dispatch(setEvents([...this.props.events, _currentEvent]))
  }

  handleSaveEvent = () => {
    this.props.isEdit ? this.editEvent() : this.addEvent()
    this.handleModalClose()
    setCurrentEvent(emptyEvent)
  }

  render() {
    const { eventModalOpen, isEdit, currentEvent, allTags } = this.props
    return (
      <Dialog
        open={eventModalOpen}
        onClose={this.handleModalClose}
        aria-labelledby='form-dialog-title'
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle id='form-dialog-title'>{isEdit ? '编辑日程' : '新建日程'}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            autoFocus
            margin='dense'
            label='日程内容'
            fullWidth
            placeholder='请输入日程内容'
            value={currentEvent.title}
            onChange={this.handleTitleInput}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhCNLocale}>
            <Grid container justify='space-between' spacing={3}>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  autoOk
                  fullWidth
                  format='yyyy-MM-dd'
                  margin='dense'
                  disableToolbar
                  variant='inline'
                  label='开始时间'
                  value={currentEvent.start}
                  onChange={this.handleStartDateChange}
                />
              </Grid>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  autoOk
                  fullWidth
                  format='yyyy-MM-dd'
                  margin='dense'
                  disableToolbar
                  variant='inline'
                  label='结束时间'
                  value={currentEvent.end}
                  onChange={this.handleEndDateChange}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 文字 </div>
            <GColorPicker
              onChange={this.handleTextColorChange}
              color={currentEvent.textColor}
              containerStyle={{ padding: '8px 0' }}
            />
          </div>
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 背景 </div>
            <GColorPicker
              onChange={this.handleBgColorChange}
              color={currentEvent.backgroundColor}
              containerStyle={{ padding: '8px 0' }}
            />
          </div>
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 标签 </div>
            <Select value={currentEvent.tagId} onChange={this.handleTagChange}>
              <MenuItem value=''>
                <em>无</em>
              </MenuItem>
              {allTags.length > 0 &&
                (allTags as Array<TagType>).map((el: TagType) => (
                  <MenuItem value={el.id} key={el.id}>
                    {el.title}
                  </MenuItem>
                ))}
            </Select>
            <div className='tags-wrapper'>
              <Tags />
              <IconButton
                onClick={this.handleAddTag}
                aria-label='delete'
                size='small'
                style={{
                  margin: '6px 0 7px'
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color='primary'>
            取消
          </Button>
          {currentEvent.id && (
            <Button onClick={this.handleDelete} color='secondary'>
              删除
            </Button>
          )}
          <Button onClick={this.handleSaveEvent} color='primary'>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = (state: StoreStateType) => {
  return {
    eventModalOpen: state.events.eventEditModalOpen,
    currentEvent: state.events.currentEvent,
    isEdit: !!state.events.currentEvent.id,
    allTags: state.tags.tags,
    events: state.events.events
  }
}

export default connect(mapStateToProps)(EventEditor)
