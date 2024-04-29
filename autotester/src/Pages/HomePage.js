import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import TestingPage from "../Components/TestingPage";

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  let [etoggle, setEToggle] = useState(false);
  let [utoggle, setUToggle] = useState(false);
  const [progress, setProgress] = useState({
    started: false,
    pc: 0,
    loading: false,
    show: false,
  });
  const [results, setResults] = useState([]);
  const [tests, setTests] = useState(null);

  const utogFun = () => {
    setUToggle(!utoggle);
  };
  const etogFun = () => {
    setEToggle(!etoggle);
  };

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
    if (!tests) {
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
              show: false,
            };
          });
          if (ProgressEvent.progress * 100 === 100) {
            setProgress((prevState) => {
              return {
                ...prevState,
                started: false,
                loading: true,
                show: false,
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
        <div className="testing-area">
          <div className="btn-container">
            <button className="main-button" onClick={etogFun}>
              End to End Testing with Cypress
            </button>
            <button className="main-button" onClick={utogFun}>
              Unit Testing with JEST
            </button>
          </div>
        </div>
        {etoggle && (
          <TestingPage
            handleTestsChange={handleTestsChange}
            handleFileChange={handleFileChange}
            handleTestsSubmit={handleTestsSubmit}
            handleFileUpload={handleFileUpload}
            progress={progress}
            results={results}
            msg={msg}
            text=" Cypress"
          />
        )}
        {utoggle && (
          <TestingPage
            handleTestsChange={handleTestsChange}
            handleFileChange={handleFileChange}
            handleTestsSubmit={handleTestsSubmit}
            handleFileUpload={handleFileUpload}
            progress={progress}
            results={results}
            msg={msg}
            text=" JEST"
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
