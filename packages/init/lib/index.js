'use strict';
const fs = require('fs');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const semver = require('semver');
const { Command, log } = require('@heyday-cli/utils');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    this.force = this._options.force;
    log.verbose(`projectName: ${this.projectName}`);
    log.verbose(`force: ${this.force}`);
  }

  async exec() {
    try {
      const res = await this.prepare();
      console.log('res', res);
    } catch (error) {
      log.error(error.message);
    }
  }

  async prepare() {
    const localPath = process.cwd();
    if (!this.isEmptyDir(localPath)) {
      let ifContinue = false;
      if (!this.force) {
        ifContinue = (await inquirer.prompt({
          type: 'confirm',
          name: 'ifContinue',
          default: false,
          message: '当前目录不为空，是否继续创建项目？'
        })).ifContinue;
        if (!ifContinue) {
          return;
        }
      }
      if (ifContinue || this.force) {
        // 二次确认清空
        const { confirmDel } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDel',
          default: false,
          message: `是否清空项目创建目录「${localPath}」（不清空也能继续创建）？`
        });
        // 清空当前目录
        if (confirmDel) {
          fse.emptyDirSync(localPath);
        }
      }
    }
    return this.getProjectInfo();
  }

  async getProjectInfo() {
    const projectInfo = {};
    const { type } = await inquirer.prompt({
      type: 'list',
      message: '请选择初始化类型：',
      name: 'type',
      default: TYPE_PROJECT,
      choices: [
        { name: '项目', value: TYPE_PROJECT },
        { name: '组件', value: TYPE_COMPONENT },
      ]
    });
    log.verbose('type: ', type);
    if (type === TYPE_PROJECT) {
      const o = await inquirer.prompt([{
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称：',
        validate: function(v) {
          // 异步执行
          const done = this.async();
          // 异步事件
          setTimeout(function() {
            if (!/^[a-zA-Z]+([-|_]*[a-zA-Z0-9]+)*$/.test(v)) {
              done('规则：可由“字母、数字、_、-”组成，开头必须为字母，结尾可为字母或数字');
              return;
            }
            done(null, true);
          }, 0);
        },
        filter: function(v) {
          return v;
        }
      }, {
        type: 'input',
        name: 'projectVersion',
        message: '请输入项目版本号：',
        validate: function(v) {
          // 异步执行
          const done = this.async();
          // 异步事件
          setTimeout(function() {
            if (!semver.valid(v)) {
              done('形如：v1.0.0或1.0.0');
              return;
            }
            return done(null, true);
          }, 0);
        },
        filter: function(v) {
          if (semver.valid(v)) {
            return semver.valid(v);
          }
          return v;
        }
      }]);
      console.log('o', o)
    }

    return projectInfo;
  }

  isEmptyDir(localPath) {
    const fileList = fs.readdirSync(localPath).filter(file => (
      !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
    ));
    return !fileList || fileList.length <= 0;
  }
};

function init(argv) {
  // console.log('projectName, opts: ', projectName, opts, command.opts(), command.optsWithGlobals());
  return new InitCommand(argv);
}


module.exports = init;
module.exports.InitCommand = InitCommand;