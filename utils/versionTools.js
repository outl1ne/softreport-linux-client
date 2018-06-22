const { execSync } = require('child_process');

const parseVersionString = (string) => {
    const match = string.match(/\d\.\d[\d\.]*/);

    if (match !== null) {
        return match[0];
    }

    console.warn('Could not find version number from string: ' + string);

    return null;
}

const parseVersionFromCommand = (command) => {
    const result = execSync(command).toString();
    const version = parseVersionString(result);
    return version;
}

module.exports = {
    parseVersionFromCommand: parseVersionFromCommand
}