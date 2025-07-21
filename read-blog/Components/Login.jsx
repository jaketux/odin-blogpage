import "/src/App.css";

export default function Login(props) {
  function loginUser(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          props.setErrorInView(data.error);
          props.setCurrentError(true);
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("userstring", JSON.stringify(data.user));
        props.setUser(data.user);
        props.setLoggedIn((prevLoggedIn) => !prevLoggedIn);
        props.setErrorInView(null);
        props.setCurrentError(false);
      })
      .catch((error) => {
        props.setErrorInView("Network error, please try again");
        props.setCurrentError(true);
      });
  }

  return (
    <>
      <h3 className="welcome-text-login">
        Enter your username and password below to login.
      </h3>
      <div className="login-form">
        <form action={loginUser}>
          <div className="username">
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" id="username" required />
          </div>
          <div className="password">
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" required />
          </div>
          <div className="submit-btn">
            <button type="submit">Submit</button>
          </div>
          <div>Username: reader | Password: test</div>
        </form>
      </div>
    </>
  );
}
