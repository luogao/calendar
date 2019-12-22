import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './redux'
import _ from 'lodash'
import { setSelectedTags } from './redux/actions/tags'
import { StoreStateType } from './redux/reducers'
import { EventType, TagType } from './types'
import { getTimestampByDate } from './utils'

let currentValue: StoreStateType | null = null
function handleChange() {
  let previousValue = currentValue
  currentValue = store.getState()
  if (!_.isEqual(previousValue, currentValue) && currentValue) {
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
    const currentEventsTags = _.uniq(
      (currentViewEvents as Array<EventType>)
        .filter(event => event.tagId !== '')
        .map(event => event.tagId)
    )
    const selectedTags = (currentValue.tags.tags as Array<TagType>).filter(tag =>
      currentEventsTags.includes(tag.id)
    )
    store.dispatch(setSelectedTags(currentEventsTags))
  }
}
const unsubscribe = store.subscribe(handleChange)
// unsubscribe()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
