import CryptoJS from 'crypto-js'
import CryptoU8array from './enc-u8array'
import { Message } from 'element-ui'
import store from '@/store'

let urlToBuffer = (url) => {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          resolve(url)
        }
      }
    }
    xhr.onerror = function() {
      resolve(url)
    }
    xhr.send()
  })
}


let chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

let generateMixed = (n) => {
     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*62);
         res += chars[id];
     }
     let word = Date.now() + res
     let md5 = CryptoJS.MD5(word).toString()
     return md5.slice(0, 6)
}

export default {
    //加密
    encrypt: (dataImg) => {
        return new Promise((resolve, reject) => {
            if (!dataImg) {
                Message({
                  message: '请传入图片文件流',
                  type: 'warning',
                  duration: 3 * 1000
                })
                return
            }
            if (!store.getters.dataDesKey.desKey || !store.getters.dataDesKey.desIv) {
                Message({
                    message: '缺少必要的key或iv',
                    type: 'warning',
                    duration: 3 * 1000
                  })
                  return
            }
            try {
                let reader = new FileReader()
                reader.onload = function(e) {
                    var buf = new Uint8Array(e.target.result);
                    let contentWA = CryptoU8array.u8array.parse(buf)
                    let keyHex = CryptoJS.enc.Utf8.parse(store.getters.dataDesKey.desKey);
                    let ivHex = CryptoJS.enc.Utf8.parse(store.getters.dataDesKey.desIv);
                    let encrypted = CryptoJS.TripleDES.encrypt(contentWA, keyHex, {
                        iv: ivHex,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    })
                    let baseStr = encrypted.toString()
                    let arrStr = dataImg.name.split('.')
                    let newName = generateMixed(6) + '.' + arrStr[1]
                    let blob = new Blob ([baseStr], {type: dataImg.type})
                    let file = new window.File([blob], newName, { type: dataImg.type } )
                    resolve(file)
                }
                reader.readAsArrayBuffer(dataImg)
            } catch(err) {
                resolve(dataImg)
            }
        })
    },
    //解密
    decrypt: (url) => {
        return new Promise(async (resolve, reject) => {
            if (!url) {
                resolve('')
                return
            }
            if (!store.getters.dataDesKey.desKey || !store.getters.dataDesKey.desIv) {
                Message({
                    message: '缺少必要的key或iv',
                    type: 'warning',
                    duration: 3 * 1000
                  })
                  return
            }
            try {
                let imgBlob = await urlToBuffer(url)
                let reader = new FileReader()
                reader.onload = function(e) {
                    try {
                      let keyHex = CryptoJS.enc.Utf8.parse(store.getters.dataDesKey.desKey);
                      let ivHex = CryptoJS.enc.Utf8.parse(store.getters.dataDesKey.desIv);
                      let decrypted = CryptoJS.TripleDES.decrypt(e.target.result, keyHex, {
                          iv: ivHex,
                          mode: CryptoJS.mode.CBC,
                          padding: CryptoJS.pad.Pkcs7
                      });
                      let src = 'data:image/png' + ';base64,' + decrypted.toString(CryptoJS.enc.Base64)
                      resolve(src)
                    } catch {
                      resolve(url)
                    }
                }
                reader.readAsText(imgBlob, 'utf8')
            } catch (err) {
                resolve(url)
            }
        })
    }
}