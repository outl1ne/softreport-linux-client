const { parseVersionFromCommand } = require('../utils/versionTools');

module.exports = () => parseVersionFromCommand('php -v');