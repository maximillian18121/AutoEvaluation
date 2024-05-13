import React, { useState } from "react";
import { toast } from "react-toastify";
import TestingPage from "../Components/TestingPage";
import axios from "axios";

const HomePage = () => {

  // state variable for storing zip file
  const [file, setFile] = useState(null);
  const [jestFile,setJestFile] = useState(null);

  // message to show lifecycle of process.
  const [msg, setMsg] = useState("");
  const [jestMsg,setJestMsg] = useState("");

  // toggle variable for executing two different tests.
  let [etoggle, setEToggle] = useState(false);
  let [utoggle, setUToggle] = useState(false);

  // state variable showing different status for file uploading process
  const [progress, setProgress] = useState({
    started: false,
    pc: 0,
    loading: false,
    show: false,
  });

  const [jestProgress,setJestProgress] = useState({
    started: false,
    pc: 0,
    loading: false,
    show: false,
  })

  // state variable for storing value of incoming result after evaluating file from backend.
  const [results, setResults] = useState([]);
  const [jestResults,setJestResults] = useState([]);

  // state variable for storing testcase file.
  const [tests, setTests] = useState(null);
  const [jetTests,setJestTests] = useState(null);

  // toggling functions for opening modal for cypress and jest testing.
  const utogFun = () => {
    setUToggle((prev)=>true);
    setEToggle((prev)=>false);
  };
  const etogFun = () => {
    setEToggle((prev)=>true);
    setUToggle((prev)=>false);
  };

  // function for storing th zip file when we select the file by clicking on select file
  const handleFileChange = (e) => {
    // console.log(e.target.files);
    setFile(e.target.files[0]);
    setProgress((prev) => {
      return { ...prev, started: false, pc: 0 };
    });
  };

  const handleJestFileChange = (e) => {
    setJestFile(e.target.files[0]);
    setJestProgress((prev)=>{
      return {...prev,started:false, pc:0};
    });
  }

  // function for storing the zip file when we select the file by clicking on select testcase file

  const handleTestsChange = (e) => {
    setTests(e.target.files[0]);
    setProgress((prev) => {
      return { ...prev, started: false, pc: 0 };
    });
  };

  const handleJestTestsChange = (e) => {
    setJestTests(e.target.files[0]);
    setJestProgress((prev)=>{
      return {...prev, started:false, pc:0};
    });
  }

  // function for setting tetcase after uploading them in our root folder structure.

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

  const handleJestTestsSubmit = async(e) => {

    if(!jetTests){
      setJestProgress((prev) => {
        return { ...prev, started: false, pc: 0 };
      });
      setJestMsg("Please select a zip file for testcase");
      toast.error("No file selected");
      return;
    }
    let formData = new FormData();
    formData.append('jestTestCase',jetTests);
    setJestMsg("Uploading test file");

    try {
      await axios.post("http://localhost:5000/jestTest", formData, {
        onUploadProgress: (ProgressEvent) => {
          setJestProgress((prevState) => {
            return {
              ...prevState,
              pc: ProgressEvent.progress * 100,
              started: true,
            };
          });
          if (ProgressEvent.progress * 100 === 100) {
            setJestProgress((prevState) => {
              return {
                ...prevState,
                started: false,
                loading: true,
              };
            });
            setJestMsg("Upload Succesfull and preparing testcase");
          }
        },
        headers: {
          "Content-Type": "application/x-zip-compressed",
        },
      });
      setJestProgress((prevState) => {
        return {
          ...prevState,
          loading: false,
          show: true,
        };
      });
      setJestMsg("TestCase built Successfully");
    } catch (error) {
      setJestMsg(error);
    }
  }

  // function for generating testing results.


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

  const handleJestFileUpload = async() => {
    if (!jetTests) {
      setJestProgress((prev) => {
        return { ...prev, started: false, pc: 0, show: false };
      });
      setJestMsg("Please select a test file for project");
      toast.error("No test file selected");
      return;
    }
    if (!jestFile) {
      setJestProgress((prev) => {
        return { ...prev, started: false, pc: 0, show: false };
      });
      setJestMsg("Please select a zip file for project");
      toast.error("No file selected");
      return;
    }

    let formData = new FormData();
    formData.append("zipJestFile", jestFile);
    setJestMsg("Processing ...");
    try {
      const res = await axios.post("http://localhost:5000/jestUpload", formData, {
        onUploadProgress: (ProgressEvent) => {
          setJestProgress((prevState) => {
            return {
              ...prevState,
              pc: ProgressEvent.progress * 100,
              started: true,
              show: false,
            };
          });
          if (ProgressEvent.progress * 100 === 100) {
            setJestProgress((prevState) => {
              return {
                ...prevState,
                started: false,
                loading: true,
                show: false,
              };
            });
            setJestMsg("Upload Succesfull and processing results");
          }
        },
        headers: {
          "Content-Type": "application/x-zip-compressed",
        },
      });
      setJestProgress((prevState) => {
        return {
          ...prevState,
          loading: false,
          show: true,
        };
      });
      const result = await res.data;
      setJestMsg("Test Executed Successfully");
      setJestResults((prevState) => {
        return [result];
      });
      console.log(1, result);
    } catch (error) {
      setJestMsg(error);
      console.log(error);
    }
  }


  return (
    <>
     <div className="navbar">
          <h3 className="nav-item">AutoEvaluation</h3>
          <button className="nav-item button-test" onClick={utogFun}> Unit Testing with Jest</button>
          <button className="nav-item button-test" onClick={etogFun}>End to End Testing with Cypress</button>
        </div>
      <div className="main-container">
        <div className="header-section">
          <div className="heading">Upload ZIP File</div>
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
            text="End to End Testing of Javascript web applications using Cypress Testing Library"
            symbol=" Cypress"
          />
        )}
        {utoggle && (
          <TestingPage
            handleTestsChange={handleJestTestsChange}
            handleFileChange={handleJestFileChange}
            handleTestsSubmit={handleJestTestsSubmit}
            handleFileUpload={handleJestFileUpload}
            progress={jestProgress}
            results={jestResults}
            msg={jestMsg}
            text="Unit Testing of Javascript web application using Jest Testing Library"
            symbol=" Jest"
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
