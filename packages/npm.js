const { parseVersionFromCommand } = require('../utils/versionTools');

module.exports = () => parseVersionFromCommand('npm -v');