import { TagType } from "../../types";
import { TAG_ACTION_TYPE } from "../actionTypes";

export const setTags = (tags: TagType[] | []) => ({
  type: TAG_ACTION_TYPE.SET,
  payload: {
    tags
  }
})

export const setSelectedTags = (selectedTagsId: string[] | []) => ({
  type: TAG_ACTION_TYPE.SET_SELECTED_TAGS,
  payload: {
    selectedTagsId
  }
})

export const setCurrentTag = (currentTag: TagType) => ({
  type: TAG_ACTION_TYPE.SET_CURRENT_TAG,
  payload: {
    currentTag
  }
})

export const setDefaultCurrentTag = () => ({
  type: TAG_ACTION_TYPE.SET_DEFAULT_CURRENT_TAG
})

export const toggleTagEditModal = (toggle: boolean) => ({
  type: TAG_ACTION_TYPE.TOGGLE_MODAL,
  payload: {
    toggle
  }
})