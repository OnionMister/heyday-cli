'use strict';
const path = require('path');
const { Package } = require('@heyday-cli/utils');

module.exports = exec;

// 脚手架默认包
const SETTINGS = {
    init: '@heyday-cli/init',
}
const DEPENDENCIES_PATH = 'dependencies';

async function exec(projectName, options, cmd) {
    let initPackage;
    const homePath = process.env.CLI_HOME_PATH;
    let { targetPath } = cmd.optsWithGlobals() || {};
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
    console.log('rootFilePath: ', rootFilePath);
    // TODO: 入口文件
}
