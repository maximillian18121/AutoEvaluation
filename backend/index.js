const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
const express = require("express");
const cors = require("cors");
const unzipper = require("unzipper");
const { exec } = require("child_process");
// const runApp = require("./utils");
const app = express();
const port = 5000;

app.use(cors());
app.use(fileUpload());
let data = [];
let resultData = [];

const runCommand = (command, options) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) {
        console.error("Error:", err.message);
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};

app.post("/test", (req, res) => {
  const testCase = req.files.testCase;
  const fileName = testCase?.name;
  const execName = fileName.split(".")[0];
  testCase.mv(
    path.join(__dirname, `../testCases/${execName}.zip`),
    async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }
      const result = await fs
        .createReadStream(path.join(__dirname, `../testCases/${execName}.zip`))
        .pipe(
          unzipper.Extract({
            path: path.join(__dirname, "../autotester/tests"),
          })
        )
        .promise();
      console.log("Initiating Preparing Testcases");
      fs.readFile(
        `../autotester/tests/${execName}.js`,
        "utf-8",
        (err, data) => {
          if (err) {
            console.log("Error reading uploaded file:", err);
            return res.status(500).send("Error reading uploaded file");
          }
          fs.writeFile(
            `../autotester/cypress/e2e/evaluate.cy.js`,
            data,
            "utf-8",
            (err) => {
              if (err) {
                console.log("Error replacing file:", err);
                return res.status(500).send("Error replacing file");
              }
              console.log("File replaced successfully");
              return res
                .status(200)
                .json({ message: "File uploaded and replaced" });
            }
          );
        }
      );
    }
  );
});

app.post("/upload", (req, res) => {
  const zipFile = req.files.zipFile;
  const fileName = zipFile?.name;
  const execName = fileName.split(".")[0];
  //res.json({"message":"success","body":zipFile});
  zipFile.mv(path.join(__dirname, `../db/${execName}.zip`), async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
    try {
      const result = await fs
        .createReadStream(path.join(__dirname, `../db/${execName}.zip`))
        .pipe(
          unzipper.Extract({
            path: path.join(__dirname, "../autotester/fetchFolder"),
          })
        )
        .promise();
      console.log(result);
      console.log("Initiating node modules installation");
      //exec start

      const main = async () => {
        // executing npm install
        await runCommand("npm install", {
          cwd: path.join(__dirname, `../autotester/fetchFolder/${execName}`),
        });
        console.log("Dependencies installed successfully");

        // executing npm start

        // executing npm start with a timeout of  30 seconds
        console.log("Starting React App");

        // Create a wrapper promise that resolves or rejects based on the npmStartPromise
        const wrapperPromise = new Promise((resolve, reject) => {
          const npmStartPromise = runCommand("npm start", {
            cwd: path.join(__dirname, `../autotester/fetchFolder/${execName}`),
          });

          npmStartPromise.then(resolve).catch(reject);
        });

        // Set a timeout using Promise.race
        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(
              new Error("Command execution timed out. Terminating the process.")
            );
          }, 30000); // 30 seconds
        });

        try {
          // Use Promise.race to wait for either npmStartPromise or timeoutPromise to settle
          await Promise.race([wrapperPromise, timeoutPromise]);
          console.log("App started successfully on localhost");
        } catch (error) {
          console.error("Error starting the app:", error.message);
        }

        // running Cypress tests
        console.log("Initiating cypress tests on React app");
        // Create a runner promise that resolves or rejects based on the npmRunPromise
        const runnerPromise = new Promise((resolve, reject) => {
          const npmRunPromise = runCommand("npx cypress run", {
            cwd: path.join(__dirname, `../autotester`),
          });

          npmRunPromise.then(resolve).catch(reject);
        });

        try {
          // Use Promise.race to wait for either npmStartPromise or timeoutPromise to settle
          await Promise.race([runnerPromise, timeoutPromise]);
          console.log("Executing Cypress tests on app.");
        } catch (error) {
          console.error("Error in cypress testing on app:", error.message);
        }

        // await runCommand("npx cypress run", {
        //   cwd: path.join(__dirname, `../autotester`),
        // });
        // console.log("Cypress tests executed successfully");

        // // Run PowerShell command to stop process on port 3000
        // await runCommand(
        //   "Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force",
        //   {shell:"powershell"},
        //   {cwd:"../backend"}
        // );
        // console.log("Process on port 3000 stopped");

        //Create a kill promise that resolves or rejects based on the npmKilPromise
        console.log("Kill localhost terminal.");
        const killerPromise = new Promise((resolve, reject) => {
          const npmKillPromise = runCommand("Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force ", {
            cwd: path.join(__dirname, `../autotester`),
          });

          npmKillPromise.then(resolve).catch(reject);
        });

        try {
          // Use Promise.race to wait for either npmStartPromise or timeoutPromise to settle
          await Promise.race([killerPromise, timeoutPromise]);
          console.log("Killing localhost 3000.");
        } catch (error) {
          console.error("Error killing the localhost:", error.message);
        }
      };
      await main();

      const fetchData = () => {
        //fetching data from results.json
        resultData = JSON.parse(
          fs.readFileSync("../autotester/results.json", "utf-8")
        );
        const {
          "cypress\\e2e\\evaluate.cy.js": testResults,
          totals: { suites, tests, failed, passed, pending, skipped },
        } = resultData;
        data = [
          { testResults },
          { suites, tests, failed, passed, pending, skipped },
        ];

        console.log(data);
        return res.status(200).json(data);
      };

      setTimeout(fetchData, 40000);
    } catch (error) {
      console.log(error);
      return res.status(400).json(err);
    }
  });
});
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(port, () => {
  console.log(`server is live at port ${port}`);
});

/*
 exec(
        "npm install",
        { cwd: path.join(__dirname, `../autotester/fetchFolder/${execName}`) },
        (err, stdout, stderr) => {
          if (err) {
            console.log("Error Installing dependencies:", stderr);
            return;
          }
          console.log("stdout",stdout);
          console.log("Dependencies installed successfully");
          console.log("Starting executing app on localhost ...");

          exec(
            "npm start",
            {
              cwd: path.join(
                __dirname,
                `../autotester/fetchFolder/${execName}`
              ),
            },
            (err, stdout, stderr) => {
              if(err||stderr){
                console.log(err,stderr);
                return;
              }
              //console.log(err, stderr, stdout);
              //console.log("stdout",stdout);
              console.log("App successfully ran on localhost");
              console.log("Executing tests on react app");

              exec(
                "npx cypress run",
                { cwd: "../autotester" },
                (error, stdout, stderr) => {
                  
                  console.log("Text executed successfully");
                  console.log("Process of fetching result started");
                  resultData = JSON.parse(
                    fs.readFileSync("../autotester/results.json", "utf-8")
                  );
                  console.log(resultData);
                  const {
                    "cypress\\e2e\\evaluate.cy.js": testResults,
                    totals: { suites, tests, failed, passed, pending, skipped },
                  } = resultData;
                  data = [
                    { testResults },
                    { suites, tests, failed, passed, pending, skipped },
                  ];

                  exec(
                    "Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force",
                    { shell:'powershell' },
                    (err, stderr, stdout) => {
                      //console.log("stdout",stdout);
                      console.log("Test execution ended successfully");
                    }
                  );
                  return res.status(200).json(data);
                }
              );
            }
          );
        }
      );
 */
