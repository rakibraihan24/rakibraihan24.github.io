const { spawn } = require('child_process');
const path = require('path');

// Function to run a command
function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            ...options
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
}

// Main function
async function main() {
    try {
        console.log('Starting MongoDB...');
        await runCommand('mongod', ['--dbpath', path.join(__dirname, 'data', 'db')]);

        console.log('Running database setup...');
        await runCommand('node', ['setup.js']);

        console.log('Starting server...');
        await runCommand('node', ['server.js']);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main(); 