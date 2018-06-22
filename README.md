<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Requirements](#requirements)
- [Installation](#installation)
- [Supported software](#supported-software)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements
- Node, min version 8.11.3
- Git, min version 2.18.0
- Unzip - ```sudo apt-get install unzip```

## Installation
Following script downloads install.js from this repository. Despite the script starting with seemingly dangerous command, it's not what you think.
It creates a temp file for node to execute from install.js. You can also download and execute install.js by yourself.
```
trap 'rm -f "/tmp/exec.$$"' 0; trap 'exit $?' 1 2 3 15; curl -s https://raw.githubusercontent.com/optimistdigital/softreport-linux-client/master/install.js >/tmp/exec.$$; chmod +x /tmp/exec.$$; node /tmp/exec.$$
```

Command does the following:
1. Downloads this repository
2. Starts interactive CLI to setup config
3. TODO: Sets up cron to periodically send version data to SoftReport backend

## Supported software

1. nginx
2. php
3. mysql
4. node
5. npm