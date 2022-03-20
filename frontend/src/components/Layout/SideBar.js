import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { Col, ListGroup, Row } from "react-bootstrap";
import items from "./Routes";
import styles from "./sidebar.module.scss";
const SideBar = (props) => {
  const location = useLocation();
  return (
    <ListGroup variant="flush" className={styles.sidebarcontainer}>
      {items.map(
        (item) =>
          item.sidebar === true && (
            <ListGroup.Item className={styles.sidebaritem} key={item.title}>
              <Link className="" to={item.path}>
                <Row
                  className={`${styles.item} ${
                    location.pathname === item.path && styles.clicked
                  }`}
                >
                  {item.Icon && (
                    <Col md={2}>
                      <item.Icon />
                    </Col>
                  )}

                  <Col className={`${styles.title} pl-2`}>{item.title}</Col>
                </Row>
              </Link>
            </ListGroup.Item>
          )
      )}
    </ListGroup>
  );
};

export default SideBar;
