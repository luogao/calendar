import React from 'react'

function LoadingView() {
  return (
    <div className='loading-view-wrapper'>
      <div className='lds-ripple'>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default LoadingView
