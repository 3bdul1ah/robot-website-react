import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import * as ROSLIB from 'roslib';
import { ros } from "./RosConnection";
import Config from "../scripts/Config";
import "../style/Teleoperation.css";

const Teleoperation = () => {
    const [cmdVel, setCmdVel] = useState(null);
    const [speed, setSpeed] = useState(0.6);
    const [holdInterval, setHoldInterval] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkConnection = () => {
            if (ros && ros.isConnected) {
                setIsConnected(true);
                const topic = new ROSLIB.Topic({
                    ros: ros,
                    name: Config.CMD_VEL_TOPIC,
                    messageType: "geometry_msgs/Twist",
                });
                setCmdVel(topic);
            } else {
                setTimeout(checkConnection, 1000);
            }
        };

        checkConnection();
    }, []);

    const sendCommand = (linearX, angularZ) => {
        if (!cmdVel) return;
        const twist = {
            linear: { x: linearX * speed, y: 0.0, z: 0.0 },
            angular: { x: 0.0, y: 0.0, z: angularZ * speed },
        };
        cmdVel.publish(twist);
    };

    const startHold = (linearX, angularZ) => {
        sendCommand(linearX, angularZ);
        const interval = setInterval(() => sendCommand(linearX, angularZ), 100);
        setHoldInterval(interval);
    };

    const stopHold = () => {
        clearInterval(holdInterval);
        sendCommand(0, 0);
    };

    const handleSpeedChange = (e) => {
        setSpeed(parseFloat(e.target.value));
    };

    return (
        <Container className="text-center">
            <h3>Teleoperation</h3>

            {!isConnected ? (
                <div className="loading-container d-flex flex-column align-items-center">
                    <Spinner animation="border" role="status" />
                    <p>Waiting for robot connection...</p>
                </div>
            ) : (
                <>
                    <div className="control-buttons">
                        <button onMouseDown={() => startHold(1, 0)} onMouseUp={stopHold}>▲</button>
                        <div>
                            <button onMouseDown={() => startHold(0, 1)} onMouseUp={stopHold}>◀</button>
                            <button className="stop" onClick={() => sendCommand(0, 0)}>■</button>
                            <button onMouseDown={() => startHold(0, -1)} onMouseUp={stopHold}>▶</button>
                        </div>
                        <button onMouseDown={() => startHold(-1, 0)} onMouseUp={stopHold}>▼</button>
                    </div>

                    <div className="speed-control">
                        <label htmlFor="speed-slider">Speed: {speed.toFixed(1)}</label>
                        <input
                            id="speed-slider"
                            type="range"
                            min="0.1"
                            max="10.0"
                            step="0.5"
                            value={speed}
                            onChange={handleSpeedChange}
                            className="speed-slider"
                        />
                    </div>
                </>
            )}
        </Container>
    );
};

export default Teleoperation;