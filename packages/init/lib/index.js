'use strict';


function init(projectName, opts, command) {
  console.log('projectName, opts: ', projectName, opts, command.opts(), command.optsWithGlobals());
}

module.exports = init;