import React from 'react'
import './style.css'
import { SketchPicker } from 'react-color'

const DEFAULT_COLOR = {
  r: 241,
  g: 112,
  b: 19,
  a: 1
}
class GColorPicker extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: false,
      color: this.props.color || DEFAULT_COLOR,
      offsetTop: 0
    }
  }

  handleClick = e => {
    const wrapper = this.refs.colorPickerWrapper
    const { bottom } = wrapper.getBoundingClientRect()
    this.setState({ displayColorPicker: !this.state.displayColorPicker, offsetTop: bottom })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = color => {
    this.setState({ color: color.rgb })
    this.props.onChange && this.props.onChange(color)
  }

  getPreviewColor = () => (typeof this.state.color === 'string' ? this.state.color : `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`)

  render() {
    const previewColor = this.getPreviewColor()

    return (
      <div className='g-color-picker-wrapper' style={this.props.containerStyle} ref='colorPickerWrapper'>
        <div className='g-color-picker-swatch' onClick={this.handleClick}>
          <div className='g-color-picker-preview-color-after' style={{ backgroundColor: previewColor }}></div>
          <div className='g-color-picker-preview-color' style={{ backgroundColor: previewColor }} />
        </div>
        {this.state.displayColorPicker ? (
          <div className='g-color-picker-popover' style={{ top: this.state.offsetTop }}>
            <div className='g-color-picker-overlay' onClick={this.handleClose} />
            <SketchPicker color={this.state.color} onChange={this.handleChange} />
          </div>
        ) : null}
      </div>
    )
  }
}

export default GColorPicker
