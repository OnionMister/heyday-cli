const semver = require('semver'); // 比对版本号
const colors = require('colors/safe'); // 输出带颜色的字体
const log = require('./log');
const LOWEST_NODE_VERSION = '12.0.0';

class Command {
    constructor(argv) {
        if (!argv) {
            throw new Error('Command类参数不能为空！');
        }
        if (!Array.isArray(argv)) {
            throw new Error('Command类参数必须为数组！');
        }
        if (argv.length < 1) {
            throw new Error('Command类参数列表不能是空！');
        }
        // console.log('argv :>> ', argv);
        this._argv = argv;
        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve();
            chain = chain.then(() => this.checkNodeVersion());
            chain = chain.then(() => this.initArgs());
            chain = chain.then(() => this.init());
            chain = chain.then(() => this.exec());
            chain.catch((err) => {
                log.error(err.message);
            });
        });
    }

    // 检查node版本，保证脚手架可以正常运行
    checkNodeVersion() {
        // 获取当前版本号
        const curNodeVersion = process.version;
        if (!semver.gte(curNodeVersion, LOWEST_NODE_VERSION)) {
            throw new Error(colors.red(`需要v${LOWEST_NODE_VERSION}以上Node版本的，当前版本:${curNodeVersion}`));
        }
    }

    initArgs() {
        const argvLen = this._argv.length;
        this._cmd = this._argv[argvLen - 1];
        this._options = this._cmd.userOptions;
        this._argv = this._argv.slice(0, argvLen - 1)
    }

    init() {
        throw new Error('init必须实现！');
    }

    exec() {
        throw new Error('exec必须实现！');
    }
}

module.exports = Command;
