export default function Newcomment(props) {
  const { postInView, setRefreshcounter, setCurrentError, setErrorInView } =
    props;

  function newCommentSubmit(formData) {
    const token = localStorage.getItem("token");

    const content = formData.get("content");

    const postid = postInView.id;

    fetch(
      `http://backend-production-acfb.up.railway.app:5000/posts/${postid}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content }),
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

  return (
    <>
      <form className="comment-form" action={newCommentSubmit}>
        <textarea type="text" name="content" id="content" rows={10} cols={60} />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </>
  );
}
