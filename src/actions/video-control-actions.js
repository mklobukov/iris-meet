import VideoControlConstants from '../constants/video-control-constants';

export const changeMainView = (videoType, videoId, domId, triggeredOnClick, localVideos, remoteVideos, switchingEnabled) => ({
    type: VideoControlConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW,
    data: {
      videoType,
      videoId,
      domId,
      triggeredOnClick,
      localVideos,
      remoteVideos,
      switchingEnabled
    }
})

export const changeDominantSpeaker = (dominantSpeakerId, dominantSpeakerJid) => ({
  type: VideoControlConstants.VIDEO_CONTROL_UPDATE_DOMINANT_SPEAKER,
  data: {
    dominantSpeakerId,
    dominantSpeakerJid,
  }
})

export const changeExtInstalledState = (extInstalled) => ({
  type: VideoControlConstants.VIDEO_CONTROL_EXTENSION_STATUS,
  data: {
    extInstalled
  }
})
