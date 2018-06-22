const { parseVersionFromCommand } = require('../utils/versionTools');

module.exports = () => parseVersionFromCommand(process.platform === 'darwin' ? 'nginx -v' : 'dpkg -l | grep nginx'); 