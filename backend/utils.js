const util = require('util');
const { exec } = require('child_process');

// Promisify the exec function to use async/await
const execAsync = util.promisify(exec);

// Function to run exec command and handle the output using async/await
async function runCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
  }
}

// Command to install dependencies using npm
const installCommand = 'npm install';

// Command to start the application using npm start
const startCommand = 'npm start';

// Async function to run the commands sequentially
async function runApp() {
  try {
    // Run npm install command
    console.log('Installing dependencies...');
    await runCommand(installCommand);

    // Run npm start command after npm install completes
    console.log('Starting the application...');
    await runCommand(startCommand);

    console.log('Application started successfully.');
  } catch (error) {
    console.error(`Error running the application: ${error.message}`);
  }
}

// Call the async function to run the commands
module.exports = runApp;
