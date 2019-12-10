import React, { Component } from 'react'
import { Chip } from '@material-ui/core'

class index extends Component {
  render() {
    const { tags, handleDeleteTag, handleEditTag, canDelete = true } = this.props
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
