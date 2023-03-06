const { log, locale } = require('@heyday-cli/utils');
const pkg = require('../package.json');
const { LOWEST_NODE_VERSION } = require('./const');
const semver = require('semver'); // 比对版本号
const colors = require('colors/safe'); // 输出带颜色的字体
const rootCheck = require('root-check'); // 降级root账户
const userHome = require('user-home'); // 获取用户主目录
const fs = require('fs'); // node文件操作对象

module.exports = core;

function core() {
    try {
        welcome();
        checkNodeVersion();
        // 如何是以root启动安装，则对root降级，防止以后用其他用户登录无法访问或操作的情况出现
        rootCheck(colors.red('请避免使用 root 账户启动本应用'));
        checkUserHome();
    } catch (e) {
        log.error(e.message);
    }
}

// 缓存等操作依赖用户主目录，预检查用户主目录
function checkUserHome() {
    if (!userHome || !fs.existsSync(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

// 检查node版本，保证脚手架可以正常运行
function checkNodeVersion() {
    // 获取当前版本号
    const curNodeVersion = process.version;
    if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
        throw new Error(colors.red(`「heyday-cli」需要安装「v${LOWEST_NODE_VERSION}」以上版本的Node.js`));
    }
}

function welcome() {
    log.notice('cli', pkg.version);
    log.success(locale());
}