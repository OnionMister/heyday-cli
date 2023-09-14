const path = require('path'); // 路径操作对象
const { log, locale, npm } = require('@heyday-cli/utils');
const pkg = require('../package.json');
const semver = require('semver'); // 比对版本号
const colors = require('colors/safe'); // 输出带颜色的字体
const rootCheck = require('root-check'); // 降级root账户
const userHome = require('user-home'); // 获取用户主目录
const fs = require('fs'); // node文件操作对象
const dotEnv = require('dotenv'); // 读取环境变量
const registerCommand = require('./cmd');
const { LOWEST_NODE_VERSION, DEFAULT_CLI_HOME } = require('./const');

module.exports = core;

async function core() {
    try {
        await prepareFun();
        registerCommand(pkg);
    } catch (e) {
        log.error(e.message);
        if (process.env.LOG_LEVEL === 'verbose') {
            console.error(e);
        }
    }
}

// 脚手架启动阶段
async function prepareFun() {
    welcome();
    checkNodeVersion();
    // 如何是以root启动安装，则对root降级，防止以后用其他用户登录无法访问或操作的情况出现
    rootCheck(colors.red('请避免使用 root 账户启动本应用'));
    checkUserHome();
    checkEnv();
    await checkUpdate();
}

// 检查脚手架是否有更新
async function checkUpdate() {
    // 获取当前包信息
    const curPkgName = pkg.name;
    const curPkgVersion = pkg.version;
    // 获取线上当前包信息
    const latestVersion = await npm.getSemverLatestVersion(curPkgName, curPkgVersion);
    if (latestVersion && semver.gt(latestVersion, curPkgVersion)) {
        log.warn(colors.yellow(`建议更新${curPkgName}
            当前版本为：${curPkgVersion}
            最新版本为： ${latestVersion}
            更新命令为：npm i -g ${curPkgName}`));
    }
}

// 检查环境变量-预置cli主目录，用于后续使用
function checkEnv() {
    // log.verbose('检查环境变量');
    const dotEvnPath = path.resolve(userHome, '.env');
    if (fs.existsSync(dotEvnPath)) {
        dotEnv.config({ path: dotEvnPath });
    }
    process.env.CLI_HOME_PATH = path.join(userHome, process.env.CLI_HOME ? process.env.CLI_HOME : DEFAULT_CLI_HOME);
}

// 预检查用户主目录（下载、安装依赖等操作依赖用户主目录）
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
    log.success(locale() + ' v' + pkg.version + '\n');
}