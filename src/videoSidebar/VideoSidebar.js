import './VideoSidebar.css'
import { useNavigate } from 'react-router-dom';
import { daysAgo } from "../video/utils"

function VideoSidebar( { _id, id, image, title, uploader, visits, duration, uploadDate, setKey} ) {

  const navigate = useNavigate();
    const changeWatchedVideo = () => {
        navigate(`/watch/${_id}`);
        setKey(id);
    }
    return (
      <div className="container mt-3">
        <div className="d-flex align-items-start position-relative">
          <img
            src={`http://localhost:8080/${image}`}
            className="img-fluid video-img"
            alt="Description"
            onClick={changeWatchedVideo}
          />
          <span className="duration-side-video">{duration}</span>
          <div className="ml-3 ml-3-video-side-bar">
            <p className="card-title-sidebar mb-0">{title}</p>
            <p className="card-text-sidebar">{uploader}</p>
            <p className="card-text-sidebar">
              <small>
                {visits} • {daysAgo(uploadDate)}
              </small>
            </p>
          </div>
        </div>
      </div>
    );
}
export default VideoSidebar;