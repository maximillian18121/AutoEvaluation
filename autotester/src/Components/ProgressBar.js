import React from 'react'

const ProgressBar = ({value}) => {
  return (
    <>
     <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${value}%` }}
      ></div>
      <div className="progress-bar-text">{`${value.toFixed(2)}%`}</div>
    </div>
    </>
  )
}

export default ProgressBar