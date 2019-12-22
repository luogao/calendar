
export const CALENDAR_STORE_KEY = 'calendar_event_store'
export const CALENDAR_STORE_TAG_KEY = 'calendar_tags_store'

export const zhCnLocale = {
  code: 'zh-cn',
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1,
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  },
  buttonText: {
    prev: '上月',
    next: '下月',
    today: '今天',
    month: '月',
    week: '周',
    day: '日',
    list: '日程'
  },
  weekLabel: '周',
  allDayText: '全天',
  eventLimitText: function (n: number) {
    return '另外 ' + n + ' 个'
  },
  noEventsMessage: '没有事件显示'
}

export const emptyEvent = {
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

export const emptyTag = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  title: '',
  id: ''
}