'use strict';
const { Package } = require('@heyday-cli/utils');

module.exports = exec;

const SETTINGS = {
  init: '@heyday-cli/init',
}

function exec(projectName, options, cmd) {
  const cmdName = cmd.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = 'latest';
  const pkg = new Package({ packageName, packageVersion });
  pkg.getRootFilePath();
}
