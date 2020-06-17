import path from 'path';
const path2 = Object.assign(path, {
  joinRalativePath(...files) {
    return path.join(...files).replace(/[\\\/]/g,'/');
  }
});
export default path2;