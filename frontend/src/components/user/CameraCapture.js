import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Modal, Button } from "react-bootstrap";

function CameraCapture(propTypes) {
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
      propTypes.setImage(imageSrc);
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
      clearInterval(interval);
      closeModal();
    }
    return () => clearInterval(interval);
  }, [timer, showModal, propTypes]);

  useEffect(() => {
    const countdown = setTimeout(() => {
      if (showModal && timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);
    return () => clearTimeout(countdown);
  }, [timer, showModal]);

  return (
    <div>
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Capture Photo in {timer} seconds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: "100%", height: "auto" }}
              mirrored={false}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            {!capturedImage && (
              <Button variant="primary" onClick={capture} disabled={timer > 0}>
                Take Photo
              </Button>
            )}
          </>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CameraCapture;
