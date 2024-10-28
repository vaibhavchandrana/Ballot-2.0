import React, { useEffect, useState } from "react";

const ElectionResults = ({ electionId }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/get_result/election/18/`
    );

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCandidates(data.candidates);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [electionId]);

  return (
    <div>
      <h1>Live Election Results</h1>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <img src={candidate.photo} alt={candidate.name} />
            <h2>{candidate.name}</h2>
            <p>{candidate.subinformation}</p>
            <p>Votes: {candidate.no_of_votes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectionResults;
