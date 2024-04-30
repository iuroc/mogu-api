import { AES, enc, lib, pad, mode, SHA1, MD5 } from 'crypto-js';
import Hls from 'hls.js';
const baseUrl = 'https://api.koudailc.net';
export const getVideoInfo = async (videoId) => {
    const params = new URLSearchParams([['id', videoId.toString()]]).toString();
    const data = await fetch(baseUrl + '/api/vod/info?' + params).then(res => res.json());
    return data.data;
};
export const getHlsText = async (videoUrl, videoId) => {
    const data = await fetch(videoUrl).then(res => res.arrayBuffer());
    const encrypted = lib.WordArray.create(data);
    const aesConfig = getAESConfig(videoId);
    const decrypted = AES.decrypt({ ciphertext: encrypted }, aesConfig.key, {
        iv: aesConfig.iv,
        padding: pad.Pkcs7,
        mode: mode.CBC
    });
    return decrypted.toString(enc.Utf8);
};
export const parseHlsURL = async (videoUrl, videoId) => {
    const hlsText = await getHlsText(videoUrl, videoId);
    const blob = new Blob([hlsText], { type: 'text/plain' });
    return URL.createObjectURL(blob);
};
export const getAESConfig = (videoId) => {
    const hash = MD5(SHA1(videoId.toString()).toString(enc.Hex));
    return { key: hash, iv: hash };
};
export const loadVideo = async (videoId, element) => {
    const hls = new Hls();
    const videoInfo = await getVideoInfo(videoId);
    const hlsUrl = await parseHlsURL(videoInfo.play_url, videoInfo.id);
    hls.loadSource(hlsUrl);
    hls.attachMedia(element);
};
export const getVideoSearchResult = async (keyword, page = 1, pageSize = 20) => {
    const params = new URLSearchParams([['limit', pageSize.toString()], ['page', page.toString()], ['wd', keyword]]).toString();
    const data = await fetch(baseUrl + '/api/vod/clever?' + params).then(res => res.json());
    return data.data.list;
};
export const getAllLabels = async () => {
    const data = await fetch(baseUrl + '/api/vodlabel/all').then(res => res.json());
    return data.data.list;
};
export const getVideoTypeMenu = async () => {
    const data = await fetch(baseUrl + '/api/vod/type').then(res => res.json());
    return data.data.list;
};
export const getVideoListByType = async (typeIds, options = {}) => {
    const params = new URLSearchParams([
        ['types', typeIds.join(',')],
        ['limit', (options.pageSize ?? 20).toString()],
        ['page', (options.page || 1).toString()],
        ['order', '-' + (options.order || 'id')],
    ]).toString();
    const data = await fetch(baseUrl + '/api/vod/list?' + params).then(res => res.json());
    return data.data.list;
};
export const downloadFile = (objectURL, filename) => {
    const link = document.createElement('a');
    link.href = objectURL;
    link.download = filename;
    link.click();
    link.remove();
};
