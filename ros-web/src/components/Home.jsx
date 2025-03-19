import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RosConnection from "./RosConnection";
import Teleoperation from "./Teleoperation";
import Map from "./Map";
import ThreeDMap from "./ThreeDMap";
import Camera from "./Camera";

const Home = () => {
  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center mb-4">
        <Col md={4} className="text-center">
          <RosConnection />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="text-center">
          <Teleoperation />
        </Col>
        <Col md={6} className="text-center d-flex align-items-center justify-content-center">
          <Camera />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="text-center">
          <div style={{ width: "100%", height: "400px", overflow: "hidden" }}>
            <Map />
          </div>
        </Col>
        <Col md={6} className="text-center">
          <div style={{ width: "100%", height: "400px", overflow: "hidden" }}>
            <ThreeDMap />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
