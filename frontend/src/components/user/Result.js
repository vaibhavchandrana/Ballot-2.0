import React, { useEffect, useState } from "react";
import "../../css/result.css";
import { useParams } from "react-router-dom";
import { backendUrl } from "../../backendUrl";

import ChartComponent from "./ChartComponent";
import axios from "axios";
import NoDataComponent from "./NoDataComponent";
import { useNavigate } from "react-router-dom";
import WebSocketComponent from "./WebSocket";
export const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("ballot_login_as")) {
      navigate("/login");
    }
  }, []);

  const url = backendUrl();
  const [candidateList, setCandidates] = useState([]);
  async function getCandidatesaList() {
    try {
      const response = await axios.get(`${url}/candidates/election/${id}/`);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("Error sending data:", error);
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
    <div>
      <WebSocketComponent />
      <div className="result_body">
        <div className="parent row pl-4 d-flex justify-content-center">
          {candidateList.map((item, index) => (
            <div className="child col-11 col-md-6 col-lg-3">
              <h3 className="h3" id={`cd${(index + 1) % 3}`}>
                {item.no_of_votes}
              </h3>
              <h4>{item.name}</h4>
              <p>{item.subinformation}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 col-10 ">
        {" "}
        <ChartComponent data={candidateList} />
      </div>
    </div>
  );
};
