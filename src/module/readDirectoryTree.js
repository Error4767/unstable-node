import fs from 'fs';
import pathPlus from './pathPlus.js';
export default function readDirectoryTree(directory) {
  return fs.promises.stat(directory).then(stat => {
    if (stat.isDirectory()) {
      return fs.promises.readdir(directory).then(files => {
        return Promise.allSettled(files.map(v => readDirectoryTree(pathPlus.joinRelativePath(directory, v))));
      }).then(r => {
        const dirInfo = r.map(v => {
          if (v.status === 'fulfilled') {
            return v.value;
          } else if (v.status === 'rejected') {
            return {
              type: 'error',
              error: v.reason
            };
          }
        });
        let fileNumber = 0;
        let folderNumber = 0;
        let size = 0;
        dirInfo.forEach((node) => {
          size += node.stat.size;
          if (node.type === 'file') {
            fileNumber += 1;
          } else if (node.type === 'directory') {
            fileNumber += node.stat.fileNumber || 0;
            // 加1是包括了此文件夹本身
            folderNumber += (node.stat.folderNumber || 0) + 1;
          }
        }, 0);
        return {
          type: 'directory',
          directory,
          children: dirInfo,
          stat: {
            fileNumber,
            folderNumber,
            size
          }
        };
      });
    } else {
      return {
        stat,
        type: 'file',
        file: directory
      };
    }
  })
}