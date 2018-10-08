import { downloadPageUrl, paramParse } from './index.js';

/* 打开某个 url 并跳转到下载页面 */
/**
 * @name openAppAndToDownloadPage
 * @param {string} appurl 跳转到app 的url( 百度关键词:schemeUrl )
 * @param {function} unsuccessfulCallback 跳转不成功的回调
 */
function openAppAndToDownloadPage(appurl, unsuccessfulCallback) {
    const delay = 3000;
    if (appurl) {
        // alert('appurl: ' + appurl);
        // window.open(appurl);
        // console.log('location', location);
        // console.log('windowlocation', location, window.location);
        location.href = appurl;
    }
    // const ua = navigator.userAgent;
    const now = Date.now();
    /* 判断isIOS */
    // let isIOS = !!(/iPhone/i.test(ua));
    unsuccessfulCallback = typeof (unsuccessfulCallback) !== 'function' ? () => {
        /* 为了避免safari 中弹出哪个对话框.这样是不阻止 js 运行的. */
        if (Date.now() - now < 3010) {
            /* if 不是ios else是 ios 去苹果商店 */
            location.href = downloadPageUrl;
            // if (!isIOS) {
            //     location.href = 'http://dx-downloads-test.itangchao.me/daxiang-live-A_OFFICAL-release.apk';
            // } else {
            //     location.href = 'https://itunes.apple.com/us/app/id1235011792?l=zh&ls=1&mt=8';
            // }
        }
    } : unsuccessfulCallback;
    setTimeout(unsuccessfulCallback, delay);
};

let jump = {
    gotoDownload() {
        location.href = 'jcgroup://youxiang.com/go?action=home';
        const now = Date.now();
        setTimeout(() => {
            if (Date.now() - now < 1510) {
                location.href = downloadPageUrl;
            }
        }, 1500);
    },
    linkAppVideo(baseId, detailId) {
        location.href = 'jcgroup://youxiang.com/go?action=videoPlay&videoId=' + baseId + '&videoDetailId=' + detailId;
        const now = Date.now();
        setTimeout(() => {
            if (Date.now() - now < 1510) {
                location.href = downloadPageUrl;
            }
        }, 1500);
    },

    /* 打开 提示在浏览器页面打开 的这个页面 */
    openBrowserToAppOrDownload(param) {
        const ua = navigator.userAgent;
        /* 是否是微信 或者 微博*/
        if (/MicroMessenger/i.test(ua) || /WeiBo/i.test(ua)) {
            // if (/iPhone/i.test(ua)) {
            //     this.isIOS = true;
            // } else {
            //     this.isIOS = false;
            // }
            // location.href = location.origin + '/browserOpen?shortVideoId=' + this.$route.params.videoId;
            location.href = `${location.origin}/browserOpen${paramParse(param)}`;
        } else {
            openAppAndToDownloadPage(`jcgroup://youxiang.com/go${paramParse(param)}`);
            // location.href = `jcgroup://youxiang.com/go${paramParse(param)}`;
        }
    },

    openAppAndToDownloadPage,
};

export { jump };
