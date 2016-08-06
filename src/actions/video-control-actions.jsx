import AppDispatcher from '../dispatcher/app-dispatcher';
import VideoControlStoreConstants from '../constants/video-control-store-constants';

class VideoControlActions {
  changeMainView(videoType, videoIndex) {
    AppDispatcher.dispatch({
      actionType: VideoControlStoreConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW,
      data: {
        videoType,
        videoIndex,
      }
    });
  }
}

export default new VideoControlActions();
