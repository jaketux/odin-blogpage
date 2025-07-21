import commentImg from "../src/assets/comment.png";

export default function Posts(props) {
  const {
    user,
    posts,
    setViewPost,
    setPostInView,
    formatDateShort,
    setPostInViewId,
  } = props;

  function handleClick(post) {
    setPostInView(post);
    setPostInViewId(post.id);
    setViewPost((prevViewPost) => !prevViewPost);
  }

  console.log(posts);
  return (
    <div className="posts-container">
      {posts.length === 0 && <div>There are currently no posts to view. </div>}
      {posts.map((post) => (
        <div key={post.id} className="blogpost" id={post.id}>
          <h3 className="post-title" onClick={() => handleClick(post)}>
            {post.title}
          </h3>
          <div className="post-author">
            Written by <b>{post.user.firstname + " " + post.user.lastname}</b> |{" "}
            {formatDateShort(post.updatedAt)}
          </div>
          <div className="post-tagline">{post.tagline}</div>
          <div className="post-date"></div>
          <div className="comments">
            <img src={commentImg} alt="Comment icon" className="small-icon" />
            <div>{post.comments.length}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
