import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import ElectionItem from "./ElectionItem";
import { Link } from "react-router-dom";
const ElectionList = () => {
  return (
    <div >

      <Card className="election-list-main-div">
        <Card.Header>
          <Nav variant="pills" defaultActiveKey="#first">
            <Nav.Item>
              <Nav.Link href="#first">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#link">Closed</Nav.Link>
            </Nav.Item>
            <Nav.Item className="add-new-election-item">
              <Link to="new_election">
                <Button>Add new</Button>
              </Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <ElectionItem />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ElectionList;
