import React, { useState } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector, useDispatch } from "react-redux";
import { Rate, Tag, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import DateTime from "../DateTime/DateTime";
import axios from "axios";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handelDetails = (id) => {
    navigate(`/postDetails/${id}`);
  };
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

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

  const handelDelete = async (userId, postId) => {
    console.log(userId, "userId");
    setLoading(true);
    const data = {
      userId,
    };
    try {
      let res = await axios.delete(`http://localhost:5000/posts/${postId}`, { data });
      message.success("successfully deleted");
      getAllPost();
      setLoading(false);
    } catch (error) {
      message.error("fail to delete try again!");

      setLoading(false);
    }
  };
  return (
    <div className="Post">
      <div className="d-flex  justify-content-between">
        <Tag
          icon={
            <img
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              src={data?.userId.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + data?.userId.profilePicture : ""}
              alt=""
            />
          }
          color="blue"
        >
          <strong style={{ margin: " 0 10px" }}> {data?.userId?.username}</strong>

          <br />

          <DateTime date={data?.createdAt} />
        </Tag>

        {user._id === data?.userId._id ? (
          <Button loading={loading} disabled={loading} onClick={() => handelDelete(data?.userId._id, data?._id)} danger className=" ">
            Delete
          </Button>
        ) : (
          ""
        )}
      </div>

      <img src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""} alt="" />

      <div className="postReact">
        <img src={liked ? Heart : NotLike} alt="" style={{ cursor: "pointer" }} onClick={handleLike} />
        <img onClick={() => handelDetails(data?._id)} style={{ cursor: "pointer" }} src={Comment} alt="" />
        <Tag className="text-capitalize" color="cyan">
          {" "}
          {data.district && data.district}{" "}
        </Tag>

        <Rate allowHalf disabled defaultValue={data?.rating} />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>{likes} likes</span>

      <span>
        <b style={{ fontSize: "17px" }}>{data.title && data.title} </b>
      </span>
      <div className="detail">
        <span>{data.desc}</span>
      </div>
    </div>
  );
};

export default Post;
