
import axios from 'axios';
/**
 *
 * @export
 * @param {any} url
 * @param {any} option
 * @param {any} [callBack={errorCallBack,successCallBack}]
 */
export default function (url, option, callBack = {}) {
    const { errorCallBack = () => { }, successCallBack = () => { } } = callBack;
    axios.post(url, {
        ...option.body,
    }).then(res => {
        if (!!res && res.code === 0 && res.data) {
            typeof (successCallBack) === 'function' && successCallBack(res);
        } else {
            throw new Error(res ? res.msg : 'res为空');
        }
    }).catch(err => {
        typeof (errorCallBack) === 'function' && errorCallBack();
    });
};
