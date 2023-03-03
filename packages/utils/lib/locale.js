module.exports = locale;

function locale(env) {
  env = env || process.env;
  // 获取语言， 形如：zh_CN.UTF-8
  const language = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
  if (language && language.toLocaleLowerCase().includes('zh_cn')) {
    return '欢迎使用heyday脚手架'
  } else {
    return 'Welcome using heyday-cli'
  }
}