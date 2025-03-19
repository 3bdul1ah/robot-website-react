import React, { useEffect, useRef, useState } from "react";
import * as ROS2D from "ros2d";
import * as ROSLIB from "roslib";
import { ros } from "./RosConnection";
import robotImage from "../images/robot.png";
import Spinner from "react-bootstrap/Spinner";

const Map = () => {
    const [mapAvailable, setMapAvailable] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        if (!ros) return;

        console.log("Waiting for 2D map...");

        const mapTopic = new ROSLIB.Topic({
            ros: ros,
            name: "/map",
            messageType: "nav_msgs/OccupancyGrid",
        });

        const mapCallback = (message) => {
            if (message) {
                setMapAvailable(true);
                mapTopic.unsubscribe();
            }
        };

        mapTopic.subscribe(mapCallback);

        return () => {
            mapTopic.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!mapAvailable || !ros) return;

        console.log("Initializing 2D Map...");

        const viewer = new ROS2D.Viewer({
            divID: "map-container",
            width: 600,
            height: 600,
        });

        const gridClient = new ROS2D.OccupancyGridClient({
            ros: ros,
            rootObject: viewer.scene,
            continuous: true,
        });

        gridClient.on("change", () => {
            if (gridClient.currentGrid) {
                viewer.scaleToDimensions(gridClient.currentGrid.width * 1.6 , gridClient.currentGrid.height * 0.6);
                viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
            }
        });

        const robotMarker = new ROS2D.NavigationImage({
            size: 1,
            image: robotImage,
        });

        gridClient.rootObject.addChild(robotMarker); // ✅ Attach robot marker to gridClient

        robotMarker.rotation = -90;

        const odomTopic = new ROSLIB.Topic({
            ros: ros,
            name: "/odom",
            messageType: "nav_msgs/Odometry",
        });

        const odomCallback = (message) => {
            const { x, y } = message.pose.pose.position;
            const { z, w } = message.pose.pose.orientation;
            const theta = 2 * Math.atan2(z, w);

            // ✅ Move the robot correctly on the map
            robotMarker.x = x;
            robotMarker.y = -y;

            // ✅ Rotate correctly
            robotMarker.rotation = (theta * 180) / Math.PI - 90;
        };

        odomTopic.subscribe(odomCallback);

        return () => {
            odomTopic.unsubscribe();
        };
    }, [mapAvailable]);

    return (
        <div className="text-center">
            <h3>2D Map</h3>
            <div className="d-flex align-items-center justify-content-center" style={{ width: "100%", height: "600px" }}>
                {mapAvailable ? (
                    <div id="map-container" ref={mapRef} style={{ width: "600px", height: "600px", border: "1px solid #ddd" }} />
                ) : (
                    <div className="d-flex flex-column align-items-center">
                        <Spinner animation="border" role="status" />
                        <p>Waiting for 2D map...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Map;
