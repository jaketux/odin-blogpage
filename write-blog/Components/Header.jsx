import "/src/App.css";
import headerImg from "../src/assets/tuckerimg.jpeg";

export default function Header(props) {
  const { logOut, returnHome } = props;

  return (
    <div className="header-main">
      <div className={props.loggedIn ? "header-box" : "header-box-logout"}>
        <div className="left-header-box">
          <h1 className="header-text">Tuckerblog Dashboard</h1>
        </div>
        {props.loggedIn && (
          <div className="right-header-box">
            <a className="header-link" onClick={() => returnHome()}>
              Home
            </a>
            <a className="header-link" onClick={() => logOut()}>
              Logout
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
