// 引入包信息
const { name, version, description } = require('../package.json');

// 导入 Git Short Head 信息
import {gitShoreHead} from "./git-shore-head";

export const product = {
    name,
    description,
    version: `${version}.${gitShoreHead}`
}