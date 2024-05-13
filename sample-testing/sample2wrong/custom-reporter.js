// custom-reporter.js

const { exec } = require("node:child_process");

exec("npm run test", { encoding: "utf-8" });

const jsonData = require("./test-result.json");
const { numFailedTests, numPassedTests, numTotalTests, testResults } = jsonData;

const newTestResults = testResults[0].assertionResults.map((result) => {
  const { status, title } = result;
  if (result.failureMessages.length === 0) {
    result.failureMessages[0] = "TestCase passed Successfully";
  } else {
    const failMessage = result.failureMessages[0];
    result.failureMessages[0] = failMessage
      .split(".")[0]
      .split("TestingLibraryElementError:")[1];
  }
  return {
    title,
    status,
    verdict: result.failureMessages[0],
  };
});

const resData = [
 { numTotalTests,
  numPassedTests,
  numFailedTests},
  ...newTestResults,
];

console.log(resData);