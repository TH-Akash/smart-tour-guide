import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const { user } = useSelector((state) => state.authReducer.authData);

  const { allPosts, loading: allPostLoading } = useSelector((state) => state.allPostReducer);

  const [searchValue, setSearchValued] = useState("");

  const dispatch = useDispatch();

  const handelSearchAllPosts = async () => {
    dispatch({ type: "ALL_POST_LOADING" });
    try {
      const res = await axios.get(`http://localhost:5000/posts?search=${searchValue}`);

      dispatch({ type: "ALL_POST_SUCCESS", payload: res.data });
    } catch (error) {
      dispatch({ type: "ALL_POST_FAIL", payload: error });
      console.log(error, "error");
    }
  };
  console.log(user, "user");
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          {user?.isAdmin ? (
            <div>
              <img
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                src={user?.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + user?.profilePicture : ""}
                alt=""
              />
              <span> Admin</span>
            </div>
          ) : (
            <div>
              <img
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                src={user?.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + user?.profilePicture : ""}
                alt=""
              />
              <span> {`${user?.firstname}  ${user?.lastname}`}</span>
            </div>
          )}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/profile/${user._id}`}>
                Profile
              </Link>
            </li>

            {user.isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to={`/admin-dashboard`}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {window.location.pathname === "/home" && (
            <form className="d-flex" role="search">
              <input
                onChange={(e) => setSearchValued(e.target.value)}
                className="form-control me-2"
                value={searchValue}
                type="search"
                placeholder="Search by title"
                aria-label="Search"
              />
              <button disabled={allPostLoading} onClick={handelSearchAllPosts} className="btn btn-outline-success" type="submit">
                {allPostLoading ? "searching..." : " Search "}
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
