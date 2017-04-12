//
//  Verify if the passed string is valid and supported resolution
//  @param  {String} resolution String with resolution name
//  @return {Boolean}           True if valid, otherwise false
//
export default function(resolution) {
  const validResolutions = ['1080', 'fullhd', '720', 'hd', '960', '360', '640', 'vga', '180', '320'];
  const foundResolution = validResolutions.find((thisResolution) => {
    return thisResolution === resolution;
  });

  return foundResolution === resolution;
}
