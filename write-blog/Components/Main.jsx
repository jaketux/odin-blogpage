import "/src/App.css";
import Posts from "./Posts";
import Post from "./Post";
import CreatePost from "./CreatePost";

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
    createPost,
    setCreatePost,
    editPost,
    setEditPost,
    postToEdit,
    setPostToEdit,
    currentError,
    setCurrentError,
    errorInView,
    setErrorInView,
  } = props;

  return (
    <div className="main-box">
      {loggedIn && !viewPost && !createPost && (
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
              createPost={createPost}
              setCreatePost={setCreatePost}
              setEditPost={setEditPost}
              setPostToEdit={setPostToEdit}
              setCurrentError={setCurrentError}
              setErrorInView={setErrorInView}
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
          currentError={currentError}
          setCurrentError={setCurrentError}
          errorInView={errorInView}
          setErrorInView={setErrorInView}
        />
      )}
      {loggedIn && !viewPost && createPost && (
        <div>
          <div className="welcome-text">Write a new post: </div>
          <CreatePost
            postInView={postInView}
            setPosts={setPosts}
            setRefreshcounter={setRefreshcounter}
            setCreatePost={setCreatePost}
            editPost={editPost}
            setEditPost={setEditPost}
            postToEdit={postToEdit}
            setCurrentError={setCurrentError}
            setErrorInView={setErrorInView}
          />
        </div>
      )}
    </div>
  );
}
