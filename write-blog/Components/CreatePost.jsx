export default function CreatePost(props) {
  const {
    setRefreshcounter,
    setCreatePost,
    editPost,
    setEditPost,
    postToEdit,
    setCurrentError,
    setErrorInView,
  } = props;

  const token = localStorage.getItem("token");

  function submitPost(formData) {
    const title = formData.get("title");
    const tagline = formData.get("tagline");
    const content = formData.get("content");

    const publish = formData.get("publish-choice");

    const published = publish === "true" ? true : false;

    fetch(
      editPost
        ? `http://backend-production-acfb.up.railway.app:5000/posts/${postToEdit.id}`
        : `http://backend-production-acfb.up.railway.app:5000/posts/`,
      {
        method: editPost ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          tagline: tagline,
          content: content,
          published: published,
        }),
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
        setEditPost(false);
        setCreatePost(false);
      })
      .catch((error) => {
        console.log("Full error: " + error);
        console.log("Error message: " + error.message);
        console.log("Error name: " + error.name);
        setErrorInView("Network error, please try again");
        setCurrentError(true);
      });
  }

  return (
    <form className="new-post-form" action={submitPost}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        name="title"
        id="title"
        defaultValue={editPost ? postToEdit.title : ""}
        required
      />
      <label htmlFor="tagline">Tagline</label>
      <input
        type="text"
        name="tagline"
        id="tagline"
        defaultValue={editPost ? postToEdit.tagline : ""}
        required
      />
      <label htmlFor="content">Content</label>
      <textarea
        name="content"
        id="content"
        rows={20}
        cols={50}
        defaultValue={editPost ? postToEdit.tagline : ""}
      ></textarea>
      <fieldset>
        <legend>Publish Post?</legend>
        <div>
          <input type="radio" id="publish" name="publish-choice" value="true" />
          <label htmlFor="publish">Yes</label>
          <input
            type="radio"
            id="donot-publish"
            name="publish-choice"
            value="false"
          />
          <label htmlFor="donot-publish">No</label>
        </div>
      </fieldset>
      <button type="submit" className="styled-button">
        Submit
      </button>
    </form>
  );
}
