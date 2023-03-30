const { log } = require('@heyday-cli/utils');
const commander = require('commander'); // 脚手架
const program = new commander.Command();

const { _optionValues: optionValues } = program;

function registerCommand(pkg) {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version);

    program
        .option('-d, --debug', '是否启动调试模式', false);

    // 调试模式监听
    program.on('option:debug', function() {
        if (optionValues.debug) {
            process.env.LOG_LEVEL = 'verbose';
        } else {
            process.env.LOG_LEVEL = 'info';
        }
        log.level = process.env.LOG_LEVEL;
    });

    // 未知命令兼容
    program.on('command:*', function(obj){
        const availableCommands = program.commands;
        log.error('未知命令：', obj.join(','));
        if (availableCommands.length) {
            log.info('可用命令：', availableCommands);
        }
    });

    // 未输入命令自动打印帮助文档
    if (process.argv.length < 3) {
        program.outputHelp();
        console.log()
    }

    // 解析命令参数
    program.parse(process.argv);
}

module.exports = registerCommand;