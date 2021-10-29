import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { Col, ListGroup, Row } from "react-bootstrap";
import items from "./Routes";
const SideBar = (props) => {
  const location = useLocation();
  return (
    <ListGroup variant="flush" className="sidebar-container">
      {items.map((item) => (
        <ListGroup.Item className="sidebar-item" key={item.title}>
          <Link className="" to={item.path}>
            <Row
              className={`item ${
                location.pathname.includes(item.path) && "clicked"
              }`}
            >
              <Col md={2}>{item.Icon && <item.Icon />}</Col>

              <Col md={8} className="title pl-4">
                {item.title}
              </Col>
            </Row>
          </Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SideBar;
