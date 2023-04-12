const npmInstall = require('npminstall');
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
    }

    // 
    async prepare() {
        await this.getPackageLatestVersion();
    }

    // 是否存在当前Package
    async exists() {
        if (this.storeDir) {
            await this.prepare();
            return pathExists(this.cacheFilePath);
        } else {
            // 用户指定包
            return pathExists(this.targetPath);
        }
    }
    // 安装Package
    async install() {
      await this.prepare();
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
    // 获取Package的入口文件
    getRootFilePath() {
        const dir = pkgDir(this.targetPath);
        formatPath(dir);
        // console.log('dir', dir)
    }
    // 获取package.json内容

    // 获取Package的最新版本号
    async getPackageLatestVersion() {
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getLatestVersion(this.packageName);
        }
    }
}

module.exports = Package;