import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Modal, Button } from "react-bootstrap";

function CameraCapture(propTypes) {
  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const openModal = () => {
    setShowModal(true);
  };

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

  const handleRetake = () => {
    setCapturedImage(null); // Clear the captured image
    closeModal();
  };

  const handleUpload = () => {
    // Send the captured image to your API here
    // You can use the 'capturedImage' state to get the image data
    // Example: fetch('your-api-endpoint', { method: 'POST', body: capturedImage });
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={openModal}
        style={{ width: "150px", fontSize: "15px" }}
      >
        Capture Photo
      </Button>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Captured Photo</Modal.Title>
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
          {capturedImage ? (
            <>
              <Button variant="secondary" onClick={handleRetake}>
                Retake
              </Button>
              <Button variant="primary" onClick={handleUpload}>
                Upload
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={capture}>
                Take Photo
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CameraCapture;
