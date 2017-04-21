import VideoControlConstants from '../constants/video-control-constants';

export const changeMainView = (videoType, videoIndex, localVideos, remoteVideos) => ({
    type: VideoControlConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW,
    data: {
      videoType,
      videoIndex,
      localVideos,
      remoteVideos
    }
})

export const changeDominantSpeaker = (dominantSpeakerIndex) => ({
  type: VideoControlConstants.VIDEO_CONTROL_UPDATE_DOMINANT_SPEAKER,
  data: {
    dominantSpeakerIndex
  }
})
