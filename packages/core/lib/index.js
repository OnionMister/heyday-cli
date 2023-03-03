const { log, locale } = require('@heyday-cli/utils');
const pkg = require('../package.json');


module.exports = core;

function core() {
    checkPkgVersion();
}

function checkPkgVersion() {
    log.notice('cli', pkg.version);
    log.success(locale());
}