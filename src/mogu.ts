/// <reference path="mogu.d.ts" />
import { AES, enc, lib, pad, mode, SHA1, MD5 } from 'crypto-js'
import Hls from 'hls.js'

const baseUrl = 'https://api.koudailc.net'

/** 获取视频信息 */
export const getVideoInfo = async (videoId: number | string) => {
    const params = new URLSearchParams([['id', videoId.toString()]]).toString()
    const data = await fetch(baseUrl + '/api/vod/info?' + params).then(res => res.json())
    return data.data as VideoInfo
}

/** 获取视频 M3U8 字符串 */
export const getHlsText = async (videoUrl: string, videoId: number | string) => {
    const data = await fetch(videoUrl).then(res => res.arrayBuffer())
    const encrypted = lib.WordArray.create(data)
    const aesConfig = getAESConfig(videoId)
    const decrypted = AES.decrypt(<lib.CipherParams>{ ciphertext: encrypted }, aesConfig.key, {
        iv: aesConfig.iv,
        padding: pad.Pkcs7,
        mode: mode.CBC
    })
    return decrypted.toString(enc.Utf8)
}

/** 解密视频地址并返回可播放的 Hls URL */
export const parseHlsURL = async (videoUrl: string, videoId: number | string) => {
    const hlsText = await getHlsText(videoUrl, videoId)
    const blob = new Blob([hlsText], { type: 'text/plain' })
    return URL.createObjectURL(blob)
}

/** 获取 AES 配置信息 */
export const getAESConfig = (videoId: number | string) => {
    const hash = MD5(SHA1(videoId.toString()).toString(enc.Hex))
    return { key: hash, iv: hash }
}

/** 将视频载入到视频元素 */
export const loadVideo = async (videoId: number | string, element: HTMLMediaElement) => {
    const hls = new Hls()
    const videoInfo = await getVideoInfo(videoId)
    const hlsUrl = await parseHlsURL(videoInfo.play_url, videoInfo.id)
    hls.loadSource(hlsUrl)
    hls.attachMedia(element)
}

/**
 * 获取视频搜索结果
 * @param keyword 搜索关键词
 * @param page 页码，起始值为 1
 * @param pageSize 返回记录条数，最大值为 20
 * @returns 搜索结果
 */
export const getVideoSearchResult = async (keyword: string, page = 1, pageSize = 20) => {
    const params = new URLSearchParams([['limit', pageSize.toString()], ['page', page.toString()], ['wd', keyword]]).toString()
    const data = await fetch(baseUrl + '/api/vod/clever?' + params).then(res => res.json())
    return data.data.list as VideoListItem[]
}

/** 获取所有的标签 */
export const getAllLabels = async () => {
    const data = await fetch(baseUrl + '/api/vodlabel/all').then(res => res.json())
    return data.data.list as { id: number, name: string }[]
}

/** 获取视频分类菜单 */
export const getVideoTypeMenu = async () => {
    const data = await fetch(baseUrl + '/api/vod/type').then(res => res.json())
    return data.data.list as VideoTypeMenu
}

/**
 * 获取分类视频列表
 * @param typeIds 分类 ID 列表
 * @param options 配置项
 * @returns 视频列表
 */
export const getVideoListByType = async (typeIds: number[], options: {
    /** 页码，起始值为 1 */
    page?: number
    /** 返回记录条数，最大值为 20 */
    pageSize?: number
    /** 排序方式，`stat` 表示最多收藏，`view` 表示最多播放，`id` 表示最新发布 */
    order?: 'stat' | 'view' | 'id'
} = {}) => {
    const params = new URLSearchParams([
        ['types', typeIds.join(',')],
        ['limit', (options.pageSize ?? 20).toString()],
        ['page', (options.page || 1).toString()],
        ['order', '-' + (options.order || 'id')],
    ]).toString()
    const data = await fetch(baseUrl + '/api/vod/list?' + params).then(res => res.json())
    return data.data.list as VideoListItem[]
}

/** 下载文件 */
export const downloadFile = (objectURL: string, filename: string) => {
    const link = document.createElement('a')
    link.href = objectURL
    link.download = filename
    link.click()
    link.remove()
}

/** 获取图片的 Base64 格式 src  */
export const getImageBase64Src = async (imageUrl: string) => {
    const data = await fetch(imageUrl).then(res => res.arrayBuffer())
    const encrypted = lib.WordArray.create(data)
    const imageId = imageUrl.match(/([^/]+)\.[^/]$/)![1]
    const key = MD5(imageId)
    const iv = key
    const decrypted = AES.decrypt(<lib.CipherParams>{ ciphertext: encrypted }, key, {
        iv,
        padding: pad.Pkcs7,
        mode: mode.CBC
    })
    return 'data:image/jpeg;base64,' + decrypted.toString(enc.Base64)
}