import React from 'react'

const LogDashBoard = () => {
  return (
    <>
     <div className="dashboard">
      <h1 className="dashboard-title">Real-time Logs Dashboard</h1>
      <div className="logs-container">
        {/* {logs.map((log, index) => (
          <div key={index} className="log-item">
            {log}
          </div>
        ))} */}
      </div>
    </div>
    </>
  )
}

export default LogDashBoard