import van from 'vanjs-core'
import { downloadFile, getVideoInfo, parseHlsURL } from './mogu'

const { div, button, input } = van.tags

/** M3U8 文件下载组件 */
const M3u8Downloader = () => {
    const videoId = van.state('')

    return div(
        input({ value: videoId, oninput: event => videoId.val = event.target.value, placeholder: '视频 ID' }),
        button({
            async onclick() {
                const info = await getVideoInfo(parseInt(videoId.val))
                if (!info) return alert('获取播放地址失败')
                const url = await parseHlsURL(info.play_url, info.id)
                downloadFile(url, info.title + '.m3u8')
            }
        }, '下载')
    )
}

van.add(document.body, M3u8Downloader())