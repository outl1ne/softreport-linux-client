const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');
const homedir = require('os').homedir();
const readline = require('readline');


const runCommand = (command) => {
    console.log('\x1b[36m%s\x1b[0m', command);
    return execSync(command);
}

const dirToWrite = homedir + '/.softreport';
const zipfileName = dirToWrite + '/master.zip';
const sourceDir = dirToWrite + '/' + 'softreport-linux-client-master';
const codeDirectory = dirToWrite;

runCommand('rm -rf ' + dirToWrite);
runCommand('mkdir -p ' + dirToWrite);
// runCommand('rm ' + zipfileName);
runCommand('curl -Lo ' + zipfileName + ' "https://github.com/optimistdigital/softreport-linux-client/archive/master.zip"');

runCommand('mkdir -p ' + codeDirectory);
runCommand('unzip ' + zipfileName + ' -d ' + codeDirectory);
runCommand('rm ' + zipfileName);

let step = 1;

const sendDataToSoftReport = require(sourceDir + '/core/send-version-data.js');

const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout
});

const question = (message, callback) => {
    
    rl.question('\x1b[33m' + message + '\x1b[0m' + '\n', (response) => {        
        callback(response);       
    });
}

const next = () => {
    if (questions.length < step + 1) {
        console.log("\x1b[32mSetup successful. Sending data to server...");
        
        sendDataToSoftReport( () => {
            console.log("\x1b[32mEverything successful! Data sent to server. Go check your dashboard!");
        })
        
        //rl.close();
        return;
    }
    questions[step]();
    step ++;
};

let apiToken = null;

const setConfig = (callback) => {
    const configFile = sourceDir + '/core/config.json';

    const currentConfig = JSON.parse(execSync('cat ' + configFile));

    const newConfig = callback(currentConfig);

    execSync('echo \'' + JSON.stringify(newConfig) + '\' > ' + configFile)
}

const setupApiToken = () => {
    question('What is your API key?', token => {
      
        const result =  runCommand('curl -s -o /dev/null -w "%{http_code}" https://softreport.io/api/ping?api_token=' + token );
        
        if (parseInt(result) !== 200) {
            rl.write('Invalid token (' + result + ')\n');

            setupApiToken();
            return;
        }

        apiToken = token;

        setConfig((config) => ({
            ...config,
            api: {
                ...config.api,
                token: apiToken
            }
        }));    

        next();
    });
}

const setupPackages = () => {
    question('What packages do you want to use? Plesase write them comma separated. \n For example "nginx, php, node, mysql, npm"', (answer) => {

        const packages = answer.replace(/ /g,'').split(',');
        const packageConfig = {};
        packages.forEach(package => {
            packageConfig[package] = true;
        });

        console.log(packageConfig);

        setConfig((config) => ({
            ...config,
            dependencies: packageConfig
        }))

        next();
    });
}

const setupServerID = () => {
    question('What is your server ID?', id => {
        const result =  runCommand('curl -s -o /dev/null -w "%{http_code}" https://softreport.io/api/servers/' + id + '?api_token=' + apiToken);

        if (parseInt(result) !== 200) {
            rl.write('Invalid server ID (' + result + ')\n');
      
            setupServerID();
            return;
        }

        setConfig((config) => ({
            ...config,
            serverId: id
        }))

        next();
    });
}

const questions = [setupApiToken, setupServerID, setupPackages];

const interactiveSetup = () => {
    setupApiToken();
};

interactiveSetup();