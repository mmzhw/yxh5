// 测试
// let baseUrl = 'http://39.106.119.206:8081';
// 苏州接口
// let baseUrl = 'http://10.100.107.110:8081/'
// 线上ip接口
// let baseUrl = 'https://dxapi.youxiang0210.com';
let baseUrl = 'http://daxiangapi.youxiang0210.com';
let imageUrl = 'https://image.youxiang0210.com/';
let videoUrl = 'https://video.youxiang0210.com/';
let downloadPageUrl = 'https://m.youxiang0210.com/download';

if (process.env.NODE_ENV === 'production') {
    // baseUrl = 'https://dxapi.youxiang0210.com';
    baseUrl = 'http://daxiangapi.youxiang0210.com';
}
if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://test.dxapi.youxiang0210.com';
    imageUrl = 'https://image.youxiang0210.com/';
}
function getQuery(name, url) {
    let reg, ret, query;
    let search = '';
    if (!url) {
        search = window.location.search.substr(1);
    } else {
        search = url.substr(1);
    }
    if (name) {
        reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        query = search.match(reg);
        return query !== null ? decodeURIComponent(query[2]) : null;
    }
    reg = new RegExp(/(^|&)(\w+)=([\w]*)/, 'g');
    query = search.match(reg);
    ret = {};
    query.forEach(v => {
        let arr = v.split('=');
        if (arr[0].indexOf('&') > -1) arr[0] = arr[0].slice(1);
        ret[arr[0]] = decodeURIComponent(arr[1]);
    });
    return ret;
}

/**
 * @desc 处理单位  例如下列
    1 0<=数量<10000：直接显示具体数字，如9878显示为”9878“
    2、数量>=10000：保留1位小数，以w为单位，四舍五入，如28900显示为“2.9w"
    @props
 * @param {<{level,unit}>[]} standardUnit 单位标准
 * @param {number} data 要加单位的数字
 * @param {number} decimal 要保留几位小数，默认1
 * @returns {string || number} 带单位的数字
 * @example getUnit([{level:10,unit:'十'}],88) //8.8十
 */
function getUnit(standardUnit = [], data, decimal = 1) {
    if (standardUnit instanceof Array && typeof (data) === 'number') {
        /* 倒叙，为啥倒叙，你难道不想思考一下么？答案在下面 */
        for (let i = standardUnit.length - 1; i >= 0; i--) {
            const item = standardUnit[i];
            if (item.level && item.unit) {
                /* 倒叙好处就是不用在判断要小于前一个，因为如果大于前一个，已经在之前就return 了 */
                if (data >= item.level) {
                    return (data / (item.level === 0 ? 1 : item.level)).toFixed(decimal) + item.unit;
                }
            }
        }
    }
    return data;
}
/* 把1 改成01 11=11 */
function addZero(num) {
    if (typeof (num) === 'number') {
        return num < 10 ? ('0' + num) : '' + num;
    }
    return num;
}
/**
 * @desc 转换秒 3666 => 01:06:60
 * @param second
 * @param {number} seconds 要转换的秒
 * @param {string} decimal = 'hh:mm:ss' 要保留几位小数，默认1
 * @returns {string || number} hh:mm:sss 格式的
 */
function transformSecondToTime(second) {
    let ss = addZero(second % 60);
    let mm = addZero((parseInt(second / 60) % 60));
    let hh = addZero(parseInt(second / 360) % 360);

    return hh + ':' + mm + ':' + ss;
}

/**
 * @desc 转换param 类似jq 的parseParam 方法
 * @param {object} param 转成的对象
 * @returns aa=11&bb=22 这样的urlparam
 */
function paramParse(param = null) {
    if (!param || typeof (param) !== 'object') {
        return '';
    }
    let paramArr = [];

    for (const key of Object.keys(param)) {
        paramArr.push(`${key}=${param[key]}`);
    }

    // console.log('sdsa', !param || typeof (param) !== 'object');

    return (paramArr.length ? '?' : '') + paramArr.join('&');
}
/**
 * @desc 计算星座
 * @param {any} month 月
 * @param {any} day 天
 * @returns
 */
const getAstro = (birthday) => {
    if (!birthday) {
        return '';
    }
    let birthdayArr = birthday.split('-');

    if (!birthdayArr instanceof Array && birthdayArr.length < 3) {
        return '';
    }
    let year = birthdayArr[0] + '';
    let month = birthdayArr[1];
    let day = birthdayArr[2];

    let y = Math.floor((year.substr(year.length - 2, 2) / 5)) * 5;
    y = (y < 10 ? '0' : '') + y;
    let s = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
    let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return y + '后 ' + s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + '座';
};

export { baseUrl, imageUrl, videoUrl, downloadPageUrl, getQuery, getUnit, transformSecondToTime, paramParse, getAstro };
