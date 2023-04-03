const { log } = require('@heyday-cli/utils');
const init = require('@heyday-cli/init');
const commander = require('commander'); // 脚手架
const program = new commander.Command();


function registerCommand(pkg) {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否启动调试模式', false);

    // 初始化新项目
    program
        .command('init [projectName]')
        .option('-f, --force', '强制覆盖当前路径文件（谨慎使用）', false)
        .action(init);
        
    const optionValues = program.opts();
        
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
    program.on('command:*', function(cmd){
        const availableCommands = program.commands;
        log.error('未知命令：', cmd.join(','));
        if (availableCommands.length) {
            log.info('可用命令：', availableCommands);
        }
    });
    // 解析命令参数
    program.parse(process.argv);
    // 未输入命令自动打印帮助文档
    if (process.argv.length < 3) {
        program.outputHelp();
        console.log()
    }
}
    
module.exports = registerCommand;