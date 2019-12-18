import React, { PureComponent } from 'react'
import { Chip } from '@material-ui/core'
import styled from 'styled-components'
import { TagType } from '../../types'

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
  canDelete: boolean
  isDisplay: boolean
  tags: TagType[] | []
  handleEditTag: Function
  handleDeleteTag: Function
}

class index extends PureComponent<TagsProps> {
  renderDisplayTags = () => {
    const { tags, handleEditTag } = this.props
    if (tags.length === 0) return null
    return tags.map((el: TagType) => (
      <DisplayTagWrapper
        key={el.id}
        onClick={handleEditTag.bind(null, el)}
        style={{
          backgroundColor: el.backgroundColor,
          color: el.textColor
        }}
      >
        <DisplayTag>{el.title}</DisplayTag>
      </DisplayTagWrapper>
    ))
  }

  render() {
    const { tags, handleDeleteTag, handleEditTag, canDelete = true, isDisplay = false } = this.props
    if (isDisplay) return this.renderDisplayTags()
    if (tags && tags.length > 0) {
      return tags.map(el => (
        <Chip
          onClick={handleEditTag.bind(null, el)}
          key={el.id}
          label={el.title}
          onDelete={canDelete ? handleDeleteTag.bind(null, el) : null}
          color='primary'
          style={{
            backgroundColor: el.backgroundColor,
            color: el.textColor
          }}
        />
      ))
    } else {
      return null
    }
  }
}

export default index
