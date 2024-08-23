import "./VideoList.css";
import Video from "../video/Video";

function VideoList({ matchedVideos, handleDeleteVideo, userInfo, setAllVideos, allVideos, rerenderVideos }) {
  return (
    <div>
      {userInfo.username && 
      <div className="videos-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          class="bi bi-music-note-list"
          viewBox="0 0 16 16"
        >
          <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2" />
          <path fill-rule="evenodd" d="M12 3v10h-1V3z" />
          <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z" />
          <path
            fill-rule="evenodd"
            d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"
          />
        </svg>
        &nbsp;
        <h3>More Videos</h3>
        </div>}
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
