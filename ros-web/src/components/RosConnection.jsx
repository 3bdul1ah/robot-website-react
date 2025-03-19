import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import * as ROSLIB from 'roslib';
import Config from '../scripts/Config';
import '../style/RosConnection.css';

const ros = new ROSLIB.Ros({
  groovyCompatibility: false, // Added groovyCompatibility: false here
});

const RosConnection = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    console.log("Initializing ROS connection...");

    const connect = () => {
      try {
        ros.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`);
      } catch (error) {
        console.error("Connection Problem:", error);
      }
    };

    ros.on("connection", () => {
      console.log("Connected to websocket server");
      setConnected(true);
    });

    ros.on("error", (error) => {
      console.log("Error connecting:", error);
      setConnected(false);
    });

    ros.on("close", () => {
      console.log("Connection closed. Reconnecting...");
      setConnected(false);
      setTimeout(connect, Config.RECONNECTION_TIMER);
    });

    connect();

    return () => {
      console.log("Closing ROS connection...");
      ros.close();
    };
  }, []);

  return (
    <Alert className="text-center m-3 d-flex align-items-center justify-content-center" variant={connected ? "success" : "danger"}>
      <div className={`status-indicator ${connected ? "connected" : "disconnected"}`}></div>
      <span className="ms-2">{connected ? "Robot Connected" : "Robot Disconnected"}</span>
    </Alert>
  );
};

export { ros };
export default RosConnection;
