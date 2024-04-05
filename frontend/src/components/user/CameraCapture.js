import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Modal, Button } from "react-bootstrap";

function CameraCapture({ setImage }) {
  const [showModal, setShowModal] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [timer, setTimer] = useState(10); // Initial timer value in seconds
  const webcamRef = useRef(null);

  const closeModal = () => {
    setShowModal(false);
    setCapturedImage(null); // Reset the captured image
  };

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setImage(imageSrc); // Directly use setImage from props
      
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0 && showModal) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && showModal) {
      capture();
      closeModal();
    }
    return () => clearInterval(interval);
  }, [timer, showModal, setImage]); // Remove propTypes from dependency array, replace with setImage

  return (
    <div>
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Capture Photo in {timer} seconds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          {!capturedImage && (
            <Button variant="primary" onClick={capture} disabled={timer > 0}>
              Take Photo Now
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CameraCapture;
