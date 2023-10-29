'use strict';
const path = require('path');
const childProcess = require('child_process');
const { Package, log } = require('@heyday-cli/utils');

module.exports = exec;

// 脚手架默认包
const SETTINGS = {
    init: '@heyday-cli/init',
}
const DEPENDENCIES_PATH = 'dependencies';

async function exec(projectName, options, cmd) {
    try {
        const homePath = process.env.CLI_HOME_PATH;
        let { targetPath } = cmd.optsWithGlobals() || {};
        log.verbose('targetPath', targetPath);
        log.verbose('homePath', homePath);
        
        let initPackage;
        let storeDir;
        const cmdName = cmd.name();
        const packageName = SETTINGS[cmdName];
        const packageVersion = 'latest';
        // 用户未指定包，则使用脚手架默认包
        if (!targetPath) {
            targetPath = path.resolve(homePath, DEPENDENCIES_PATH);
            storeDir = path.resolve(targetPath, 'node_modules');
            initPackage = new Package({ targetPath, storeDir, packageName, packageVersion });
            if (await initPackage.exists()) {
                // 更新
                await initPackage.update();
            } else {
                // 安装
                await initPackage.install();
            }
        } else {
            initPackage = new Package({ targetPath, packageName, packageVersion });
        }
        const rootFilePath = initPackage.getRootFilePath();
        if (rootFilePath) {
            // 当前进程调用
            // require(rootFilePath).call(null, Array.from(arguments));

            // 使用node子进程
            const args = Array.from(arguments);
            const cmd = args[args.length - 1];
            // cmd过滤
            const tempObj = Object.create(null);
            Object.keys(cmd).forEach(key => {
                if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
                    tempObj[key] = cmd[key];
                }
            });
            tempObj.userOptions = cmd.optsWithGlobals() || {};
            args[args.length - 1] = tempObj;
            const code = `require('${rootFilePath}').call(null, ${JSON.stringify(args)})`;
            const child = cusSpawn('node', ['-e', code], {
                cwd: process.cwd(),
                stdio: 'inherit',
            });
            child.on('error', e => {
                log.error(e.message);
                process.exit(1);
            });
            child.on('exit', e => {
                log.verbose(`命令执行完成，code：${e}`);
                process.exit(e);
            });
        }
    } catch(err) {
        log.error(err.message);
    }
}

// 兼容win的命令执行
function cusSpawn(command, args, options) {
    const win32 = process.platform === 'win32';
    const cmd = win32 ? 'cmd' : command;
    const cmdArgs = win32 ? ['/c'].concat(command, args) : args;

    return childProcess.spawn(cmd, cmdArgs, options || {});
}

module.exports = exec;