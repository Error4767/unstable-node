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

async function removeFile (file){
  const [err, stat] = await PA(fs.promises.stat(file));
  if(err) {
    //没有信息默认无目录或文件，返回true
    return true;
  }
  if(stat.isFile()) {
    const [err] = await PA(fs.promises.unlink(file));
    if(!err) {
      return true;
    }else {
      return false;
    }
  }else if(stat.isDirectory()) {
    const [err, filelist] = await PA(fs.promises.readdir(file));
    if(err) {
      //没有信息默认无目录或文件，返回true
      return true;
    }
    //遍历递归删除文件
    if(filelist.length > 0) {
      const [e] = await PA(Promise.all(filelist.map(v=> removeFile(path.join(file ,v)))));
      if(e) {
        return false;
      }
    }
    //删除目录
    const [rmdirErr] = await PA(fs.promises.rmdir(file));
    if(rmdirErr) {
      return false;
    }
    return true;
  }
}
const extendsFunctions = {
  createDirectory,
  removeFile
}
const fsPlus = Object.assign(fs, extendsFunctions);
export default fsPlus;