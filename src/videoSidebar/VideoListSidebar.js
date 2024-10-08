import VideoSidebar from "./VideoSidebar";

function VideoListSidebar({ setKey, videos }) {
  return (
    <div>
        <div className="recommended-videos-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-music-note-list"
            viewBox="0 0 16 16"
          >
            <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2" />
            <path fillRule="evenodd" d="M12 3v10h-1V3z" />
            <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z" />
            <path
              fillRule="evenodd"
              d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"
            />
          </svg>
          &nbsp;
          <h4>Recommended Videos For You</h4>
        </div>
      {videos.map((video, id) => (
        <VideoSidebar key={id} {...video} setKey={setKey} />
      ))}
    </div>
  );
}

export default VideoListSidebar;
