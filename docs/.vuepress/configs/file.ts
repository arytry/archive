import fs from "fs";
import path from "path";
import { str } from "./string"

/**

* 文件助手: 主要用于读取当前文件下的所有目录和文件

*/

export const file = {

    getAllFiles: function (rpath: fs.PathLike) {

        let fileinfos = [];

        fs.readdirSync(rpath).forEach(file => {

            const fullpath = rpath + "/" + file;

            var stats = fs.statSync(fullpath);

            // 过滤 .DS_Store

            if (stats.isFile() && !str.contains(file, "DS_Store", true)) {

                fileinfos.push({ createTime: stats.ctime, filename: file });

            }

        });

        let filenames = fileinfos.sort(function (a, b) {

            if (a.filename.toLowerCase() === "readme.md")
                return -1;

            if (b.filename.toLowerCase() === "readme.md")
                return 1;

            if (a.createTime < b.createTime)
                return -1;

            if (a.createTime > b.createTime)
                return 1;

            return 0;

        }).map(m => {

            if (m.filename.toLowerCase() === "readme.md")

                m.filename = "";

            else

                m.filename = m.filename.replace(".md", ".html");

            return m.filename

        });

        return filenames;

    },

    getAllDirs: function getAllDirs(mypath = ".") {

        const items = fs.readdirSync(mypath);

        let result = [];

        // 遍历当前目录中所有文件夹

        items.map(item => {

            let temp = path.join(mypath, item);

            // 过滤无关的文件夹

            if (

                fs.statSync(temp).isDirectory() &&

                !item.startsWith(".") &&

                !str.contains(item, "DS_Store", true)

            ) {

                let path = mypath + "/" + item + "/";

                result.push(path);

                result = result.concat(getAllDirs(temp));

            }

        });

        return result;

    }

};