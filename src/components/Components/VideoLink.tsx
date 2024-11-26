import React, { useState, useRef } from 'react';
const VideoLink = () => {
  // video Play source
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef?.current) {
      videoRef?.current?.play();
    }
  };
  // video Play source
  return (
    <>
      <div className='video-demo-pnl'>
        <div
          className='bg-layer'
          style={{
            backgroundImage: `url(https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/LandingPage/Banners/banner-7.png)`,
          }}
        />
        {!isPlaying && (
          <div className='play-span' onClick={handlePlay}>
            <span>
              <i className='fa fa-play'></i>
            </span>
          </div>
        )}
        <div className='video-pnl'>
          <video
            ref={videoRef}
            src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/LandingPage/Fantasy+Extreme+Demo+Final+Video+(1).mp4'
            controls
          />
        </div>
      </div>
    </>
  );
};
export default VideoLink;
