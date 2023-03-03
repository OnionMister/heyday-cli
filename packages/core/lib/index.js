const { log, locale } = require('@heyday-cli/utils');
const pkg = require('../package.json');
const { LOWEST_NODE_VERSION } = require('./const');
const semver = require('semver'); // 比对版本号
const colors = require('colors/safe'); // 输出带颜色的字体

module.exports = core;

function core() {
    try {
        welcome();
        checkNodeVersion();
    } catch (e) {
        log.error(e.message);
    }
}

// 检查node版本，保证脚手架可以正常运行
function checkNodeVersion() {
    // 获取当前版本号
    const curNodeVersion = process.version;
    if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
        throw new Error(colors.red(`heyday-cli 需要安装 v${LOWEST_NODE_VERSION} 以上版本的 Node.js`));
    }
}

function welcome() {
    log.notice('cli', pkg.version);
    log.success(locale());
}