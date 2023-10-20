'use strict';
const { Command } = require('@heyday-cli/utils');

class InitCommand extends Command {

};

function init(projectName, opts, command) {
  // console.log('projectName, opts: ', projectName, opts, command.opts(), command.optsWithGlobals());
  return new InitCommand();
}


module.exports = init;
module.exports.InitCommand = InitCommand;