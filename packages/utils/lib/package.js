const path = require('path');
const npmInstall = require('npminstall');
const fse = require('fs-extra');
const pkgDir = require('pkg-dir').sync;
const pathExists = require('path-exists').sync;
const { getDefaultRegistry, getLatestVersion } = require('./npm');
const formatPath = require('./formatPath');
class Package {
    constructor({ targetPath, storeDir, packageName, packageVersion } = {}) {
        // 用户通过--target-path配置的本地Package路径
        this.targetPath = targetPath;
        // 依赖安装目录
        this.storeDir = storeDir;
        // 包名
        this.packageName = packageName;
        // 版本
        this.packageVersion = packageVersion;
        // 默认包路径前缀
        this.pkgFilePathPrefix = this.packageName.replace('/', '+');
    }

    // 前置处理
    async prepare() {
        if (this.storeDir && !pathExists(this.storeDir)) {
            fse.mkdirpSync(this.storeDir);
        }
        await this.getPackageLatestVersion();
    }

    // 生成默认包指定版本本地目录
    getSpecificPkgFilePath(version) {
        return path.resolve(this.storeDir, '.store', `${this.pkgFilePathPrefix}@${version}`, 'node_modules', this.packageName);
    }

    // 默认包本地目录
    get defaultPkgFilePath() {
        return this.getSpecificPkgFilePath(this.packageVersion);
    }

    // 是否存在当前Package
    async exists() {
        if (this.storeDir) {
            await this.prepare();
            // 默认版本包是否存在
            return pathExists(this.defaultPkgFilePath);
        } else {
            // 用户指定包是否存在
            return pathExists(this.targetPath);
        }
    }
    // 安装Package
    async install() {
      await this.prepare();
      return npmInstall({
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
    async update() {
        await this.prepare();
        // 获取最新版本号
        const latestVersion = await getLatestVersion(this.packageName);
        // 最新版本包路径
        const latestPkgFilePath = this.getSpecificPkgFilePath(latestVersion);
        // 不存在则更新
        if (!pathExists(latestPkgFilePath)) {
            await npmInstall({
                root: this.targetPath, // 主目录
                storeDir: this.storeDir, // 依赖安装目录
                register: getDefaultRegistry(),
                pkgs: [{
                    name: this.packageName,
                    version: latestVersion,
                }],
            });
            this.packageVersion = latestVersion;
        }
    }
    // 获取入口文件
    getRootFilePath() {
        function _getRootFilePath(specificPath) {
            const dir = pkgDir(specificPath);
            if (dir) {
                const pkgObj = fse.readJsonSync(path.resolve(dir, 'package.json'));
                if (pkgObj && pkgObj.main) {
                    return formatPath(path.resolve(dir, pkgObj.main));
                }
            }
            return null;
        }
        // 默认包模式
        if (this.storeDir) {
            return _getRootFilePath(this.defaultPkgFilePath);
        }
        // 指定包模式
        return _getRootFilePath(this.targetPath);
    }

    // 获取Package的最新版本号(将latest转化为版本号)
    async getPackageLatestVersion() {
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getLatestVersion(this.packageName);
        }
    }
}

module.exports = Package;