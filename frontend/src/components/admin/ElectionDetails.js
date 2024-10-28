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
  const { id } = useParams();
  const url = backendUrl();
  const handleCandidateSubmit = async (e) => {
    e.preventDefault();

    // Create an instance of FormData
    let formData = new FormData();

    // Append the data to formData
    formData.append("name", String(candidateName));
    formData.append("subinformation", String(candidateSubInfo)); // Ensure this matches the field name expected by your backend
    formData.append("photo", candidatePhoto); // Assuming 'candidatePhoto' is the file
    formData.append("election", id);

    try {
      const response = await axios.post(`${url}/candidates/add/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("candiaete addded");
      console.log(response.data);
      getCandidatesaList();
      // Reset the form fields
      setCandidateName("");
      setCandidatePhoto(null);
      setCandidateSubInfo("");
    } catch (error) {
      console.error("Error submitting candidate:", error);
      alert("Error submitting candidate:");
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
  return (
    <>
      <div className="election-details-container ">
        {isLoading ? (
          <ThreeDots color="#00BFFF" height={80} width={80} />
        ) : (
          <div className="row">
            <div className="election-card col-md-7 pt-md-5">
              <h1>Election Details</h1>
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
                    {electionData?.generation_date}
                  </p>
                </div>
                <div className="info-row">
                  <p>
                    <strong>Expiry Date:</strong> {electionData?.expiry_date}
                  </p>
                  <p>
                    <strong>Access Type:</strong> {electionData?.access_type}
                  </p>
                </div>
                <div className="info-row">
                  <p>
                    <strong>Status:</strong> {electionData?.status}
                  </p>
                  {electionData.access_type !== "OPEN_FOR_ALL" && (
                    <p>
                      <strong>Password:</strong> {electionData?.password}
                    </p>
                  )}
                </div>
              </div>
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
            <div className="col-12 col-md-6 col-lg-3">
              <CandidateCard data={item} id={id} refresh={getCandidatesaList} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ElectionDetails;
