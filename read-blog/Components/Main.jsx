import "/src/App.css";
import Posts from "./Posts";
import Post from "./Post";

export default function Main(props) {
  const {
    user,
    posts,
    setPosts,
    viewPost,
    setViewPost,
    postInView,
    setPostInView,
    postInViewId,
    setPostInViewId,
    formatDateShort,
    formatDateLong,
    loggedIn,
    setRefreshcounter,
    refreshCounter,
    currentError,
    setCurrentError,
    errorInView,
    setErrorInView,
  } = props;

  return (
    <div className="main-box">
      {loggedIn && !viewPost && (
        <>
          <h2 className="welcome-text">Welcome back, {user.username}! </h2>
          <div className="posts-box">
            <Posts
              user={user}
              posts={posts}
              setViewPost={setViewPost}
              setPostInView={setPostInView}
              setPostInViewId={setPostInViewId}
              formatDateShort={formatDateShort}
              setRefreshcounter={setRefreshcounter}
            />
          </div>
        </>
      )}
      {loggedIn && viewPost && (
        <Post
          postInView={postInView}
          formatDateShort={formatDateShort}
          formatDateLong={formatDateLong}
          postInViewId={postInViewId}
          setPostInViewId={setPostInViewId}
          setRefreshcounter={setRefreshcounter}
          refreshCounter={refreshCounter}
          setCurrentError={setCurrentError}
          setErrorInView={setErrorInView}
        />
      )}
    </div>
  );
}
