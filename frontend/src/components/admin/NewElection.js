import React, { useState } from 'react';
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import '../../css/admin.css'
const ElectionForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [candidateSubInfo, setCandidateSubInfo] = useState('');

  const handleCandidateSubmit = (e) => {
    e.preventDefault();
    const newCandidate = {
      name: candidateName,
      photo: candidatePhoto,
      subInfo: candidateSubInfo,
    };
    setCandidates([...candidates, newCandidate]);
    setCandidateName('');
    setCandidatePhoto(null);
    setCandidateSubInfo('');
    setShowModal(false);
  };

  return (
    <div className="bg-transparent election-form-div">
      <h1>Election Form</h1>
      <Form>
        <Form.Group as={Row} controlId="electionName" className='election-form-group'>
          <Form.Label column sm={12} md={4}>
            Election Name
          </Form.Label>
          <Col sm={12} md={4}>
            <Form.Control type="text" placeholder="Enter election name" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="electionUrl" className='election-form-group'>
          <Form.Label column sm={12} md={4}>
            Election URL
          </Form.Label>
          <Col sm={12} md={4}>
            <Form.Control type="text" placeholder="Enter election URL" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="dateRange" className='election-form-group'>
          <Form.Label column sm={12} md={4}>
            Election Active Dates
          </Form.Label>
          <Col sm={12} md={4}>
            <Row>
              <Col>
                <Form.Control type="date" placeholder="From Date" />
              </Col>
              <Col>
                <Form.Control type="date" placeholder="To Date" />
              </Col>
            </Row>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="accessType" className='election-form-group'>
          <Form.Label column sm={12} md={4}>
            Access Type
          </Form.Label>
          <Col sm={12} md={4}>
            <Form.Control as="select">
              <option value={1}>Open For All</option>
              <option value={0}>Only By URL</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Candidate
        </Button>

        {candidates.map((candidate, index) => (
          <div key={index}>
            <h3>{candidate.name}</h3>
            <img src={candidate.photo} alt={candidate.name} />
            <p>{candidate.subInfo}</p>
          </div>
        ))}
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCandidateSubmit}>
            <Form.Group controlId="candidateName">
              <Form.Label>Candidate Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter candidate name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="candidatePhoto">
              <Form.Label>Candidate Photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setCandidatePhoto(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="candidateSubInfo">
              <Form.Label>Subinformation</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter subinformation"
                value={candidateSubInfo}
                onChange={(e) => setCandidateSubInfo(e.target.value)}
              />
            </Form.Group>
            <br/>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ElectionForm;
