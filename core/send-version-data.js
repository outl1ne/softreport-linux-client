const fs = require('fs');
const http = require('http');
const https = require('https');
const config = require('./config.json');

module.exports = (successCallback) => {

dependencies = [];

const dataToSend = Object.keys(config.dependencies).map(dependency => {

    if (config.dependencies[dependency] === true) {
        
        const dependencyScriptPath = '../packages/' +  dependency + '.js';
        
        const retrieveVersion = require(dependencyScriptPath);

        const version = retrieveVersion();

        if(!version) {
            console.error('Could not get version number for ' + dependency);
            return;
        } 
    
        dependencies.push({
            slug: dependency,
            current_version: version
        })
    }
})

const requestJsonData = JSON.stringify({dependencies});



const options = {
    hostname: config.api.host,
    path: config.api.path + '/servers/' + config.serverId + '/dependencies?api_token=' + config.api.token,
    protocol: config.api.protocol,
    port: config.api.port,
    method: 'POST',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        'Content-Length': Buffer.byteLength(requestJsonData)
    },
}

const req = https.request(options, (res) => {

    console.log('Status code ' + res.statusCode);

    if (res.statusCode === 200) {
        console.log('Data sent successfully');
        successCallback();
        return;
    }

    if (res.statusCode === 401) {
        console.log('Invalid api key');
    }

    res.on('data', (data) => {
        process.stdout.write(data);
        //console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(requestJsonData)

req.end();

};