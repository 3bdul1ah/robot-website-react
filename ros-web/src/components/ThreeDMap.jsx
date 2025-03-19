import React, { useEffect, useRef, useState } from "react";
import * as ROS3D from "ros3d";
import * as ROSLIB from "roslib";
import { ros } from "./RosConnection";
import Spinner from "react-bootstrap/Spinner";

const ThreeDMap = () => {
    const viewerRef = useRef(null);
    const urdfClientRef = useRef(null);
    const occupancyGridClientRef = useRef(null);
    const [mapAvailable, setMapAvailable] = useState(false);

    useEffect(() => {
        if (!ros) {
            console.error("ROS instance is not available.");
            return;
        }

        console.log("Waiting for 3D map...");

        const mapTopic = new ROSLIB.Topic({
            ros: ros,
            name: "/map",
            messageType: "nav_msgs/OccupancyGrid",
        });

        const handleMapMessage = (message) => {
            if (message) {
                console.log("Received map data:", message);
                setMapAvailable(true);
                mapTopic.unsubscribe();
            } else {
                console.warn("Received empty map message.");
            }
        };

        console.log("Subscribing to /map topic...");
        mapTopic.subscribe(handleMapMessage);

        return () => {
            console.log("Unsubscribing from /map topic...");
            mapTopic.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!mapAvailable || !viewerRef.current) {
            console.warn("Map not available or viewerRef is null. Skipping initialization.");
            return;
        }

        console.log("Initializing 3D Map...");

        const viewer = new ROS3D.Viewer({
            divID: "3d-map",
            width: 600,
            height: 600,
            antialias: true,
            background: "#eeeeee",
        });
        viewerRef.current = viewer;
        console.log("3D Viewer created.");

        viewer.addObject(new ROS3D.Grid({ color: "#cccccc", cellSize: 0.5, num_cells: 20 }));
        console.log("Grid added to 3D Viewer.");

        console.log("Creating TF Client...");
        const tfClient = new ROSLIB.ROS2TFClient({
            ros: ros,
            fixedFrame: "map",
            angularThres: 0.01,
            transThres: 0.01,
            rate: 10.0,
        });

        console.log("Creating URDF Client...");
        urdfClientRef.current = new ROS3D.UrdfClient({
            ros: ros,
            tfClient: tfClient,
            path: "http://127.0.0.1:8000/waffle_base.stl",
            rootObject: viewer.scene,
            param: "robot_description",
        });

        console.log("Creating OccupancyGrid Client...");
        occupancyGridClientRef.current = new ROS3D.OccupancyGridClient({
            ros: ros,
            rootObject: viewer.scene,
            continuous: true,
        });

        return () => {
            console.log("Cleaning up 3D Viewer...");
            tfClient.dispose();
            viewer.scene.children = [];
        };
    }, [mapAvailable]);

    return (
        <div className="text-center">
            <h3>3D Map</h3>
            <div className="d-flex align-items-center justify-content-center" style={{ width: "100%", height: "600px" }}>
                {mapAvailable ? (
                    <div id="3d-map" ref={viewerRef} style={{ width: "600px", height: "600px", border: "1px solid #ddd" }} />
                ) : (
                    <div className="d-flex flex-column align-items-center">
                        <Spinner animation="border" role="status" />
                        <p>Waiting for 3D map...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreeDMap;
