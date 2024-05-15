import React from 'react'
import useWebSocket,{ReadyState} from 'react-use-websocket'

const LogDashBoard = () => {

    const Socket_Url = "ws://127.0.0.1:8080";
    const result = useWebSocket(Socket_Url,{
        onOpen:()=>{
            console.log("WebSocket connection established.");
        }
    });

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