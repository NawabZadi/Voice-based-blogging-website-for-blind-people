/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import "./ProfileUI.css";
import axios from "axios";
import { convertFromRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import authHeader from "../../../../services/auth-header";
import ArticleCard from "../../../../components/ArticlesDirectory/ArticleCardUI/ArticleCardUI";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Skeleton } from "@material-ui/lab";
import { useSpeechRecognition } from "react-speech-recognition";
import Button from "@material-ui/core/Button";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import DescriptionIcon from "@material-ui/icons/Description";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import Modal from "@material-ui/core/Modal";
import CameraFrontIcon from "@material-ui/icons/CameraFront";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import WebcamCapture from "../../../../components/WebcamCapture/WebcamCapture";
import { useSnackbar } from "notistack";

import AuthService from "../../../../services/auth-service";

const speech = new SpeechSynthesisUtterance();

function ttsSpeak(message) {
  const voices = window.speechSynthesis.getVoices();
  speech.voice = voices[1];
  speech.text = message;
  window.speechSynthesis.speak(speech);
}

const ProfileUI = (props) => {
  const textInput = useRef();

  const modalStyle = {
    position: "relative",
  };

  const modalBodyStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "#FFFFFF",
    padding: "1rem 5rem 3rem 5rem",
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [myLatestFavArticles, setMyLatestFavArticles] = useState(null);
  const [myLatestArticles, setMyLatestArticles] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState("Loading...");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState("Private View");
  const [modelOpen, setModelOpen] = useState(false);
  const [webcamModalOpen, setWebcamModalOpen] = useState(false);
  const [addFacialAuth, setAddFacialAuth] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [allArticles, setAllArticles] = useState([]);

  const commands = [
    // {
    //   command: "upload profile picture.",
    //   callback: () => uploadProfilePicture(),
    //   description: "Uploads new profile picture",
    // },
    // {
    //   command: "close modal.",
    //   callback: () => ModalClosedHandler(),
    //   description: "Closes Profile Picture Selection Modal",
    // },
    // {
    //   command: "upload from computer.",
    //   callback: () => UploadFromComputer(),
    //   description: "Uploads profile picture from file system",
    // },
    // {
    //   command: "take picture from webcam.",
    //   callback: () => {
    //     uploadPictureFromWebcamHandler();
    //     let variant = "success";
    //     enqueueSnackbar("Opening Web camera", { variant });
    //   },
    //   description: "Uploads profile picture from Webcam",
    // },
    // {
    //   command: "close webcam.",
    //   callback: () => ProfileModalClosedHandler(),
    //   description: "Closes Webcam modal",
    // },
    {
      command: "public view.",
      callback: () => profileViewHandler(),
      description: "Changes profile view to public",
    },
    {
      command: "private view.",
      callback: () => profileViewHandler(),
      description: "Changes profile view to private",
    },
    {
      command: "view all articles.",
      callback: () => viewMyAllBlogs(),
      description: "Views user all articles",
    },
    {
      command: "show user articles.",
      callback: () => navigationHandler(null, 0),
      description: "Shows all user articles from navigation menu",
    },
    {
      command: "go back.",
      callback: () => props.history.goBack(),
      description: "Goes back to the previous page",
    },
    {
      command: "scroll down.",
      callback: () => window.scrollTo({ top: window.pageYOffset + 500, behavior: "smooth" }),
    },
    {
      command: "scroll up.",
      callback: () => window.scrollTo({ top: window.pageYOffset - 500, behavior: "smooth" }),
    },
    {
      command: 'help.',
      callback: async () => {
        ttsSpeak('The available commands are: Public view, Private view, view all articles, show user articles, go back, scroll down , scroll up, help, out to logout');
      },
      description: 'Help command'
    },
    {
      command: 'OUT.',
      callback: async () => {
        console.log('Logging out');
        // AuthService.logout();
        // props.history.push('/login');
        AuthService.logout();
        props.history.push('/');
        setTimeout(ttsSpeak('You have been logged out successfully'),)
        //window.location.reload();
      },
      description: 'Logs out the user'
    },
  ];

  const { transcript } = useSpeechRecognition({ commands });

  const updateSidebar = () => {
    if (props.editor) {
      commands.push();
    }
    props.setCommands(commands);
  };

  const commandsAndDesc = [];

  commands.forEach((cmd) => {
    commandsAndDesc.push({
      command: cmd.command,
      description: cmd.description
    });
  });

  useEffect(() => {
    updateSidebar();
  }, []);

  // const { resetTranscript, interimTranscript, finalTranscript } =
  //   useSpeechRecognition({ commands });
  // const [editorJSON, setEditorJSON] = useState('');

  // const onEditorStateChange = (editorState) => {
  //   setEditorState((prevEditorState) => {
  //     return editorState;
  //   });


  useEffect(() => {
    ttsSpeak('Welcome to the Profile. What would you like to do? Say help and I will guide you through the commands.');
  }, []);

  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/get-user-latest-articles/" + props.match.params.userId,
        { headers: authHeader() }
      )
      .then((response) => {
        setMyLatestArticles(response.data.articles);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.match.params.userId]);

  useEffect(() => {
    if (
      props.match.params.userId === JSON.parse(localStorage.getItem("user")).userId &&
      view === "Private View"
    ) {
      axios
        .get(
          "http://localhost:8000/get-latest-fav-articles/" + props.match.params.userId,
          { headers: authHeader() }
        )
        .then((response) => {
          setMyLatestFavArticles(response.data.favArticles);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMyLatestFavArticles([]);
    }
  }, [props.match.params.userId, view]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/get-profile/" + props.match.params.userId, {
        headers: authHeader(),
      })
      .then((response) => {
        setUsername(response.data.username);
        setUserId(response.data.userId);
        setProfilePicture(response.data.userProfile.ProfilePhotoSecureId);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.match.params.userId]);

  const profileViewHandler = () => {
    setView(view === "Public View" ? "Private View" : "Public View");
  };

  const navigationHandler = (event, newValue) => {
    const url = "/articles-directory/user-articles/" + props.match.params.userId;
    props.history.push(url);
  };

  const viewMyAllBlogs = () => {
    const url = "/articles-directory/user-articles/" + props.match.params.userId;
    props.history.push(url);
  };

  // const viewAllFavBlogs = () => {
  //   const url = "blogs/my-fav-blogs";
  //   props.history.push(url);
  // };

  // const uploadProfilePicture = () => {
  //   setModelOpen(true);
  // };

  const ModalClosedHandler = () => {
    setModelOpen(false);
  };

  // const UploadFromComputer = () => {
  //   textInput.current.click();
  // };

  // const uploadPictureFromWebcamHandler = () => {
  //   setModelOpen(false);
  //   setWebcamModalOpen(true);
  // };

  const ProfileModalClosedHandler = () => {
    setWebcamModalOpen(false);
    setAddFacialAuth(false);
  };

  const fileSelectedHandler = (event, blob) => {
    const fd = new FormData();
    if (event) {
      setProfilePicture(event.target.files[0]);
      fd.append("picture", event.target.files[0]);
    } else {
      setProfilePicture(blob);
      fd.append("picture", blob);
    }
    setModelOpen(false);
    setLoading(true);
    axios
      .post("http://localhost:8000/upload-profile-picture", fd, {
        headers: authHeader(),
        "content-type": "multipart/form-data",
      })
      .then((response) => {
        setLoading(false);
        setProfilePicture(response.data.picture);
      });
  };

  // const addFacialAuthHandler = (blob) => {
  //   const fd = new FormData();
  //   fd.append("picture", blob);
  //   setModelOpen(false);
  //   setLoading(true);
  //   axios
  //     .post("http://localhost:8000/add-facial-auth", fd, {
  //       headers: authHeader(),
  //       "content-type": "multipart/form-data",
  //     })
  //     .then((response) => {
  //       setLoading(false);
  //       enqueueSnackbar("Facial Authentication Added", { variant: "success" });
  //     });
  // };

  return (
    <React.Fragment>
      {loading && <LinearProgress />}
      <div className="profile">
        <div className="profile__details">
          <div className="profile__details--content">
            <div
              className="profile__details--content-profile-pic"
              style={{ backgroundImage: `url(${profilePicture})` }}
            >
              {userId === JSON.parse(localStorage.getItem("user")).userId &&
              view === "Private View" && (
                <div className="profile__details--content-profile-pic-change">
                </div>
              )}
            </div>
            <h2 className="profile__details--content-username">{username}</h2>
            {userId === JSON.parse(localStorage.getItem("user")).userId && (
              <div style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={profileViewHandler}
                >
                  {view === "Public View" ? "Private View" : "Public View"}
                </Button>
              </div>
            )}
            
          </div>
          <div className="profile__details--boundary" />
        </div>
        <div className="profile__activity">
          <div className="profile__activity--blogs">
            <h2 className="profile__activity--blogs-heading">
              {userId === JSON.parse(localStorage.getItem("user")).userId &&
              view === "Private View"
                ? "My Published Articles"
                : "Published Articles"}
            </h2>
            <div className="profile__activity--blogs-my-blogs">
              {myLatestArticles ? (
                myLatestArticles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    id={article._id}
                    title={article.Title}
                    picture={article.PictureSecureId}
                    body={article.Body}
                    postedOn={article.PostedOn}
                    author={article.Author.authorName}
                  />
                ))
              ) : (
                <React.Fragment>
                  {[...Array(4)].map((element, index) => (
                    <Skeleton
                      variant="rect"
                      height={280}
                      width={210}
                      key={index}
                    />
                  ))}
                </React.Fragment>
              )}
            </div>
            <a
              className="profile__activity--blogs-view"
              onClick={viewMyAllBlogs}
            >
              View All
            </a>
          </div>
          {userId === JSON.parse(localStorage.getItem("user")).userId &&
          view === "Private View" && (
            <div className="profile__activity--my-favorites">
              <h2 className="profile__activity--blogs-heading">My Favorites</h2>
              <div className="profile__activity--blogs-my-blogs">
                {myLatestFavArticles ? (
                  myLatestFavArticles.map((article) => (
                    <ArticleCard
                      key={article._id}
                      id={article._id}
                      title={article.Title}
                      picture={article.PictureSecureId}
                      body={article.Body}
                      postedOn={article.PostedOn}
                      author={article.Author.authorName}
                    />
                  ))
                ) : (
                  <React.Fragment>
                    {[...Array(4)].map((element, index) => (
                      <Skeleton
                        variant="rect"
                        height={280}
                        width={210}
                        key={index}
                      />
                    ))}
                  </React.Fragment>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        style={modalStyle}
        open={modelOpen}
        onClose={ModalClosedHandler}
      >
        <div style={modalBodyStyle}>
          <h4 style={{ marginBottom: "2rem", textAlign: "center" }}>
            Please Select Upload method
          </h4>
          <input
            id="upload-image"
            className="upload-image"
            type="file"
            onChange={fileSelectedHandler}
          />
          <div>
            
          </div>
        </div>
      </Modal>

      <Modal
        style={modalStyle}
        open={webcamModalOpen}
        onClose={ProfileModalClosedHandler}
      >
        <div style={modalBodyStyle}>
          <h4 style={{ marginBottom: "2rem", textAlign: "center" }}>
            {addFacialAuth
              ? "Please Capture a Straight and Clear Photo for Facial Authentication"
              : "Please Capture Profile Image"}
          </h4>
          <input
            id="upload-image"
            className="upload-image"
            type="file"
            onChange={fileSelectedHandler}
          />
          <div>
            <WebcamCapture
              fileSelectedHandler={fileSelectedHandler}
              ProfileModalClosedHandler={ProfileModalClosedHandler}
            //   addFacialAuth={addFacialAuth}
            //   addFacialAuthHandler={addFacialAuthHandler}
             />
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default ProfileUI;
