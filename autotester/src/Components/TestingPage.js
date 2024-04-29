import React from "react";
import ProgressBar from "./ProgressBar";
import ResultTable from "./ResultTable";
import LoadingSpinner from "./LoadingSpinner";

const TestingPage = ({
  handleTestsChange,
  handleFileChange,
  handleTestsSubmit,
  handleFileUpload,
  progress,
  results,
  msg,
  text
}) => {
  return (
    <>
      <div className="main-section">
        <div className="input-section">
          <div className="first-section">
            <h4>{`Choose Testcase file${text}`}</h4>
            <input
              type="file"
              className="main-input"
              placeholder="choose testcases"
              onChange={(e) => {
                handleTestsChange(e);
              }}
            />
          </div>
          <div className="second-section">
            <h4>Choose Solution file</h4>
            <input
              type="file"
              className="main-input"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
        </div>
        <div className="btn-container">
          <button className="main-button" onClick={handleTestsSubmit}>
            Set TestCase
          </button>
          <button className="main-button" onClick={handleFileUpload}>
            Start Testing
          </button>
        </div>
        {progress.started && <ProgressBar value={progress.pc} />}
        {!progress.started && progress.loading && <LoadingSpinner />}
        <h2>{msg}</h2>
        {progress.show && (
          <div>
            <ResultTable results={results} />
          </div>
        )}
      </div>
    </>
  );
};

export default TestingPage;
