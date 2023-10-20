'use strict';
const { Command, log } = require('@heyday-cli/utils');

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    this.force = this._options.force;
    log.verbose(`projectName: ${this.projectName}`);
    log.verbose(`force: ${this.force}`);
  }

  exec() {
    console.log('init的业务逻辑');
  }
};

function init(argv) {
  // console.log('projectName, opts: ', projectName, opts, command.opts(), command.optsWithGlobals());
  return new InitCommand(argv);
}


module.exports = init;
module.exports.InitCommand = InitCommand;