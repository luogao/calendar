import React, { Component } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  Button,
  TextField,
  IconButton
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import AddIcon from '@material-ui/icons/Add'
import zhCNLocale from 'date-fns/locale/zh-CN'
import Tags from '../Tags'

export default class EventEditor extends Component {
  render() {
    const {
      eventModalOpen,
      handleClose,
      isEdit,
      currentEvent,
      handleTitleInput,
      handleStartDateChange,
      handleEndDateChange,
      handleTextColorChange,
      handleBgColorChange,
      handleDelete,
      handleCancel,
      handleSaveEvent,
      allTags,
      handleDeleteTag,
      handleEditTag,
      handleAddTag
    } = this.props
    return (
      <Dialog
        open={eventModalOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">{isEdit ? '编辑日程' : '新建日程'}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
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
            <div className="color-picker-label"> 文字 </div>
            <input type="color" value={currentEvent.textColor} onChange={handleTextColorChange} />
          </div>
          <div className="color-picker-wrapper">
            <div className="color-picker-label"> 背景 </div>
            <input
              type="color"
              value={currentEvent.backgroundColor}
              onChange={handleBgColorChange}
            />
          </div>
          <div className="color-picker-wrapper">
            <div className="color-picker-label"> 标签 </div>
            <Tags tags={allTags} handleDeleteTag={handleDeleteTag} handleEditTag={handleEditTag} />
            <IconButton
              onClick={handleAddTag}
              aria-label="delete"
              size="small"
              style={{
                margin: '6px 0 7px'
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            取消
          </Button>
          {currentEvent.id && (
            <Button onClick={handleDelete} color="secondary">
              删除
            </Button>
          )}
          <Button onClick={handleSaveEvent} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
