import React, { Component } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Button
} from '@material-ui/core'
import GColorPicker from '../../GColorPicker'
import { TagType, EventType } from '../../../types/index'
import { connect, DispatchProp } from 'react-redux'
import {
  setCurrentTag,
  toggleTagEditModal,
  setDefaultCurrentTag,
  setTags
} from '../../../redux/actions/tags'
import { StoreStateType } from '../../../redux/reducers'
import nanoid from 'nanoid'
import { setEvents } from '../../../redux/actions/events'
import _ from 'lodash'
import { updateArrayItem } from '../../../utils'
interface TagEditorProps {
  tags: TagType[] | []
  events: EventType[] | []
  modalOpen: boolean
  isEdit: boolean
  currentTag: TagType
}

class TagEditor extends Component<TagEditorProps & DispatchProp> {
  handleDelete = () => {
    this.props.dispatch(setTags(this.props.tags.filter(tag => tag.id !== this.props.currentTag.id)))
    this.handleCloseModal()
  }

  handleCancel = () => {
    this.handleCloseModal()
  }

  handleCloseModal = () => {
    this.props.dispatch(toggleTagEditModal(false))
    this.props.dispatch(setDefaultCurrentTag())
  }

  setCurrentTag = (tag: TagType) => {
    this.props.dispatch(setCurrentTag(tag))
  }

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setCurrentTag({ ...this.props.currentTag, title: e.target.value })
  }

  handleBgChange = (e: { hex: string }) => {
    this.setCurrentTag({ ...this.props.currentTag, backgroundColor: e.hex })
  }

  handleTextColorChange = (e: { hex: string }) => {
    this.setCurrentTag({ ...this.props.currentTag, textColor: e.hex })
  }

  syncRelatedEvent = () => {
    const events = (this.props.events as Array<EventType>).map((event: EventType) => {
      if (event.tagId !== this.props.currentTag.id) {
        return event
      } else {
        return {
          ...event,
          borderColor: this.props.currentTag.backgroundColor,
          backgroundColor: this.props.currentTag.backgroundColor,
          textColor: this.props.currentTag.textColor
        }
      }
    })
    this.props.dispatch(setEvents(events))
  }

  updateTag = () => {
    const tags = updateArrayItem<TagType, 'id'>(this.props.tags, this.props.currentTag, 'id')
    this.props.dispatch(setTags(tags))
    this.syncRelatedEvent()
  }

  createTag = () => {
    this.props.dispatch(setTags([ ...this.props.tags, { ...this.props.currentTag, id: nanoid(8) } ]))
  }

  handleSave = () => {
    if (this.props.currentTag.id) {
      this.updateTag()
    } else {
      this.createTag()
    }
    this.handleCloseModal()
  }

  render () {
    const { modalOpen, isEdit, currentTag } = this.props
    return (
      <Dialog
        open={ modalOpen }
        onClose={ this.handleCloseModal }
        aria-labelledby='form-dialog-title'
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle id='form-dialog-title'>{ isEdit ? '编辑标签' : '新建标签' }</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            autoFocus
            margin='dense'
            label='标签内容'
            fullWidth
            placeholder='请输入标签内容'
            value={ currentTag.title }
            onInput={ this.handleTitleChange }
          />
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 文字 </div>
            <GColorPicker
              onChange={ this.handleTextColorChange }
              color={ currentTag.textColor }
              containerStyle={ { padding: '8px 0' } }
            />
          </div>
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 背景 </div>
            <GColorPicker
              onChange={ this.handleBgChange }
              color={ currentTag.backgroundColor }
              containerStyle={ { padding: '8px 0' } }
            />
          </div>
        </DialogContent>
        <DialogActions>
          { currentTag.id && (
            <Button onClick={ this.handleDelete } color='secondary'>
              删除
            </Button>
          ) }
          <Button onClick={ this.handleCancel } color='primary'>
            取消
          </Button>
          <Button onClick={ this.handleSave } color='primary'>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  shouldComponentUpdate (nextProps: TagEditorProps) {
    return (
      !_.isEqual(nextProps.currentTag, this.props.currentTag) ||
      nextProps.isEdit !== this.props.isEdit ||
      nextProps.modalOpen !== this.props.modalOpen
    )
  }
}

const mapStateToProps = (state: StoreStateType) => {
  return {
    tags: state.tags.tags,
    currentTag: state.tags.currentTag,
    isEdit: !!state.tags.currentTag.id,
    modalOpen: state.tags.tagEditModalOpen,
    events: state.events.events
  }
}

export default connect(mapStateToProps)(TagEditor)
