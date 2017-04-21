import VideoControlConstants from '../constants/video-control-constants';

const changeMainView = (videoType, videoIndex, localVideos, remoteVideos) => ({
    type: VideoControlConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW,
    data: {
      videoType,
      videoIndex,
      localVideos,
      remoteVideos
    }
})

export default changeMainView
