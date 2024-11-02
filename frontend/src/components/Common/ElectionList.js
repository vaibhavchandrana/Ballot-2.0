import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../backendUrl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import ElectionItem from "./ElectionItem";

const ElectionList = () => {
  const url = backendUrl();
  const [electionList, setElectionList] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${url}/elections/0/`);
      setElectionList(response.data);
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const { openElection, closeElection } = useMemo(() => {
    const currentDate = new Date();
    const open = [];
    const close = [];

    electionList.forEach((election) => {
      if (
        new Date(election.expiry_date) < currentDate ||
        election.status === "Closed"
      ) {
        close.push(election);
      } else {
        open.push(election);
      }
    });

    return { openElection: open, closeElection: close };
  }, [electionList]);

  const isAdmin = localStorage.getItem("ballot_login_as") === "admin";

  return (
    <div>
      <Card>
        <Card.Header>
          <Nav variant="pills" activeKey={activeTab}>
            <Nav.Item>
              <Nav.Link
                eventKey="active"
                onClick={() => setActiveTab("active")}
              >
                Active ({openElection.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="closed"
                onClick={() => setActiveTab("closed")}
              >
                Closed ({closeElection.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body style={{ minHeight: "80vh" }}>
          <ElectionItem
            electionList={activeTab === "active" ? openElection : closeElection}
            usedIn={isAdmin ? "admin" : "user"}
            fetchElections={fetchElections}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ElectionList;
