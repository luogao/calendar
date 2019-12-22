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
import { TagType } from '../../../types/index'
import { connect, DispatchProp } from 'react-redux'
import {
  setCurrentTag,
  toggleTagEditModal,
  setDefaultCurrentTag,
  setTags
} from '../../../redux/actions/tags'
import { StoreStateType } from '../../../redux/reducers'

interface TagEditorProps {
  tags: TagType[] | []
  modalOpen: boolean
  isEdit: boolean
  currentTag: TagType
}

class TagEditor extends Component<TagEditorProps & DispatchProp> {
  handleDelete = () => {
    this.props.dispatch(setTags(this.props.tags.filter(tag => tag.id !== this.props.currentTag.id)))
    this.props.dispatch(setDefaultCurrentTag())
    this.handleCloseModal()
  }

  handleCancel = () => {
    this.props.dispatch(setDefaultCurrentTag())
    this.handleCloseModal()
  }

  handleCloseModal = () => {
    this.props.dispatch(toggleTagEditModal(false))
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

  updateTag = () => {
    const tags = (this.props.tags as Array<TagType>).map(tag => {
      if (tag.id !== this.props.currentTag.id) {
        return tag
      } else {
        return this.props.currentTag
      }
    })
    console.log(this.props.currentTag)
    this.props.dispatch(setTags(tags))
  }

  createTag = () => {
    this.props.dispatch(setTags([...this.props.tags, this.props.currentTag]))
  }

  handleSave = () => {
    if (this.props.currentTag.id) {
      this.updateTag()
    } else {
      this.createTag()
    }
    this.handleCloseModal()
  }

  render() {
    const { modalOpen, isEdit, currentTag } = this.props
    return (
      <Dialog
        open={modalOpen}
        onClose={this.handleCloseModal}
        aria-labelledby='form-dialog-title'
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle id='form-dialog-title'>{isEdit ? '编辑标签' : '新建标签'}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            autoFocus
            margin='dense'
            label='标签内容'
            fullWidth
            placeholder='请输入标签内容'
            value={currentTag.title}
            onInput={this.handleTitleChange}
          />
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 文字 </div>
            <GColorPicker
              onChange={this.handleTextColorChange}
              color={currentTag.textColor}
              containerStyle={{ padding: '8px 0' }}
            />
          </div>
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 背景 </div>
            <GColorPicker
              onChange={this.handleBgChange}
              color={currentTag.backgroundColor}
              containerStyle={{ padding: '8px 0' }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          {currentTag.id && (
            <Button onClick={this.handleDelete} color='secondary'>
              删除
            </Button>
          )}
          <Button onClick={this.handleCancel} color='primary'>
            取消
          </Button>
          <Button onClick={this.handleSave} color='primary'>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = (state: StoreStateType) => {
  return {
    tags: state.tags.tags,
    currentTag: state.tags.currentTag,
    isEdit: !!state.tags.currentTag.id,
    modalOpen: state.tags.tagEditModalOpen
  }
}

export default connect(mapStateToProps)(TagEditor)
