import fs from 'fs';
import path from 'path';
export default function readDirectoryTree(directory) {
  return fs.promises.stat(directory).then(stat=> {
    if (stat.isDirectory()) {
      return fs.promises.readdir(directory).then(files=> {
        console.log(files);
        return Promise.allSettled(files.map(v=>readDirectoryTree(path.resolve(directory, v))));
      }).then(r=> {
        const dirInfo = r.map(v=> {
          if(v.status === 'fulfilled') {
            return v.value;
          }else if(v.status === 'rejected'){
            return v.reason;
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