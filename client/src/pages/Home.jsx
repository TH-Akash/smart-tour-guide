import React, { useEffect } from "react";
import FavouritePosts from "../components/PostSide/FavouritePosts";
import PostSide from "../components/PostSide/PostSide";
import ProfileSide from "../components/profileSide/ProfileSide";
import RightSide from "../components/RightSide/RightSide";
import "./Home.css";
import { useDispatch } from "react-redux";
import axios from "axios";
const Home = () => {
  const dispatch = useDispatch();

  const getAllPost = async () => {
    dispatch({ type: "ALL_POST_LOADING" });
    try {
      const res = await axios.get("http://localhost:5000/posts");

      dispatch({ type: "ALL_POST_SUCCESS", payload: res.data });
    } catch (error) {
      dispatch({ type: "ALL_POST_FAIL", payload: error });
      console.log(error, "error");
    }
  };
  useEffect(() => {
    getAllPost();
    // dispatch();
  }, []);

  return (
    <div className="Home">
      <ProfileSide />
      <PostSide />
      {/* <FavouritePosts /> */}
    </div>
  );
};

export default Home;
