import React, { useState } from "react";
import "./../../css/CandidateCard.css"; // make sure to create this CSS file and import it
import profile from "../../images/profile.png";
import { imageUrl } from "../../backendUrl";
import axios from "axios";
import { backendUrl } from "../../backendUrl";
import { Form, Button, Modal } from "react-bootstrap";
const CandidateCard = ({ data, id, refresh }) => {
  const image = imageUrl();
  const url = backendUrl();
  const [showModal, setShowModal] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [candidateSubInfo, setCandidateSubInfo] = useState("");
  function handleShowModal() {
    setShowModal(true);
    setCandidateName(data.name);
    setCandidatePhoto(null);
    setCandidateSubInfo(data.subinformation);
  }
  function hideModal() {
    setShowModal(false);
    setCandidateName("");
    setCandidateSubInfo("");
  }

  const handleCandidateEdit = async (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("name", String(candidateName));
    formData.append("subinformation", String(candidateSubInfo));
    if (candidatePhoto) {
      formData.append("photo", candidatePhoto);
    }
    formData.append("election", id);

    try {
      const response = await axios.patch(
        `${url}/candidates/edit/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("candiaete addded");
      console.log(response.data);
      refresh();
    } catch (error) {
      console.error("Error submitting candidate:", error);
      alert("Error submitting candidate:");
    }
  };
  const deleteCandidate = async () => {
    try {
      const response = await axios.delete(`${url}/candidates/delete/${id}/`);
      alert("candiaete delete");
      refresh();
    } catch (error) {
      console.error("Error submitting candidate:", error);
      alert("Error submitting candidate:");
    }
  };
  return (
    <div className="candidate-card">
      <div className="candidate-image">
        <img
          src={data.photo ? `${image}${data.photo}` : profile}
          alt="Candidate"
        />
      </div>
      <div className="candidate-info">
        <h2 style={{ fontSize: data.name.length > 6 ? "10px" : "16px" }}>
          {data.name}
        </h2>
        <p>{data.subinformation}</p>
      </div>
      <div className="vote-button-parent">
        <div className="vote-button-v2" onClick={handleShowModal}>
          <button>Edit</button>
        </div>
        <div className="vote-button-v2">
          <button onClick={deleteCandidate}>Delete</button>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={hideModal}
        className="d-flex align-items-center justify-content-center"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCandidateEdit}>
            <Form.Group controlId="candidateName" className="form-group-modals">
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
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CandidateCard;
