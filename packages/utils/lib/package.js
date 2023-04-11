const npmInstall = require('npminstall');
const pkgDir = require('pkg-dir').sync;
const pathExists = require('path-exists').sync;
const { getDefaultRegistry } = require('./npm');
const formatPath = require('./formatPath');
class Package {
    constructor({ targetPath, storeDir, packageName, packageVersion } = {}) {
        console.log('targetPath, storeDir, packageName, packageVersion: ', targetPath, storeDir, packageName, packageVersion);
        // 用户通过--target-path配置的本地Package路径
        this.targetPath = targetPath;
        // 依赖安装目录
        this.storeDir = storeDir;
        // 包名
        this.packageName = packageName;
        // 版本
        this.packageVersion = packageVersion;
    }
    // 是否存在当前Package
    exists() {
        if (this.storeDir) {
        } else {
            // 用户指定包
            return pathExists(this.targetPath);
        }
    }
    // 安装Package
    install() {
      npmInstall({
        root: this.targetPath, // 主目录
        storeDir: this.storeDir, // 依赖安装目录
        register: getDefaultRegistry(),
        pkgs: [{
          name: this.packageName,
          version: this.packageVersion,
        }],
      });      
    }
    // 升级Package
    update() {
    }
    // 获取Package的主目录
    getRootFilePath() {
        const dir = pkgDir(this.targetPath);
        formatPath(dir);
        console.log('dir', dir)
    }
}

module.exports = Package;