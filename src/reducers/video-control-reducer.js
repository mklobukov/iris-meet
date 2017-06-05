import VideoControlConstants from '../constants/video-control-constants';

//NOTE: dominant speaker ID is available to this reducer
//as action.data.domId. Not used anymore, but may be handy in the future

const VideoReducer = (state = {}, action) => {

  switch(action.type) {
    case VideoControlConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW:
      if (action.data && action.data.videoType && action.data.videoId) {
        console.log("VideoReducer got data: ", action.data)
        let mainConnection = 0


        //find the new video connection if switching is enabled
        if (action.data.switchingEnabled || action.data.switchingEnabled === undefined || action.data.triggeredOnClick) {
          console.log("Searching for the video to put on main screen...")
          if (action.data.videoType === 'local') {
              mainConnection = action.data.localVideos.find((connection) => {
              return connection.id === action.data.videoId;
            });
          } else {
              mainConnection = action.data.remoteVideos.find((connection) => {
              return connection.id === action.data.videoId;
              });
            }

          //if found connection, return it. If not, return previous state
          if (mainConnection !== 0) {
            return Object.assign({}, state, {
                 videoType: action.data.videoType,
                 videoIndex: action.data.videoIndex,
                 connection: mainConnection,
                 enableDomSwitch: !action.data.triggeredOnClick,
               })
          } else {
            console.log("Couldn't find a video corresponding to provided index.\nReturn previous state.")
            return state;
          }
        } else { //if switching is disabled
          console.log("Main video switching is disabled. \nReturn previous state.")
          return state;
        }
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

    case VideoControlConstants.VIDEO_CONTROL_EXTENSION_STATUS:
      if (action.data.extInstalled !== undefined) {
        console.log("Updating extension status. Installed? -- ", action.data.extInstalled)
        return Object.assign({}, state, {
          screenShareExtInstalled: action.data.extInstalled
        })
      }
      else {
        console.log("Invalid extension status passed to Video Control Reducer. Returning previous state")
        return state
      }

    default:
      return state
  }
}

export default VideoReducer
