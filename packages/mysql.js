const { parseVersionFromCommand } = require('../utils/versionTools');

module.exports = () => parseVersionFromCommand('mysql -V');