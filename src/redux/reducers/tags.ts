import { TagType } from "../../types";
import { TAG_ACTION_TYPE } from "../actionTypes";
import { CALENDAR_STORE_TAG_KEY } from "../../constants";


const emptyTag = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  title: '',
  id: ''
}

export interface TagStateType {
  tags: TagType[] | []
  selectedTags: TagType[] | []
  currentTag: TagType
  tagEditModalOpen: boolean
}

type TagActionsType =
  | { type: TAG_ACTION_TYPE.SET, payload: { tags: TagType[] | [] } }
  | { type: TAG_ACTION_TYPE.SET_SELECTED_TAGS, payload: { selectedTagsId: string[] | [] } }
  | { type: TAG_ACTION_TYPE.SET_CURRENT_TAG, payload: { currentTag: TagType } }
  | { type: TAG_ACTION_TYPE.SET_DEFAULT_CURRENT_TAG }
  | { type: TAG_ACTION_TYPE.TOGGLE_MODAL, payload: { toggle: boolean } }

const storeTags = localStorage.getItem(CALENDAR_STORE_TAG_KEY)

const initialState: TagStateType = {
  tags: storeTags ? JSON.parse(storeTags) : [],
  selectedTags: [],
  currentTag: emptyTag,
  tagEditModalOpen: false
}

export default function (state = initialState, actions: TagActionsType) {
  switch (actions.type) {
    case TAG_ACTION_TYPE.SET: {
      const { tags } = actions.payload
      localStorage.setItem(CALENDAR_STORE_TAG_KEY, JSON.stringify(tags))
      return {
        ...state,
        tags
      }
    }
    case TAG_ACTION_TYPE.SET_SELECTED_TAGS: {
      const { selectedTagsId } = actions.payload
      return {
        ...state,
        selectedTags: selectedTagsId.length === 0 ? [] : state.tags.filter((tag: TagType) => (selectedTagsId as Array<string>).includes(tag.id))
      }
    }
    case TAG_ACTION_TYPE.SET_CURRENT_TAG: {
      const { currentTag } = actions.payload
      return {
        ...state,
        currentTag
      }
    }
    case TAG_ACTION_TYPE.SET_DEFAULT_CURRENT_TAG: {
      return {
        ...state,
        currentTag: emptyTag
      }
    }
    case TAG_ACTION_TYPE.TOGGLE_MODAL: {
      return {
        ...state,
        tagEditModalOpen: actions.payload.toggle
      }
    }
    default:
      return state;
  }
}