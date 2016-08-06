import BaseStore from './base-store';
import VideoControlStoreConstants from '../constants/video-control-store-constants';


class VideoControlStore extends BaseStore {
  constructor() {
    super();
    this.registerActions(() => this._actionsHandler.bind(this));

    this.mainVideo = {
      type: 'none', // 'none', 'local', RemoteVideo
      index: 0,
    }
  }

  addVideoControlListener(name, callback) {
    this.addListener(name, callback);
  }

  removeVideoControlListener(name, callback) {
    this.removeListener(name, callback);
  }

  _actionsHandler(action) {
    switch (action.actionType) {
      case VideoControlStoreConstants.VIDEO_CONTROL_CHANGE_MAIN_VIEW:
        if (action.data && action.data.videoType && action.data.videoIndex) {
          this._handleMainVideoChange(action.data.videoType, action.data.videoIndex);
        }
    }
  }

  _handleMainVideoChange(videoType, videoIndex) {
    this.mainVideo.type = videoType;
    this.mainVideo.index = videoIndex;
    this.emit(VideoControlStoreConstants.VIDEO_CONTROL_MAIN_VIEW_UPDATED_EVENT);
  }

  get videoType() {
    return this.mainVideo.type;
  }

  get videoIndex() {
    return this.mainVideo.index;
  }
}

export default new VideoControlStore();
