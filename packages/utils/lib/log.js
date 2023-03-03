const log = require('npmlog');

// log的默认权重为info，权重低于他的不会打印，如果我们要开启调试模式，会挂调试变量到环境变量上
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';

// 增加自定义头部
log.heading = 'heyday';
log.headingStyle = { fg: 'black', bg: 'white', bold: true };

// 新增一种消息类型
log.addLevel('success', 2000, { fg: 'green', bold: true });

module.exports = log;
