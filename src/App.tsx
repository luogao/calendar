import React from 'react'
import './App.css'
import './main.scss'
import html2canvas from 'html2canvas'
import 'date-fns'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { DialogContentText, Switch } from '@material-ui/core'
import EventEditor from './components/EventEditor'
import TagEditor from './components/Tags/components/TagEditor'
import Tags from './components/Tags'
import CalendarView from './components/CalendarView'
import { getImgSrc, generate, downloadFile } from './utils'
import { connect, DispatchProp } from 'react-redux'
import { setEvents } from './redux/actions/events'
import SnowflakeBG from './components/SnowflakeBG/SnowflakeBG'
import clickShowIconPopUp from './utils/clickShowIconPopUp'
import { ChristmasIcons } from './constants'

interface AppState {
  deleteConfirmDialogOpen: boolean
  withAnimation: boolean
}

interface AppProps {
  removeStoreSub: Function
}

class App extends React.Component<AppProps & DispatchProp, AppState> {
  componentDidMount() {
    this.isChristmas() && clickShowIconPopUp(ChristmasIcons, !this.state.withAnimation)
  }

  state = {
    deleteConfirmDialogOpen: false,
    withAnimation: true,
  }

  handleDeleteAll = () => {
    this.props.dispatch(setEvents([]))
    this.handleDeleteConfirmClose()
  }

  handleSave = () => {
    const mainTarget = document.querySelector('main')
    if (mainTarget) {
      html2canvas(mainTarget, {
        ignoreElements: (el) =>
          el.className === 'fc-right' || el.className === 'action-btns' || el.id === 'snowflake-bg' || el.className === 'snowflake-control',
      }).then(function (canvas: HTMLCanvasElement) {
        downloadFile(generate(), getImgSrc(canvas))
      })
    }
  }

  setDleteConfirmDialogOpen = (open: boolean) => {
    this.setState({
      deleteConfirmDialogOpen: open,
    })
  }

  handleDeleteConfirmClose = () => {
    this.setDleteConfirmDialogOpen(false)
  }

  handleDeleteAllPress = () => {
    this.setDleteConfirmDialogOpen(true)
  }

  componentWillUnmount() {
    this.props.removeStoreSub()
  }

  isChristmas = () => {
    const today = new Date().toLocaleDateString()
    return today.includes('/12/24') || today.includes('/12/25')
  }

  handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      withAnimation: event.target.checked,
    })
  }

  render() {
    return (
      <div className='App'>
        <main>
          <div className='main-content-wrapper'>
            <div className='calendar-wrapper'>
              <CalendarView />
            </div>
            {this.isChristmas && (
              <div className='snowflake-control'>
                <span>{this.state.withAnimation ? '隐藏雪花' : '想看下雪'}</span>
                <Switch
                  checked={this.state.withAnimation}
                  onChange={this.handleSwitch}
                  color='primary'
                  name='openAnimation'
                  size='small'
                />
              </div>
            )}
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
        <EventEditor />
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
        {this.isChristmas() && this.state.withAnimation && <SnowflakeBG />}
      </div>
    )
  }
}

export default connect()(App)
