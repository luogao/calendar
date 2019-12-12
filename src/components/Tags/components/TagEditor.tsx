import React, { Component } from 'react'
import { Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button } from '@material-ui/core'
import GColorPicker from '../../GColorPicker'

class TagEditor extends Component {
  render() {
    const { modalOpen, handleClose, isEdit, currentTag, handleTitleInput, handleTextColorChange, handleBgColorChange, handleDelete, handleCancel, handleSave } = this.props
    return (
      <Dialog open={modalOpen} onClose={handleClose} aria-labelledby='form-dialog-title' maxWidth='sm' fullWidth>
        <DialogTitle id='form-dialog-title'>{isEdit ? '编辑标签' : '新建标签'}</DialogTitle>
        <DialogContent>
          <TextField multiline autoFocus margin='dense' label='标签内容' fullWidth placeholder='请输入标签内容' value={currentTag.title} onInput={handleTitleInput} />
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 文字 </div>
            <GColorPicker onChange={handleTextColorChange} color={currentTag.textColor} containerStyle={{ padding: '8px 0' }} />
          </div>
          <div className='color-picker-wrapper'>
            <div className='color-picker-label'> 背景 </div>
            <GColorPicker onChange={handleBgColorChange} color={currentTag.backgroundColor} containerStyle={{ padding: '8px 0' }} />
          </div>
        </DialogContent>
        <DialogActions>
          {currentTag.id && (
            <Button onClick={handleDelete} color='secondary'>
              删除
            </Button>
          )}
          <Button onClick={handleCancel} color='primary'>
            取消
          </Button>
          <Button onClick={handleSave} color='primary'>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default TagEditor
