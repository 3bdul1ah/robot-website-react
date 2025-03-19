import React, { Component } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../images/a2tech_logo.png";
import robot from "../images/robot.png";

export default class Header extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
        <Container className="d-flex justify-content-between align-items-center">
          
          {/* Left Side: Logo and Navigation */}
          <div className="d-flex align-items-center">
            <Navbar.Brand href="/">
              <img alt="logo" src={logo} width="100" className="d-inline-block align-top" />
            </Navbar.Brand>
            <Nav className="ms-3">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/About">About</Nav.Link>
            </Nav>
          </div>

          {/* Center: Robot Image and Title */}
          <div className="text-center flex-grow-1">
            <img alt="robot" src={robot} width="65" className="d-block mx-auto" />
            <span className="text-white fw-bold fs-5 d-block">
              <strong>X3Cator Robot Dashboard</strong>
            </span>
          </div>

          {/* Right Side: Navigation Links */}
          <div>
            <Nav className="d-flex">
              <Nav.Link href="/map">Map</Nav.Link>
              <Nav.Link href="/camera">Camera</Nav.Link>
              <Nav.Link href="/Control">Control</Nav.Link>
              <Nav.Link href="/Monitor">Monitor</Nav.Link>
            </Nav>
          </div>
          
        </Container>
      </Navbar>
    );
  }
}
