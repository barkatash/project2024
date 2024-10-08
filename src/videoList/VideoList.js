import "./VideoList.css";
import Video from "../video/Video";

function VideoList({ matchedVideos, handleDeleteVideo, userInfo, setAllVideos, allVideos, rerenderVideos }) {
  return (
    <div>
      <div className="videos">
      {matchedVideos.map((video, id) => (
        <Video
          key={id}
          {...video}
          handleDeleteVideo={handleDeleteVideo}
          userInfo={userInfo}
          setAllVideos={setAllVideos}
          allVideos={allVideos}
          rerenderVideos={rerenderVideos}
        />
      ))}
      </div>
    </div>
  );
}

export default VideoList;
