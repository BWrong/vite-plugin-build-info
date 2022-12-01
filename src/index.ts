import fs from 'fs';
import { exec } from 'child_process';
import type { Plugin, IndexHtmlTransformResult } from 'vite';

// const COMMITHASH_COMMAND = 'rev-parse HEAD';
const COMMITSHOTHASH_COMMAND = 'rev-parse --short HEAD';
const DESCRIBE_COMMAND = 'describe --always';
const BRANCH_COMMAND = 'rev-parse --abbrev-ref HEAD';
const USERNAME = 'config user.name';

const execGitCommond = (commond: string) => {
  if (!commond) return Promise.resolve('');
  const sh = 'git ' + commond;
  return new Promise((resolve, reject) => {
    exec(sh, (error, stdout) => (error ? reject(error) : resolve(stdout.toString()?.replace('\n', ''))));
  });
};
const getGitInfo = async () => {
  const commitHash = await execGitCommond(COMMITSHOTHASH_COMMAND);
  const describe = await execGitCommond(DESCRIBE_COMMAND);
  const branch = await execGitCommond(BRANCH_COMMAND);
  const username = await execGitCommond(USERNAME);
  return {
    commitHash,
    describe,
    branch,
    username
  };
};
const getAppInfo = () => {
  const pkg: any = fs.readFileSync(process.cwd() + '/package.json', 'utf-8');
  const { name, version } = JSON.parse(pkg);
  const buildTime = formatDate();
  return {
    name,
    version,
    buildTime
  };
};
interface Options {
  showBuildUser?: boolean;
  enableMeta?: boolean;
  enableLog?: boolean;
  enableGlobal?: boolean;
}
export default (option?: Options): Plugin => {
  const { showBuildUser = false, enableMeta = true, enableLog = false, enableGlobal = false } = option || {};
  return {
    name: 'vite-plugin-version',
    async transformIndexHtml() {
      const els: IndexHtmlTransformResult = [];
      const appInfo = getAppInfo();
      let info: any = {
        ...appInfo
      };
      try {
        const gitInfo = await getGitInfo();
        info.commitHash = gitInfo.commitHash;
        info.describe = gitInfo.describe;
        info.branch = gitInfo.branch;
        showBuildUser && (info.buildUser = gitInfo.username);
      } catch (error) {}
      let appInfoText = JSON.stringify(info);
      appInfoText = appInfoText.replace(/"/g, "'");
      enableMeta &&
        els.push({
          tag: 'meta',
          injectTo: 'head-prepend',
          attrs: {
            name: 'app-info',
            content: appInfoText
          }
        });
      enableLog &&
        els.push({
          tag: 'script',
          injectTo: 'body',
          children: `console.log(${appInfoText})`
        });
      enableGlobal &&
        els.push({
          tag: 'script',
          injectTo: 'body',
          children: `__APP_INFO__ = ${appInfoText}`
        });
      return els;
    }
  };
};
function formatDate(value = Date.now(), format = 'Y-M-D h:m:s') {
  const formatNumber = (n: number) => `0${n}`.slice(-2);
  const date = new Date(value);
  const formatList = ['Y', 'M', 'D', 'h', 'm', 's'];
  const resultList:string[] = [];
  resultList.push(date.getFullYear().toString());
  resultList.push(formatNumber(date.getMonth() + 1));
  resultList.push(formatNumber(date.getDate()));
  resultList.push(formatNumber(date.getHours()));
  resultList.push(formatNumber(date.getMinutes()));
  resultList.push(formatNumber(date.getSeconds()));
  for (let i = 0; i < resultList.length; i++) {
    format = format.replace(formatList[i], resultList[i]);
  }
  return format;
}
