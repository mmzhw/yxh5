let wxShare = function(name, intro, image) {
    var oReq = new XMLHttpRequest();

    oReq.onload = (e) => {
        if (oReq.status !== 200) return;
        var data = oReq.response;
        if (data) {
      /* global wx:true */
            data = JSON.parse(data);
            wx.config({
        // debug: true,
                appId: 'wxc89ca66545c2df54',
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
            });
      // let url = window.location.href
        }

        wx.ready(() => {
            wx.onMenuShareAppMessage({
                title: name,
                desc: intro.substring(0, 30),
                imgUrl: image,
        // link: url
            });
            wx.onMenuShareTimeline({
                title: name,
                imgUrl: image,
        // link: url
            });
            wx.onMenuShareQQ({
                title: name,
                desc: intro.substring(0, 30),
                imgUrl: image,
            });
        });
    };
    oReq.open('POST', '/wechat/get_params');
    oReq.send();
};

export { wxShare };
