import fs from 'fs';
import path from 'path';
import PA from './PA.js';
async function createDirectory (directory){
  //如果目录无效默认为根目录，返回true，目录存在
  if(!directory) {
    return true;
  }
  //判断目录是否存在
  const [err, stat] = await PA(fs.promises.stat(directory));
  if(stat && stat.isDirectory()) {
    return true;
  }
  const parentDirectory = path.parse(directory).dir;
  //递归创建目录
  const status = await createDirectory(parentDirectory);
  if(status) {
    const [err, res] = await PA(fs.promises.mkdir(directory));
    if(err) {
      return false;
    }else {
      return true;
    }
  }else {
    return false;
  }
}
const extendsFunctions = {
  createDirectory
}
const fsPlus = Object.assign(fs, extendsFunctions);
export default fsPlus;