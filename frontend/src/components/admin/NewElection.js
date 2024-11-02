import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import "../../css/admin.css";
import { backendUrl } from "../../backendUrl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  electionName: "",
  electionPass: "",
  fromDate: "",
  toDate: "",
  accessType: 1,
  makeResultPublic: "true",
};

const ElectionForm = () => {
  const url = backendUrl();
  const navigate = useNavigate();
  console.log(localStorage.getItem("ballot_admin_id"));
  const sendFormDataToBackend = async () => {
    try {
      const electionData = {
        election_name: formData.electionName,
        generation_date: formData.fromDate,
        expiry_date: formData.toDate,
        candidates: null,
        created_by: JSON.parse(localStorage.getItem("ballot_admin_id")),
        access_type: formData.accessType == 0 ? "VIA_PASSWORD" : "OPEN_FOR_ALL",
        password: formData.electionPass,
        make_result_public: formData.makeResultPublic === "true",
      };

      const response = await axios.post(
        `${url}/create/election/`,
        electionData
      );
      navigate(`/admin/election/details/${response.data.id}`);
      localStorage.setItem("ballot_newElectionID", response.data.id);
      if (response.status == 201) {
        toast.success("Election Added Successfully");
      } else if (response.status == 400) {
        toast.error("Expiry date must be greater than the generation date.");
      }
    } catch (error) {
      toast.error("Unable to add election");
    }
  };

  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="bg-transparent election-form-div">
      <h1>Add New Election </h1>
      <Form>
        <Form.Group
          as={Row}
          controlId="electionName"
          className="election-form-group"
        >
          <Form.Label column sm={12} md={4}>
            Election Name
          </Form.Label>
          <Col sm={12} md={4}>
            <Form.Control
              type="text"
              name="electionName"
              placeholder="Enter election name"
              value={formData.electionName}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          controlId="accessType"
          className="election-form-group"
        >
          <Form.Label column sm={12} md={4}>
            Access Type
          </Form.Label>
          <Col sm={12} md={4}>
            <Form.Control
              as="select"
              name="accessType"
              value={formData.accessType}
              onChange={handleInputChange}
            >
              <option value={1}>Public</option>
              <option value={0}>Password Protected</option>
            </Form.Control>
          </Col>
        </Form.Group>

        {formData.accessType == 0 && (
          <Form.Group
            as={Row}
            controlId="electionUrl"
            className="election-form-group"
          >
            <Form.Label column sm={12} md={4}>
              Election Password
            </Form.Label>
            <Col sm={12} md={4}>
              <Form.Control
                type="text"
                name="electionPass"
                placeholder="Enter election key"
                value={formData.electionPass}
                onChange={handleInputChange}
              />
            </Col>
          </Form.Group>
        )}

        <Form.Group
          as={Row}
          controlId="dateRange"
          className="election-form-group"
        >
          <Form.Label column sm={12} md={4}>
            Election Active Dates
          </Form.Label>
          <Col sm={12} md={4}>
            <Row>
              <Col>
                <Form.Control
                  type="datetime-local"
                  name="fromDate"
                  placeholder="From Date"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                />
              </Col>
              <Col>
                <Form.Control
                  type="datetime-local"
                  name="toDate"
                  placeholder="To Date"
                  value={formData.toDate}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          controlId="makeResultPublic"
          className="election-form-group"
        >
          <Form.Label column sm={12} md={4}>
            Make Result Public
          </Form.Label>
          <Col sm={12} md={4}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Check
                type="radio"
                id="makeResultPublicYes"
                name="makeResultPublic"
                value="true"
                checked={formData.makeResultPublic === "true"}
                onChange={handleInputChange}
                label="Yes"
                style={{ marginRight: "8px" }}
              />
              <Form.Check
                type="radio"
                id="makeResultPublicNo"
                name="makeResultPublic"
                value="false"
                checked={formData.makeResultPublic === "false"}
                onChange={handleInputChange}
                label="No"
                style={{ marginRight: "8px" }}
              />
            </div>
          </Col>
        </Form.Group>

        <Button variant="primary" onClick={sendFormDataToBackend}>
          Create Election
        </Button>
      </Form>
    </div>
  );
};

export default ElectionForm;
