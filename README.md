# mogu-api

> 蘑菇视频 API 接口

## 快速开始

```bash
npm install mogu-api
```

**按需导入您需要的功能**：

```ts
import {
    getVideoInfo,
    getHlsText,
    parseHlsURL,
    getAESConfig,
    loadVideo,
    getVideoSearchResult,
    getAllLabels,
    getVideoTypeMenu,
    getVideoListByType,
    downloadFile
} from 'mogu-api'
```

## API 文档

- `getVideoInfo`: (videoId: number | string) => Promise<VideoInfo>
    
    获取视频信息，返回视频标题、视频播放地址等
- `getHlsText`: (videoUrl: string, videoId: number | string) => Promise<string>
    
    获取视频 M3U8 字符串，输入加密的 M3U8 地址，解密并输出 M3U8 内容
- `parseHlsURL`: (videoUrl: string, videoId: number | string) => Promise<string>
    
    解密视频地址并返回可播放的 Hls URL，输入加密的 M3U8 地址，输出可直接播放的 Hls 地址
- `getAESConfig`: (videoId: number | string) => { key: lib.WordArray, iv: lib.WordArray }
    
    获取 AES 配置信息，返回解密时需要的密钥和偏移量
- `loadVideo`: (videoId: number | string, element: HTMLMediaElement) => Promise<void>
    
    将视频载入到视频元素，根据视频 ID 获得解密后的 M3U8 字符串，创建 ObjectURL 对象，然后通过 Hls 将视频载入到视频元素中
- `getVideoSearchResult`: (keyword: string, page?: number, pageSize?: number) => Promise<VideoListItem[]>
    
    获取视频搜索结果
- `getAllLabels`: () => Promise<{ id: number, name: string }[]>
    
    获取所有的标签
- `getVideoTypeMenu`: () => Promise<VideoTypeMenu>
    
    获取视频分类菜单
- `getVideoListByType`: (typeIds: number[], options?: { page?: number, pageSize?: number, order?: 'stat' | 'view' | 'id' }) => Promise<VideoListItem[]>

    获取分类视频列表
- `downloadFile`: (objectURL: string, filename: string) => void
    
    下载文件
- `getImageBase64Src`: (imageUrl: string) => Promise<string>

    将图片转换为 Base64 格式，返回值可直接设置为图片元素的 `src` 属性