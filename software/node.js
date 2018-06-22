const { parseVersionFromCommand } = require('../utils/versionTools');

module.exports = () =>parseVersionFromCommand('node -v');