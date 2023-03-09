const axios = require('axios');
const semver = require('semver'); // 版本号比较
const urlJoin = require('url-join'); // url拼接

// 获取默认源
function getDefaultRegistry(isOrigin = false) {
    // 淘宝源可能会重定向到https://registry.npmmirror.com/
    return isOrigin? 'https://registry.npmjs.org/' : 'https://registry.npm.taobao.org';
}

// 获取包信息
function getNpmInfo(npmName, registry) {
    if (!npmName) {
        return null;
    }
    const newRegistry = registry || getDefaultRegistry();
    const npmAPIUrl = urlJoin(newRegistry, npmName);
    return axios.get(npmAPIUrl).then(res => {
        if (res.status === 200) {
            return res.data;
        }
    }).catch(err => {
        return Promise.reject(err);
    });
}

// 获取包的所有版本
async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry);
    if (data) {
        return Object.keys(data.versions);
    } else {
        return [];
    }
}

// 获取大于当前版本的版本号并降序排列
function getSemverVersions(curVer, versions) {
    return versions
                .filter(v => semver.gt(v, curVer))
                .sort((a, b) => semver.gt(a, b) ? -1 : 1);
}

// 获取最新版本
async function getLatestVersion(npmName, npmVersion, registry) {
    const versions = await getNpmVersions(npmName, registry);
    const highVersions = getSemverVersions(npmVersion, versions);
    if (highVersions && highVersions.length > 0) {
        return highVersions[0];
    }
}
module.exports = {
    getNpmInfo,
    getNpmVersions,
    getLatestVersion
}