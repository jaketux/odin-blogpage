import commentImg from "../src/assets/comment.png";
import publishImg from "../src/assets/publishing.svg";
import Deleteimg from "../src/assets/delete.png";
import Editimg from "../src/assets/editing.png";

export default function Posts(props) {
  const {
    user,
    posts,
    setViewPost,
    setPostInView,
    formatDateShort,
    setRefreshcounter,
    setPostInViewId,
    createPost,
    setCreatePost,
    setEditPost,
    setPostToEdit,
    setCurrentError,
    setErrorInView,
  } = props;

  function handleCreatePost() {
    setCreatePost((prevCreatePost) => !prevCreatePost);
  }

  const token = localStorage.getItem("token");

  function handleClick(post) {
    setPostInView(post);
    setPostInViewId(post.id);
    setViewPost((prevViewPost) => !prevViewPost);
  }

  function togglePublished(post) {
    fetch(
      `https://backend-production-acfb.up.railway.app/posts/${post.id}/toggle`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setErrorInView(data.message);
          setCurrentError(true);
          return;
        }
        setRefreshcounter((prev) => prev + 1);
        setErrorInView(null);
        setCurrentError(false);
      })
      .catch((error) => {
        setErrorInView("Network error, please try again");
        setCurrentError(true);
      });
  }

  function deletePost(post) {
    fetch(`https://backend-production-acfb.up.railway.app/posts/${post.id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setErrorInView(data.message);
          setCurrentError(true);
          return;
        }
        setRefreshcounter((prev) => prev + 1);
        setErrorInView(null);
        setCurrentError(false);
      })
      .catch((error) => {
        setErrorInView("Network error, please try again");
        setCurrentError(true);
      });
  }

  function enableEditPost(post) {
    setEditPost(true);
    setPostToEdit(post);
    setCreatePost(true);
  }

  console.log(posts);
  return (
    <div className="posts-container">
      {posts.length === 0 && !createPost && (
        <div className="empty-posts">
          <div>There are currently no posts to show. </div>
          <button className="styled-button" onClick={() => handleCreatePost()}>
            New Post
          </button>
        </div>
      )}
      {posts.length > 0 &&
        !createPost &&
        posts.map((post) => (
          <div key={post.id} className="blogpost" id={post.id}>
            <a>
              <h3 className="post-title" onClick={() => handleClick(post)}>
                {post.title}
              </h3>
            </a>
            <div className="post-author">
              Written by <b>{user.firstname + " " + user.lastname}</b> |{" "}
              {formatDateShort(post.updatedAt)}
            </div>
            <div className="post-tagline">{post.tagline}</div>
            <div className="post-date"></div>
            <div className="post-publishedstatus">
              Status: {post.published ? "Published" : "Draft"}
            </div>
            <div className="action-icons">
              <div className="comments-post">
                <img
                  src={commentImg}
                  alt="Comment icon"
                  className="status-icon"
                />
                <div className="status-text">{post.comments.length}</div>
              </div>
              <>
                <form
                  action={() => enableEditPost(post)}
                  className="comment-icon"
                >
                  <button type="submit" className="delete-btn">
                    <img
                      src={Editimg}
                      alt="Image of a pen"
                      className="status-icon"
                    />
                  </button>
                </form>
                <form
                  className="publish-post"
                  action={() => togglePublished(post)}
                >
                  <button type="submit" className="publish-btn">
                    <img
                      src={publishImg}
                      alt="Publish icon"
                      className="status-icon"
                    />
                  </button>
                </form>
                <form className="delete-post" action={() => deletePost(post)}>
                  <button type="submit" className="delete-btn">
                    <img
                      src={Deleteimg}
                      alt="Publish icon"
                      className="status-icon"
                    />
                  </button>
                </form>
              </>
            </div>
          </div>
        ))}
      {posts.length > 0 && !createPost && (
        <button className="styled-button" onClick={() => handleCreatePost()}>
          New Post
        </button>
      )}
    </div>
  );
}
