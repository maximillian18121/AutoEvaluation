import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ProgressBar from "../Components/ProgressBar";
import LoadingSpinner from "../Components/LoadingSpinner";
import ResultTable from "../Components/ResultTable";

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState({
    started: false,
    pc: 0,
    loading: false,
    show: false,
  });
  const [results, setResults] = useState([]);
  const [tests, setTests] = useState(null);

  const handleFileChange = (e) => {
    // console.log(e.target.files); 
    setFile(e.target.files[0]);
    setProgress((prev) => {
      return { ...prev, started: false, pc: 0 };
    });
  };

  const handleTestsChange = (e) => {
    setTests(e.target.files[0]);
    setProgress((prev) => {
      return { ...prev, started: false, pc: 0 };
    });
  };

  const handleTestsSubmit = async (e) => {
    if (!tests) {
      setProgress((prev) => {
        return { ...prev, started: false, pc: 0 };
      });
      setMsg("Please select a zip file for testcase");
      toast.error("No file selected");
      return;
    }
    let formData = new FormData();
    formData.append("testCase", tests);
    setMsg("Uploading Test File");
    try {
      await axios.post("http://localhost:5000/test", formData, {
        onUploadProgress: (ProgressEvent) => {
          setProgress((prevState) => {
            return {
              ...prevState,
              pc: ProgressEvent.progress * 100,
              started: true,
            };
          });
          if (ProgressEvent.progress * 100 === 100) {
            setProgress((prevState) => {
              return {
                ...prevState,
                started: false,
                loading: true,
              };
            });
            setMsg("Upload Succesfull and preparing testcase");
          }
        },
        headers: {
          "Content-Type": "application/x-zip-compressed",
        },
      });
      setProgress((prevState) => {
        return {
          ...prevState,
          loading: false,
          show: true,
        };
      });
      setMsg("TestCase built Successfully");
    } catch (error) {
      setMsg(error);
    }
  };

  const handleFileUpload = async () => {
    if(!tests){
      setProgress((prev) => {
        return { ...prev, started: false, pc: 0, show: false };
      });
      setMsg("Please select a test file for project");
      toast.error("No test file selected");
      return;
    }
    if (!file) {
      setProgress((prev) => {
        return { ...prev, started: false, pc: 0, show: false };
      });
      setMsg("Please select a zip file for project");
      toast.error("No file selected");
      return;
    }
    let formData = new FormData();
    formData.append("zipFile", file);
    setMsg("Processing ...");
    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        onUploadProgress: (ProgressEvent) => {
          setProgress((prevState) => {
            return {
              ...prevState,
              pc: ProgressEvent.progress * 100,
              started: true,
              show:false
            };
          });
          if (ProgressEvent.progress * 100 === 100) {
            setProgress((prevState) => {
              return {
                ...prevState,
                started: false,
                loading: true,
                show:false
              };
            });
            setMsg("Upload Succesfull and processing results");
          }
        },
        headers: {
          "Content-Type": "application/x-zip-compressed",
        },
      });
      setProgress((prevState) => {
        return {
          ...prevState,
          loading: false,
          show: true,
        };
      });
      const result = await res.data;
      setMsg("Test Executed Successfully");
      setResults((prevState) => {
        return [result];
      });
      console.log(1, result);
    } catch (error) {
      setMsg(error);
      console.log(error);
    }
  };
  return (
    <>
      <div className="main-container">
        <div className="header-section">
          <div className="heading">Upload Zip File</div>
        </div>
        <div className="main-section">
          <div className="input-section">
            <div className="first-section">
              <h4>Choose Testcase file</h4>
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
      </div>
    </>
  );
};

export default HomePage;
