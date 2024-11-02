import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { backendUrl } from "../../backendUrl";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import "./../../css/electionDetails.css";
import CandidateCard from "./../user/CandidateCard";

const ElectionDetails = () => {
  const [electionData, setElectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [candidateSubInfo, setCandidateSubInfo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editElectionData, setEditElectionData] = useState({});
  const { id } = useParams();
  const url = backendUrl();

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("name", String(candidateName));
    formData.append("subinformation", String(candidateSubInfo));
    formData.append("photo", candidatePhoto);
    formData.append("election", id);

    try {
      const response = await axios.post(`${url}/candidates/add/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Candidate added");
      console.log(response.data);
      getCandidatesaList();
      setCandidateName("");
      setCandidatePhoto(null);
      setCandidateSubInfo("");
    } catch (error) {
      console.error("Error submitting candidate:", error);
      alert("Error submitting candidate:");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditElectionData({
      ...electionData,
    });
  };
  console.log(editElectionData);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEditElectionData({
      ...editElectionData,
      [name]: value,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(
        `${url}/elections/${id}/update/`,
        editElectionData
      );
      alert("Election updated");
      setElectionData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating election:", error);
      alert("Error updating election:");
    }
  };

  useEffect(() => {
    fetchElectionData();
    getCandidatesaList();
  }, [id]);

  const fetchElectionData = async () => {
    try {
      const response = await fetch(`${url}/elections/admin/${id}`);
      const data = await response.json();
      setElectionData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function getCandidatesaList() {
    try {
      const response = await axios.get(`${url}/candidates/election/${id}/`);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <>
      <div className="election-details-container ">
        {isLoading ? (
          <ThreeDots color="#00BFFF" height={80} width={80} />
        ) : (
          <div className="row">
            <div className="election-card col-md-7 pt-md-5">
              <h1>Election Details</h1>
              {isEditing ? (
                <Form>
                  <Form.Group controlId="editElectionName">
                    <Form.Label>Election Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="election_name"
                      value={editElectionData.election_name || ""}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="editGenerationDate">
                    <Form.Label>Generation Date</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="generation_date"
                      value={
                        formatDateTimeLocal(editElectionData.generation_date) ||
                        ""
                      }
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="editExpiryDate">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="expiry_date"
                      value={
                        formatDateTimeLocal(editElectionData.expiry_date) || ""
                      }
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="editAccessType">
                    <Form.Label>Access Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="access_type"
                      value={editElectionData.access_type || ""}
                      onChange={handleEditChange}
                    >
                      <option value="OPEN_FOR_ALL">Open for All</option>
                      <option value="VIA_PASSWORD">Via Password</option>
                    </Form.Control>
                  </Form.Group>
                  {editElectionData.access_type != "OPEN_FOR_ALL" && (
                    <Form.Group controlId="editElectionPass">
                      <Form.Label>Election Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={editElectionData.password || ""}
                        onChange={handleEditChange}
                      />
                    </Form.Group>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <Form.Check
                      type="radio"
                      id="editMakeResultPublicYes"
                      name="make_result_pubic"
                      value="true"
                      checked={
                        String(editElectionData.make_result_pubic) == "true"
                      }
                      onChange={handleEditChange}
                      label="Make Result Public"
                      style={{ marginRight: "8px" }}
                    />
                    <Form.Check
                      type="radio"
                      id="editMakeResultPublicNo"
                      name="make_result_pubic"
                      value="false"
                      checked={
                        String(editElectionData.make_result_pubic) == "false"
                      }
                      onChange={handleEditChange}
                      label="Do Not Make Result Public"
                      style={{ marginRight: "8px" }}
                    />
                  </div>
                  <Button variant="success" onClick={handleEditSubmit}>
                    Save Changes
                  </Button>
                </Form>
              ) : (
                <>
                  <h2 className="card-title pt-4">
                    <strong>Election Name : </strong>
                    {electionData?.election_name}
                  </h2>
                  <div className="card-text">
                    <div className="info-row">
                      <p>
                        <strong>ID:</strong> {electionData?.id}
                      </p>
                      <p>
                        <strong>Generation Date:</strong>{" "}
                        {new Date(electionData?.generation_date).toUTCString()}
                      </p>
                    </div>
                    <div className="info-row">
                      <p>
                        <strong>Expiry Date:</strong>{" "}
                        {new Date(electionData?.expiry_date).toUTCString()}
                      </p>
                      <p>
                        <strong>Access Type:</strong>{" "}
                        {electionData?.access_type}
                      </p>
                    </div>
                  </div>
                  <div className="info-row">
                    <p>
                      <strong>Status:</strong> {electionData?.status}
                    </p>
                    {electionData.access_type !== "OPEN_FOR_ALL" && (
                      <p>
                        <strong>Result Access:</strong>{" "}
                        {electionData?.make_result_pubic
                          ? "Public"
                          : "Only To Admin"}
                      </p>
                    )}
                  </div>
                  <Button variant="warning" onClick={handleEditToggle}>
                    Edit
                  </Button>
                </>
              )}
            </div>
            <div className="add-candidate-form-div col-md-4">
              <Form onSubmit={handleCandidateSubmit}>
                <Form.Group
                  controlId="candidateName"
                  className="form-group-modals"
                >
                  <Form.Label>Candidate Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter candidate name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group
                  controlId="candidatePhoto"
                  className="form-group-modals"
                >
                  <Form.Label>Candidate Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCandidatePhoto(e.target.files[0])}
                  />
                </Form.Group>

                <Form.Group
                  controlId="candidateSubInfo"
                  className="form-group-modals"
                >
                  <Form.Label>Subinformation</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter subinformation"
                    value={candidateSubInfo}
                    onChange={(e) => setCandidateSubInfo(e.target.value)}
                  />
                </Form.Group>
                <br />
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "150px" }}
                >
                  Add Candidate
                </Button>
              </Form>
            </div>
          </div>
        )}
        <h1>Candidate Lists:</h1>
        <div className="row" style={{ width: "100%" }}>
          {candidates.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <CandidateCard data={item} id={id} refresh={getCandidatesaList} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ElectionDetails;
