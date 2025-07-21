import { useState, useEffect, createContext } from "react";
import "./App.css";
import Header from "../Components/Header";
import Main from "../Components/Main";
import Post from "../Components/Post";
import Errors from "../Components/Errors";

import Login from "../Components/Login";

// import Main from "../Components/Main";

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);

  const [loggedIn, setLoggedIn] = useState(null);

  const [user, setUser] = useState(null);

  const [viewPost, setViewPost] = useState(false);

  const [postInView, setPostInView] = useState(null);

  const [postsFetched, setPostsFetched] = useState(false);

  const [postInViewId, setPostInViewId] = useState(null);

  const token = localStorage.getItem("token");

  const [refreshCounter, setRefreshcounter] = useState(0);

  const [currentError, setCurrentError] = useState(false);

  const [errorInView, setErrorInView] = useState(null);

  function formatDateLong(date) {
    return new Date(date).toLocaleString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDateShort(date) {
    return new Date(date).toLocaleString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function logOut() {
    setLoggedIn((prevLoggedIn) => !prevLoggedIn);
    setViewPost(false);
    setUser(null);
    setErrorInView(null);
    setCurrentError(false);
    localStorage.clear();
  }

  function returnHome() {
    if (viewPost === true) {
      setViewPost(false);
    }

    if (errorInView) {
      setErrorInView(null);
    }
    if (currentError) {
      setCurrentError(false);
    }
  }

  useEffect(() => {
    loggedIn &&
      fetch("http://backend-production-acfb.up.railway.app:5000/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            setErrorInView(data.message);
            setCurrentError(true);
            console.log(data.message);
            return;
          }
          setPosts(data);
          setPostsFetched(true);
          setPostInView(data.find((post) => post.id === postInViewId));
        })
        .catch((error) => {
          setErrorInView("Network error, please try again.");
          setCurrentError(true);
        });
  }, [loggedIn, token, refreshCounter]);

  return (
    <>
      <Header loggedIn={loggedIn} logOut={logOut} returnHome={returnHome} />
      {currentError && <Errors errorInView={errorInView} />}
      {!loggedIn ? (
        <Login
          setLoggedIn={setLoggedIn}
          setUser={setUser}
          currentError={currentError}
          setCurrentError={setCurrentError}
          errorInView={errorInView}
          setErrorInView={setErrorInView}
        />
      ) : null}
      {loggedIn && postsFetched && (
        <Main
          posts={posts}
          setPosts={setPosts}
          user={user}
          viewPost={viewPost}
          setViewPost={setViewPost}
          postInView={postInView}
          setPostInView={setPostInView}
          postInViewId={postInViewId}
          setPostInViewId={setPostInViewId}
          formatDateShort={formatDateShort}
          formatDateLong={formatDateLong}
          loggedIn={loggedIn}
          setRefreshcounter={setRefreshcounter}
          refreshCounter={refreshCounter}
          currentError={currentError}
          setCurrentError={setCurrentError}
          errorInView={errorInView}
          setErrorInView={setErrorInView}
        />
      )}
    </>
  );
}

export default App;
