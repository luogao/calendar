import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './redux'
import isEqual from 'lodash/isEqual'
import uniq from 'lodash/uniq'
import { setSelectedTags } from './redux/actions/tags'
import { StoreStateType } from './redux/reducers'
import { EventType } from './types'
import { getTimestampByDate } from './utils'

let currentValue: StoreStateType | null = null
function handleChange () {
  let previousValue = currentValue
  currentValue = store.getState()
  if (!isEqual(previousValue, currentValue) && currentValue) {
    const { start, end } = currentValue.events.eventRange
    const currentViewEvents = (currentValue.events.events as Array<EventType>).filter(
      (e: EventType) => {
        return (
          e.start &&
          e.end &&
          getTimestampByDate(e.start) > getTimestampByDate(start) &&
          getTimestampByDate(e.end) < getTimestampByDate(end)
        )
      }
    )
    const currentEventsTags = uniq(
      (currentViewEvents as Array<EventType>)
        .filter(event => event.tagId !== '')
        .map(event => event.tagId)
    )
    store.dispatch(setSelectedTags(currentEventsTags))
  }
}
const unsubscribe = store.subscribe(handleChange)

ReactDOM.render(
  <Provider store={ store }>
    <App removeStoreSub={ unsubscribe } />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
