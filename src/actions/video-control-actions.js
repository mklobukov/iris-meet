import VideoControlConstants from '../constants/video-control-constants';

export const changeMainView = (videoType, videoId, localVideos, remoteVideos) => ({
    type: VideoControlConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW,
    data: {
      videoType,
      videoId,
      localVideos,
      remoteVideos
    }
})

export const changeDominantSpeaker = (dominantSpeakerId) => ({
  type: VideoControlConstants.VIDEO_CONTROL_UPDATE_DOMINANT_SPEAKER,
  data: {
    dominantSpeakerId
  }
})

export const changeExtInstalledState = (extInstalled) => ({
  type: VideoControlConstants.VIDEO_CONTROL_EXTENSION_STATUS,
  data: {
    extInstalled
  }
})

export const displayFeatureInDev = (displayBool) => ({
  type: VideoControlConstants.FEATURE_IN_DEV_NOTIFICATION,
  data: {
    displayBool
  }
})
