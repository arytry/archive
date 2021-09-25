

/**

* string比较工具类

*/

export const str = {

    contains: function (string: string, substr: string, isIgnoreCase: boolean) {

        if (isIgnoreCase) {

            string = string.toLowerCase();

            substr = substr.toLowerCase();

        }



        var startChar = substr.substring(0, 1);

        var strLen = substr.length;



        for (var j = 0; j < string.length - strLen + 1; j++) {

            if (string.charAt(j) == startChar) {

                //如果匹配起始字符,开始查找

                if (string.substring(j, j + strLen) == substr) {

                    //如果从j开始的字符与str匹配，那ok

                    return true;

                }

            }

        }

        return false;

    }

};
