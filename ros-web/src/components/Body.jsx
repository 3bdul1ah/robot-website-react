import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Map from "./Map";
import Camera from "./Camera";
import Control from "./Control";
import Monitor from "./Monitor";

class Body extends Component {
  render() {
    return (
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<Map />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/control" element={<Control />} />
          <Route path="/monitor" element={<Monitor />} />
        </Routes>
      </Container>
    );
  }
}

export default Body;
