import fs from 'fs';
import pathPlus from './pathPlus.js';
export default function readDirectoryTree(directory) {
  return fs.promises.stat(directory).then(stat=> {
    if (stat.isDirectory()) {
      return fs.promises.readdir(directory).then(files=> {
        return Promise.allSettled(files.map(v=>readDirectoryTree(pathPlus.joinRalativePath(directory, v))));
      }).then(r=> {
        const dirInfo = r.map(v=> {
          if(v.status === 'fulfilled') {
            return v.value;
          }else if(v.status === 'rejected'){
            return {
              type: 'error',
              error: v.reason
            };
          }
        });
        dirInfo.type = 'directory';
        dirInfo.directory = directory;
        return dirInfo;
      })
    } else {
      return {
        stat,
        type: 'file',
        file: directory
      };
    }
  })
}