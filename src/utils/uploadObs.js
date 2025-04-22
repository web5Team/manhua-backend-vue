import store from '@/store'
import axios from 'axios'
import { getSignature } from '@/api/cartoon'

async function getSignatureFun(params) {
    let { data } = await getSignature(params)
    return data
}

let baseURL = store.getters.dataDesKey.obs.domain

async function uploadOBS(file, imagePath, callback) {
    let data = await getSignatureFun({ imagePath, types: 1 })
    let formdata = new FormData()
    formdata.append('policy', data.policy)
    formdata.append('signature', data.signature)
    formdata.append('key', imagePath)
    formdata.append('AccessKeyId', store.getters.dataDesKey.obs.accessKeyId)
    formdata.append('file', file)
    try {
        await axios({
            url: baseURL,
            method: 'post',
            data: formdata,
            onUploadProgress(event) {
                if (callback) {
                    callback(event)
                }
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return baseURL + '/' + imagePath
    } catch (err) {
        return ''
    }
}

async function deleteOBS(imagePath) {
    let data = await getSignatureFun({ imagePath, types: 2 })
    try {
        await axios({
            url: data.signedUrl,
            method: 'delete'
        })
        return 'success'
    } catch (err) {
        return 'error'
    }
}

export let uploadOBSFun = uploadOBS
export let deleteOBSFun = deleteOBS