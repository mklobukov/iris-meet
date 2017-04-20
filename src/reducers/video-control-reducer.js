import VideoControlConstants from '../constants/video-control-constants';

const VideoReducer = (state = {}, action) => {

  switch(action.type) {
    case VideoControlConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW:
      if (action.data && action.data.videoType && action.data.videoIndex) {
        let mainConnection = 0
        if (action.data.videoType === 'local') {
            mainConnection = action.data.localVideos.find((connection) => {
            return connection.video.index === action.data.videoIndex;
          });
        } else {
            mainConnection = action.data.remoteVideos.find((connection) => {
            return connection.video.index === action.data.videoIndex;
            });
          }
        return {
          videoType: action.data.videoType,
          videoIndex: action.data.videoIndex,
          connection: mainConnection
        }
      } else {
        console.log('Invalid data object passed to VideoControlReducer. Returning current state')
        console.log('Action: ' + action);
        return state;
      }

    default:
      return state
  }
}

export default VideoReducer
