import { useEffect, useState } from "react";
import watch from "../images/youtubelogo.svg";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EditUserModal from "./EditUserModal";

function Navbar({
  videoList,
  setMatchedVideos,
  setIsDarkMode,
  isDarkMode,
  userInfo,
  setUserInfo,
}) {
  const [searchedVideo, setSearchedVideo] = useState("");
  const [input, setInput] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const onEditUser = () => {
    setIsEditingUser(true);
  };
  const handleClose = () => {
    setIsEditingUser(false);
  };
  const onKeyboardInput = (event) => {
    setInput(event.target.value);
  };

  const onSearchVideo = () => {
    setSearchedVideo(input);
  };

  useEffect(() => {
    const pattern = new RegExp(`^${searchedVideo}`, "i");
    setMatchedVideos(videoList.filter((video) => pattern.test(video.title)));
    setIsSubmit(false);
  }, [isSubmit]);

  const changeMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigate = useNavigate();
  const onMoveToAddVideo = () => {
    navigate("/addVideo");
  };
  const onMoveToLogin = () => {
    navigate("/login");
  };
  const onDeleteUser = async () => {
    try {
      const token = userInfo.token;
      const response = await fetch(
        `http://localhost:8080/api/users/${userInfo.username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const json = await response.json();
      alert(`The user ${userInfo.username} delete succesfully.`)
      logout();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  }
  const logout = () => {
    setUserInfo({
      username: "",
      displayName: "",
      password: "",
      verifyPassword: "",
      image: "",
      videoIdListLiked: [],
      videoIdListUnliked: [],
      commentIdListLiked: [],
      commentIdListUnliked: [],
    });
    onMoveToLogin();
  };

  return (
    <div>
      <nav className="navbar navbar-expand">
        <div className="container-fluid container-fluid-navbar navbar-expand">
          <Link
            className={`navbar-brand ${
              isDarkMode ? "dark-mode" : "light-mode"
            }`}
            to="/"
          >
            <img className="logo" src={watch} alt=""></img> 
            &nbsp;YouTube
          </Link>

          <form
            className="d-flex"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmit(true);
              onSearchVideo();
            }}
          >
            <input
              className="form-control me-2 search"
              onChange={onKeyboardInput}
              type="search"
              placeholder="Search"
              aria-label="Search"
            ></input>

            <button className="btn-search" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </form>
          <div>
            <ul className="navbar-nav me-auto mb-2">
              <li className="nav-item add-item">
                {userInfo?.username && (
                  <button
                    className="navbar-brand add-video"
                    onClick={onMoveToAddVideo}
                  >
                    &nbsp;
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      className="bi bi-camera-reels"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
                      <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm6 8.73V7.27l-3.5 1.555v4.35zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1" />
                      <path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                    </svg>
                    &nbsp;
                  </button>
                )}
              </li>
              <li
                className={`nav-item ${
                  isDarkMode ? "dark-mode" : "light-mode"
                }`}
              >
                <button
                  className={`sign-in navbar-brand ${
                    isDarkMode ? "dark-mode" : "light-mode"
                  }`}
                  onClick={() => {
                    if (!userInfo?.username) {
                      onMoveToLogin();
                    }
                  }}
                  href="#"
                  {...(userInfo?.username && {
                    "aria-current": "page",
                    "data-bs-toggle": "dropdown",
                    "aria-expanded": "false",
                  })}
                >
                  &nbsp;
                  {userInfo?.image ? (
                    <img
                      src={`http://localhost:8080/${userInfo.image}`}
                      alt=""
                      width="34"
                      height="34"
                      className="username_img"
                    ></img>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      className="bi bi-person-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                      />
                    </svg>
                  )}
                </button>
                {userInfo?.username && (
                  <div className="dropstart video-menu">
                    <button type="button" className="video-menu"></button>
                    <ul className="dropdown-menu dropdown-menu-video">
                    <li>
                        <button
                          className="dropdown-menu-video-btn"
                          type="button"
                          onClick={onEditUser}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-person-fill-gear"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                          </svg>
                          &nbsp; Edit user
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-menu-video-btn"
                          type="button"
                          onClick={onDeleteUser}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-person-fill-slash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465m-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                          </svg>
                          &nbsp; Delete user
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-menu-video-btn"
                          onClick={logout}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-box-arrow-left"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill="evenodd"
                              d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                            />
                            <path
                              fill="evenodd"
                              d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                            />
                          </svg>
                          &nbsp; Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <button className="mode navbar-brand" onClick={changeMode}>
                  &nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    className="bi bi-sun"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d={`${
                        isDarkMode
                          ? "M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"
                          : "M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"
                      }`}
                    />
                  </svg>
                  &nbsp;
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isEditingUser && (
        <EditUserModal
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}

export default Navbar;
