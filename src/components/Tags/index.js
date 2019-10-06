import React, { Component } from 'react'
import { Chip } from '@material-ui/core'

class index extends Component {
  render() {
    const { tags, handleDeleteTag, handleEditTag } = this.props
    if (tags && tags.length > 0) {
      return tags.map(el => (
        <Chip
          onClick={handleEditTag.bind(null, el)}
          key={el.id}
          label={el.tag}
          onDelete={handleDeleteTag.bind(null, el)}
          color="primary"
          style={{
            backgroundColor: el.backgroundColor,
            color: el.color
          }}
        />
      ))
    } else {
      return null
    }
  }
}

export default index
