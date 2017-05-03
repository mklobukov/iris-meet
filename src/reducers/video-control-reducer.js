import VideoControlConstants from '../constants/video-control-constants';

const VideoReducer = (state = {}, action) => {

  switch(action.type) {
    case VideoControlConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW:
      if (action.data && action.data.videoType && action.data.videoId) {
        let mainConnection = 0
        if (action.data.videoType === 'local') {
            mainConnection = action.data.localVideos.find((connection) => {
            return connection.id === action.data.videoId;
          });
        } else {
            mainConnection = action.data.remoteVideos.find((connection) => {
            return connection.id === action.data.videoId;
            });
          }
        // return {
        //   videoType: action.data.videoType,
        //   videoIndex: action.data.videoIndex,
        //   connection: mainConnection
        // }
          return Object.assign({}, state, {
               videoType: action.data.videoType,
               videoIndex: action.data.videoIndex,
               connection: mainConnection
             })
          }
       else {
        console.log('Invalid data object passed to VideoControlReducer. Returning previous state.')
        console.log('Action: ' + action);
        return state;
      }

    case VideoControlConstants.VIDEO_CONTROL_UPDATE_DOMINANT_SPEAKER:
      if (action.data.dominantSpeakerId) {
        console.log("changing dominant speaker to: " + action.data.dominantSpeakerId)
        return Object.assign({}, state, {
          dominantSpeakerIndex: action.data.dominantSpeakerId
        })
      }
      else {
        console.log("Invalid dominant speaker index passed to VideoControlReducer. Returning previous state.")
        return state
      }

    default:
      return state
  }
}

export default VideoReducer
