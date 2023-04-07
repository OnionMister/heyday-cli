const log = require('./log');

// const pkgDir = require('pkg-dir');
// import pkgDir from 'pkg-dir';
class Package {
    constructor({ targetPath, localStoragePath, packageName, packageVersion } = {}) {
        console.log('targetPath, localStoragePath, packageName, packageVersion: ', targetPath, localStoragePath, packageName, packageVersion);
        // 用户通过--target-path配置的本地Package路径
        this.targetPath = targetPath;
        // 下载包后的本地存储
        this.localStoragePath = localStoragePath;
        // 包名
        this.packageName = packageName;
        // 版本
        this.packageVersion = packageVersion;
    }
    // 是否存在当前Package
    exists() {
    
    }
    // 安装Package
    install() {
    }
    // 升级Package
    update() {
    }
    // 获取Package的主目录
    getRootFilePath() {
        // const dir = pkgDir(this.targetPath);
        // console.log('dir', dir)
        console.log('11', 11)
    }
}

module.exports = Package;