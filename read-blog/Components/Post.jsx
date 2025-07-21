import "/src/App.css";
import Comment from "./Comment";
import Newcomment from "./Newcomment";

export default function Post(props) {
  const {
    postInView,
    formatDateShort,
    formatDateLong,
    postInViewId,
    setRefreshcounter,
    refreshCounter,
    setCurrentError,
    setErrorInView,
  } = props;

  return (
    <>
      <div className="blogpost-main">
        <h2 className="post-title-focus">{postInView.title}</h2>
        <p className="post-author-date-focus">
          Written by{" "}
          <b>{postInView.user.firstname + " " + postInView.user.lastname}</b> |{" "}
          {formatDateShort(postInView.updatedAt)}
        </p>
        <div className="post-tagline-focus">{postInView.tagline}</div>
        <div className="post-content-focus">{postInView.content}</div>
      </div>

      {postInView.comments.length > 0 ? (
        <div className="post-comments">
          <div className="comments-counter">
            <b>{postInView.comments.length} commments</b>
          </div>
          {console.log(postInView.comments)}
          {postInView.comments.map((comment, index) => {
            console.log(comment);
            return (
              <Comment
                key={index}
                id={comment.id}
                content={comment.content}
                updatedAt={comment.updatedAt}
                user={comment.user.username}
                userid={comment.user.id}
                formatDateLong={formatDateLong}
                setRefreshcounter={setRefreshcounter}
                refreshCounter={refreshCounter}
                postInViewId={postInViewId}
                setCurrentError={setCurrentError}
                setErrorInView={setErrorInView}
              />
            );
          })}
        </div>
      ) : (
        <div className="comments-counter">No comments. Be the first below!</div>
      )}
      <div className="new-comment-heading">New comment:</div>
      <Newcomment
        postInView={postInView}
        setRefreshcounter={setRefreshcounter}
        setCurrentError={setCurrentError}
        setErrorInView={setErrorInView}
      />
    </>
  );
}
