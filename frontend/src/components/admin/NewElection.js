import React, { useState } from "react";

const NewElection = () => {
  const [url, setUrl] = useState("");
  const [formattedUrl, setFormattedUrl] = useState("");
  const [showButton, setShowButton] = useState(false);

  const handleChange = (e) => {
    const inputUrl = e.target.value;
    const formattedInputUrl = inputUrl.replace(/\s+/g, "-");
    setUrl(inputUrl);
    setFormattedUrl(formattedInputUrl);
    setShowButton(formattedInputUrl.length > 0);
  };

  const handleAddCandidate = () => {
    // Handle adding the candidate to the election
    console.log("Candidate added!");
  };

  return (
    <div style={{ height: "100%" }}>
      <label htmlFor="electionUrl">Election URL:</label>
      <input
        type="text"
        id="electionUrl"
        value={url}
        onChange={handleChange}
        placeholder="Enter election URL"
      />
      {formattedUrl && <p>Formatted URL: {formattedUrl}</p>}
      {showButton && (
        <button onClick={handleAddCandidate}>Add Candidate</button>
      )}
    </div>
  );
};

export default NewElection;
