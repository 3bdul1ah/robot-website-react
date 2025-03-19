import React, { useEffect, useRef, useState } from "react";
import * as ROSLIB from 'roslib';
import { ros } from "./RosConnection";
import { Spinner } from "react-bootstrap";

const Camera = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const imageRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!ros) return;

        console.log("Initializing Camera Stream...");

        const cameraListener = new ROSLIB.Topic({
            ros: ros,
            name: "/camera/image_raw/compressed",
            messageType: "sensor_msgs/CompressedImage",
        });

        cameraListener.subscribe((message) => {
            if (message.data) {
                setImageSrc(`data:image/jpeg;base64,${message.data}`);
                setIsConnected(true);
            }
        });

        return () => {
            cameraListener.unsubscribe();
        };
    }, []);

    return (
        <div className="text-center">
            <h3>Camera Stream</h3>
            {!isConnected ? (
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "200px" }}>
                    <Spinner animation="border" role="status" />
                    <p>Waiting for camera stream...</p>
                </div>
            ) : (
                <img ref={imageRef} src={imageSrc} alt="Live Camera Feed" style={{ width: "100%", maxWidth: "600px" }} />
            )}
        </div>
    );
};

export default Camera;
