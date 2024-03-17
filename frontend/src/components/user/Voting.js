import React, { useState, useEffect } from "react";
import "../../css/voting.css";
import axios from "axios";
import profile from "../../images/profile.png";
import { useParams } from "react-router-dom";
import NoDataComponent from "./NoDataComponent";
import { backendUrl } from "../../backendUrl";
import { imageUrl } from "../../backendUrl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CameraCapture from "./CameraCapture";

export const Voting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const image = imageUrl();
  const [voterId, setVoterId] = useState(0);
  const [imageFile, setImage] = useState(null);
  const [autoCaptureFlag, setAutoCaptureFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateVoterId = (id) => {
    setVoterId(id);
    setAutoCaptureFlag(false);
  };
  const handleImageUpload = (file) => {
    setImage(file);
    if (file) {
      addVote(file);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("ballot_login_as") != "user") {
      navigate("/login");
    }
  }, []);
  const url = backendUrl();
  const [candidateList, setCandidates] = useState([]);
  async function getCandidatesaList() {
    try {
      const response = await axios.get(`${url}/candidates/election/${id}/`);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }
  async function addVote(imageFile) {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/add_vote/election`, {
        voter_email_id: localStorage.getItem("ballot_profile"),
        candidate: voterId,
        election: Number(id),
        image_uri: imageFile,
      });
      setLoading(false);
      // Handle success
      toast.success("Vote added successfully!");
    } catch (error) {
      // Handle error if it is other than success range
      if (error.response) {
        toast.error(` ${error.response.data.error || error.response.status}`);
      } else if (error.request) {
        // Handle error if  request was made but no response was received
        toast.error("No response from server");
      } else {
        // Handle error if something happened in setting up the request that triggered an Error
        toast.error("Error: " + error.message);
      }
    }
  }
  useEffect(() => {
    if (id) {
      getCandidatesaList();
    }
  }, [id]);
  if (candidateList.length == 0)
    return (
      <>
        <NoDataComponent />
      </>
    );
  return (
    <div className="voting_body">
      {candidateList.map((item) => (
        <div className="custom-card">
          <div className="custom-card-body">
            <div className="profile">
              <img
                src={item.photo ? `${image}${item.photo}` : profile}
                alt="profile"
                style={{ borderRadius: "50%", height: "120px", width: "120px" }}
              />
            </div>
            <div className="detail">
              <p id="big">{item.name}</p>
              <p id="small">{item.subinformation}</p>
            </div>
            <div
              className={
                voterId == item.id
                  ? "voting-button voting-button-active"
                  : "voting-button"
              }
            >
              <button onClick={() => updateVoterId(item.id)}>Vote</button>
            </div>
          </div>
        </div>
      ))}
      {autoCaptureFlag && <CameraCapture setImage={handleImageUpload} />}
      <center>
        <button
          type="submit"
          id="subbtn"
          onClick={() => setAutoCaptureFlag(true)}
        >
          {loading ? "Adding..." : "Confirm"}
        </button>
      </center>
    </div>
  );
};
