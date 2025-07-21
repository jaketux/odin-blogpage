import { useState } from "react";
import Deleteimg from "../src/assets/delete.png";
import Editimg from "../src/assets/editing.png";
import Submitimg from "../src/assets/submit.png";

export default function Comment(props) {
  const user = JSON.parse(localStorage.userstring);

  const userId = user.id;

  console.log("This is the userId from localStorage: " + userId);

  console.log("This is the user from props: " + props.user);

  console.log("This is the userId from props: " + props.userid);

  const token = localStorage.getItem("token");

  function deleteComment(id) {
    fetch(
      `https://backend-production-acfb.up.railway.app/posts/${props.postInViewId}/comments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      props.setRefreshcounter((prev) => prev + 1);
    });
  }

  function toggleEdit() {
    setCommentEdit((prevCommentEdit) => !prevCommentEdit);
    setEditButtonsDisabled((prevEditButton) => !prevEditButton);
  }

  function editComment(id, formData) {
    const newPostData = formData.get("editcomment");

    console.log("This is the new comment body: " + newPostData);

    fetch(
      `https://backend-production-acfb.up.railway.app/posts/${props.postInViewId}/comments/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newPostData }),
      }
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          props.setErrorInView(data.message);
          props.setCurrentError(true);
          toggleEdit();
          return;
        }
        props.setRefreshcounter((prev) => prev + 1);
        props.setErrorInView(null);
        props.setCurrentError(false);
        toggleEdit();
      })
      .catch((error) => {
        props.setErrorInView(error);
        props.setCurrentError(true);
        props.toggleEdit();
      });
  }

  const [editButtonsDisabled, setEditButtonsDisabled] = useState(false);

  const [commentEdit, setCommentEdit] = useState(false);

  return (
    <div className="comment-box">
      <div className="comment-top-section">
        <div className="commment-user">
          <b>{props.user}</b> says:
        </div>
        <div className="comment-date">
          {props.formatDateLong(props.updatedAt)}
        </div>
      </div>
      {!editButtonsDisabled && (
        <div className="comment-text">{props.content}</div>
      )}

      {props.userid === userId && !editButtonsDisabled && (
        <div className="comment-icons">
          <form action={toggleEdit} className="comment-icon">
            <button type="submit" className="delete-btn">
              <img src={Editimg} alt="Image of a pen" className="small-icon" />
            </button>
          </form>
          <form action={() => deleteComment(props.id)} className="comment-icon">
            <button type="submit" className="delete-btn">
              <img
                src={Deleteimg}
                alt="Image of Trashcan"
                className="small-icon"
              />
            </button>
          </form>
        </div>
      )}
      {commentEdit && (
        <form
          action={(formData) => editComment(props.id, formData)}
          className="comment-edit"
        >
          <textarea
            defaultValue={props.content}
            type="text"
            key={props.id}
            name="editcomment"
            id="editcomment"
            rows={7}
            cols={80}
          ></textarea>
          <button type="submit" className="delete-btn">
            <img
              src={Submitimg}
              alt="Image of submit in a speech bubble"
              className="large-icon"
            />
          </button>
        </form>
      )}
    </div>
  );
}
