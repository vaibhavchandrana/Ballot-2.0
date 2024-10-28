import React, { useState, useEffect } from "react";
import "../../css/voting.css";
import axios from "axios";
import profile from "../../images/profile.png";
import { useParams } from "react-router-dom";
import NoDataComponent from "./NoDataComponent";
import { backendUrl, imageUrl } from "../../backendUrl";
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
  const [candidateList, setCandidates] = useState([]);
  const [electionDetails, setElectionDetails] = useState(null);

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
    if (localStorage.getItem("ballot_login_as") !== "user") {
      navigate("/login");
    }
  }, []);

  const url = backendUrl();

  async function getCandidatesList() {
    try {
      const response = await axios.get(`${url}/candidates/election/${id}/`);
      setCandidates(response.data.candidates);
      setElectionDetails(response.data.election);
    } catch (error) {
      console.error("Error fetching candidates:", error);
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
      toast.success("Vote added successfully!");
    } catch (error) {
      setLoading(false);
      toast.error("Error: " + (error.response?.data?.error || error.message));
    }
  }

  useEffect(() => {
    if (id) {
      getCandidatesList();
    }
  }, [id]);

  if (candidateList.length === 0) return <NoDataComponent />;

  return (
    <div className="voting_page">
      {electionDetails && (
        <header className="election-header">
          <div className="row">
            <div className="col-12 col-md-6 col-xl-4">
              <h2>{electionDetails.election_name}</h2>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <p>
                <strong>Available Dates:</strong> {electionDetails.generation_date}{" "}
                to {electionDetails.expiry_date}
              </p>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <p>
                <strong>Status:</strong> {electionDetails.status}
              </p>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <p>
                <strong>Candidates Count:</strong>{" "}
                {electionDetails.candidates_count}
              </p>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <p>
                <strong>Created By:</strong> {electionDetails.created_by_name}
              </p>
            </div>
          </div>
        </header>
      )}
      <div className="voting_body">
        <div className="card-container">
          {candidateList.map((item) => (
            <div className="custom-card" key={item.id}>
              <img
                src={item.photo ? `${image}${item.photo}` : profile}
                alt="profile"
                className="profile-img"
              />
              <h3 className="candidate-name">{item.name}</h3>
              <p className="candidate-info">{item.subinformation}</p>
              <button
                className={`vote-button ${voterId === item.id ? "active" : ""}`}
                onClick={() => updateVoterId(item.id)}
              >
                Vote
              </button>
            </div>
          ))}
        </div>
        {autoCaptureFlag && <CameraCapture setImage={handleImageUpload} />}
        <center>
          <button
            type="submit"
            id="submit-btn"
            onClick={() => setAutoCaptureFlag(true)}
            disabled={loading}
          >
            {loading ? "Adding..." : "Confirm"}
          </button>
        </center>
      </div>
    </div>
  );
};
