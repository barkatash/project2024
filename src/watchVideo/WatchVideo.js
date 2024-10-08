import "./WatchVideo.css";
import Share from "./Share.js";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { daysAgo } from "../video/utils.js";
import { useNavigate, useParams } from "react-router-dom";

function WatchVideo(
  {
    isDarkMode,
    videos,
    setAllVideos,
    userInfo,
    setUserInfo,
    setRecommendedVideos,
  },
  { key }
) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploader, setUploader] = useState();
  const [video, setVideo] = useState({
    _id: "",
    id: 1,
    image: "",
    video: "",
    title: "",
    uploader: "",
    duration: "",
    visits: "",
    uploadDate: "",
    description: "",
    likes: 0,
    categoryId: [],
  });
  const visitAdded = useRef(false);

  useEffect(() => {
    const fetchVideoAndUploader = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/videos/${id}`);
        const video = await response.json();
        setVideo(video);

        const responseUploader = await fetch(`http://localhost:8080/api/users/${video.uploader}`);
        const data = await responseUploader.json();
        setUploader(data);
        if (userInfo.username && userInfo.username != "" && !visitAdded.current) {
          visitAdded.current = true;
          addVisit();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching video or uploader data:", error);
        setLoading(false);
      }
    };

    const addVisit = async () => {
      try {
        console.log(userInfo.username)
        const token = userInfo.token;
        const response = await axios.patch(
          `http://localhost:8080/api/users/${userInfo.username}/videos/views/${id}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        const recommendations = data.recommendations;
        setRecommendedVideos(recommendations);
      } catch (error) {
        console.error("Error watching the video:", error);
        alert("An error occurred while watching the video");
      }
    };

    fetchVideoAndUploader();
  }, [id, userInfo, setRecommendedVideos]);

  const [showTooltip, setShowTooltip] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const handleOpenShare = () => {
    setShowShare(true);
  };
  const handleCloseShare = () => {
    setShowShare(false);
  };
  const handleAlert = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };
  const onMoveToUserPage = () => {
    navigate(`/${video.uploader}`);
  };
  const updateLike = async (newLikes) => {
    try {
      const token = userInfo.token;
      const response = await axios.patch(
        `http://localhost:8080/api/users/${userInfo.username}/videos/like/${id}`,
        { newLikes },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setAllVideos(
        videos.map((video) => {
          if (video.id === id) {
            return { ...video, likes: newLikes };
          }
          return video;
        })
      );
    } catch (error) {
      console.error("Error like the video:", error);
      alert("An error occurred while you liked the video");
    }
  };
  
  const isLoggedIn = !!userInfo?.username;
  const handleLike = () => {
    if (isLikedByUser) {
      const newVideoIdListLiked = userInfo.videoIdListLiked;
      newVideoIdListLiked.splice(userInfo.videoIdListLiked.indexOf(id), 1);
      setUserInfo({ ...userInfo, videoIdListLiked: newVideoIdListLiked });
      let newLikes = video?.likes - 1;
      updateLike(newLikes);
      return;
    } else if (isUnLikedByUser) {
      const newVideoIdListUnLiked = userInfo.videoIdListUnliked;
      newVideoIdListUnLiked.splice(userInfo.videoIdListUnliked.indexOf(id), 1);
      setUserInfo({
        ...userInfo,
        videoIdListLiked: [...userInfo.videoIdListLiked, id],
        videoIdListUnliked: newVideoIdListUnLiked,
      });
    } else
      setUserInfo({
        ...userInfo,
        videoIdListLiked: [...userInfo.videoIdListLiked, id],
      });
    let newLikes = video?.likes + 1;
    updateLike(newLikes);
  };

  const isLikedByUser = userInfo?.videoIdListLiked?.includes(id);
  const isUnLikedByUser = userInfo?.videoIdListUnliked?.includes(id);

  const handleUnLike = () => {
    if (isUnLikedByUser) {
      const newVideoIdListUnLiked = userInfo.videoIdListUnliked;
      newVideoIdListUnLiked.splice(userInfo.videoIdListUnliked.indexOf(id), 1);
      setUserInfo({ ...userInfo, videoIdListUnliked: newVideoIdListUnLiked });
      return;
    }
    if (isLikedByUser) {
      const newVideoIdListLiked = userInfo.videoIdListLiked;
      newVideoIdListLiked.splice(userInfo.videoIdListLiked.indexOf(id), 1);
      let newLikes = video?.likes - 1;
      updateLike(newLikes);
      setUserInfo({
        ...userInfo,
        videoIdListUnliked: [...userInfo.videoIdListUnliked, id],
        videoIdListLiked: newVideoIdListLiked,
      });
      return;
    }
    if (!isUnLikedByUser) {
      setUserInfo({
        ...userInfo,
        videoIdListUnliked: [...userInfo.videoIdListUnliked, id],
      });
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <br></br>
      <div className={`card mb-3 ${isDarkMode ? "dark-mode" : "light-mode"}`}>
        {!loading && (
          <video key={key} controls className="video">
            <source
              src={`http://localhost:8080/${video.video}`}
              type="video/mp4"
            />
          </video>
        )}
        <div className={`card-body ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          <h5 className="card-title title-video-watch watch-video-title">
            {video?.title}
          </h5>
          <div className="user-upload">
            {uploader?.image && !loading ? (
              <img
                className="username-image"
                alt="profile"
                src={`http://localhost:8080/${uploader.image}`}
                onClick={onMoveToUserPage}
              ></img>
            ) : (
              <div onClick={onMoveToUserPage} className="username-image"></div>
            )}
            <h5
              className="card-title uploader title-video-watch"
              onClick={onMoveToUserPage}
            >
              {video?.uploader}
            </h5>
          </div>
          <div className="flex-container d-flex justify-content-end">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  isLoggedIn ? handleLike() : handleAlert();
                }}
              >
                <div className="like-p">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="bi bi-hand-thumbs-up"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d={`${
                        isLikedByUser
                          ? "M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"
                          : "M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"
                      }`}
                    />
                  </svg>
                  &nbsp;&nbsp;<p>{video?.likes}</p>
                </div>
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  isLoggedIn ? handleUnLike() : handleAlert();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-hand-thumbs-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    d={`${
                      isUnLikedByUser
                        ? "M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51q.205.03.443.051c.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591"
                        : "M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"
                    }`}
                  />
                </svg>
              </button>
            </div>
            <button
              type="button"
              className="btn share"
              onClick={handleOpenShare}
            >
              <div className="share-p">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-share"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                </svg>
                &nbsp;&nbsp;
                <p>Share</p>
              </div>
            </button>
            <Share show={showShare} handleClose={handleCloseShare} />
          </div>
          <p className="card-text title-video-watch">{video?.description}</p>
          <p className="card-text title-video-watch">
            {video?.visits} views &nbsp; {daysAgo(video?.uploadDate)}
          </p>
          {showTooltip && (
            <small className="alertLogin bg-primary-subtle alertLoginVideo">
              Please log in to like or unlike this video.
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchVideo;
