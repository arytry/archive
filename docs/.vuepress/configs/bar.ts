import type { SidebarConfig, NavbarConfig } from '@vuepress/theme-default'
import path from "path";

import { file } from "./file"
import { json } from "./json"

const rootpath = path.dirname(path.dirname(__dirname));


export const bar = {

    /**
     * 动态获取菜单栏
     * @returns SidebarConfig
     */
    navbar: function (): NavbarConfig {

        var navbar = [];

        var allDirs = file.getAllDirs(rootpath);

        allDirs.forEach(item => {

            let dirFiles = file.getAllFiles(item);

            // if (dirFiles.length > 0)
             {

                //多层目录需要替换\为/
                let dirname = item.replace(rootpath, "").replace(/^\\/g, "/");

                const node = '/' + dirname.split('/').filter(m => m.length > 0)[0] + '/'

                let virtualDir = dirname.replace(/^\/|\/$/g, "");

                let text = json[virtualDir] ?? virtualDir;

                let navbarItem = navbar.find(m => m.node === node);

                if (navbarItem === undefined) {

                    navbarItem = {
                        node: node,
                        text: text,
                        children: dirFiles.map(m => dirname + m
                        )
                    };

                    navbar.push(navbarItem);

                }

                else {

                    let navbarGroup = {
                        text: text,
                        children: dirFiles.map(m => dirname + m)
                    }

                    navbarItem.children.push(navbarGroup);

                }
            }
        });

        return navbar;
    },


    /**
     * 动态获取侧边栏
     * @returns SidebarConfig
     */
    sidebar: function (): SidebarConfig {

        var sidebars = {};

        var allDirs = file.getAllDirs(rootpath);

        allDirs.forEach(item => {

            let dirFiles = file.getAllFiles(item);

            if (dirFiles.length > 0) {

                //多层目录需要替换\为/
                let dirname = item.replace(rootpath, "").replace(/^\\/g, "/");

                const node = '/' + dirname.split('/').filter(m => m.length > 0)[0] + '/'

                let text = json[dirname.replace(/^\/|\/$/g, "")] ?? dirname.replace(/^\/|\/$/g, "");

                let sidebarItem = {
                    isGroup: true,
                    text: text,
                    children: dirFiles.map(m => dirname + m)
                }

                if (node in sidebars) {
                    sidebars[node].push(sidebarItem)
                }
                else {
                    let sidebarItems = [sidebarItem]

                    sidebars[node] = sidebarItems;
                }
            }
        });

        return sidebars;
    }
}