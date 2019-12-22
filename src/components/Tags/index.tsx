import React, { PureComponent } from 'react'
import { Chip } from '@material-ui/core'
import styled from 'styled-components'
import { TagType, EventType } from '../../types'
import { DispatchProp, connect } from 'react-redux'
import { setTags, setCurrentTag, toggleTagEditModal } from '../../redux/actions/tags'
import { StoreStateType } from '../../redux/reducers'

const DisplayTagWrapper = styled('div')`
  margin: 0.5em 0 0 0;
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  cursor: pointer;
  text-align: left;
`

const DisplayTag = styled('span')`
  cursor: inherit;
  user-select: none;
  padding: 0.1em 0.5em;
  flex: 1;
  font-size: 0.8125rem;
  flex-wrap: wrap;
  word-break: break-all;
`

interface TagsProps {
  isDisplay?: boolean
  tags: TagType[] | []
  selectedTags: TagType[] | []
}
interface TagsState {
  currentTag: TagType | null
  editModalOpen: boolean
}

class index extends PureComponent<TagsProps & DispatchProp, TagsState> {
  state = {
    currentTag: null,
    editModalOpen: false
  }

  handleEditTag = (tag: TagType) => {
    this.props.dispatch(setCurrentTag(tag))
    this.setEditModalOpen(true)
  }

  setEditModalOpen = (open: boolean) => {
    this.props.dispatch(toggleTagEditModal(open))
  }

  handleDeleteTag = (tag: TagType) => {
    const newTags = this.props.tags.filter(el => el.id !== tag.id)
    this.props.dispatch(setTags(newTags))
  }

  renderDisplayTags = () => {
    const { selectedTags } = this.props
    if (selectedTags.length === 0) return null
    return (selectedTags as Array<TagType>).map((el: TagType) => (
      <DisplayTagWrapper
        key={el.id}
        onClick={this.handleEditTag.bind(this, el)}
        style={{
          backgroundColor: el.backgroundColor,
          color: el.textColor
        }}
      >
        <DisplayTag>{el.title}</DisplayTag>
      </DisplayTagWrapper>
    ))
  }

  renderNormalTags = () => {
    const { tags } = this.props
    if (tags.length === 0) return null
    return (tags as Array<TagType>).map((el: TagType) => (
      <Chip
        onClick={this.handleEditTag.bind(this, el)}
        key={el.id}
        label={el.title}
        onDelete={this.handleDeleteTag.bind(this, el)}
        color='primary'
        style={{
          backgroundColor: el.backgroundColor,
          color: el.textColor
        }}
      />
    ))
  }

  render() {
    const { isDisplay = false } = this.props
    if (isDisplay) {
      return this.renderDisplayTags()
    } else {
      return this.renderNormalTags()
    }
  }
}

const mapStateToProps = (state: StoreStateType) => {
  return {
    selectedTags: state.tags.selectedTags,
    tags: state.tags.tags
  }
}

export default connect(mapStateToProps)(index)
