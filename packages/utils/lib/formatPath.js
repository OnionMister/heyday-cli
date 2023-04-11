const path = require('path');

// 统一处理路径分隔为'/'
module.exports = function (p) {
    if (p && typeof p === 'string') {
        const sep = path.sep; // 获取路径分隔符
        if (sep !== '/') { // win的分隔符尾"\"，moc为"/"
            return p.replace(/\\/g, '/');
        }
    }
    return p;
}
