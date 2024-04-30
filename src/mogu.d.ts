declare type VideoInfo = {
    /** 视频 ID */
    id: number
    /** 视频标题 */
    title: string
    /** 视频播放地址 */
    play_url: string
    /** 视频封面 */
    cover: string
    /** 视频标签列表 */
    labels: { id: number, name: string }[]
    /** 视频发布用户列表 */
    users: {
        /** 用户 ID */
        id: number,
        /** 用户名称 */
        name: string,
        /** 用户头像 */
        avatar: string,
    }[]
    /** 视频发布时间 */
    created_at: number
}

declare type VideoListItem = {
    /** 视频封面 */
    cover: string
    /** 视频时长秒数 */
    duration: number
    /** 视频 ID */
    id: number
    /** 视频标题 */
    title: string
    /** 视频发布用户列表 */
    users: VideoInfo['users']
}

declare type VideoTypeMenu = {
    id: number,
    name: string,
    child: {
        id: number,
        name: string
    }[]
}[]