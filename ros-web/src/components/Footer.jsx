import React, { Component } from "react";
import { Container } from "react-bootstrap";

export default class Footer extends Component {
  render() {
    return (
      <Container fluid className="bg-dark text-white text-center py-3 d-flex justify-content-center align-items-center">
        <p className="mb-0">Copyright &copy; A2 Tech Sdn Bhd</p>
      </Container>
    );
  }
}
