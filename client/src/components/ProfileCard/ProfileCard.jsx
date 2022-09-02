import React, { useEffect, useState } from "react";
import "./ProfileCard.css";
import Cover from "../../img/cover.jpg";
import Profile from "../../img/profileImg.jpg";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UserApi from "../../api/UserRequests.js";
import axios from "axios";
const ProfileCard = ({ location }) => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.authReducer.authData);
  const posts = useSelector((state) => state.postReducer.posts);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const [profileUser, setProfileUser] = useState({});

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (id === user._id) {
        setProfileUser(user);
      } else {
      
        const profileUser = await UserApi.getUser(id);
        setProfileUser(profileUser.data);

      }
    };
    fetchProfileUser();
  }, [id]);


  if (!id) {
    return "";
  }
  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img
          src={profileUser.coverPicture ? serverPublic + profileUser.coverPicture : serverPublic + "defaultCover.jpg"}
          alt="CoverImage"
        />
        <img
          src={profileUser.profilePicture ? serverPublic + profileUser.profilePicture : serverPublic + "defaultProfile.png"}
          alt="ProfileImage"
        />
      </div>
      <div className="ProfileName">
        <span>
          {profileUser.firstname} {profileUser.lastname}
        </span>
        <span>{profileUser.worksAt ? profileUser.worksAt : "Write about yourself"}</span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{profileUser?.followers?.length}</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{profileUser?.following?.length}</span>
            <span>Following</span>
          </div>
          {/* for profilepage */}
          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{posts?.filter((post) => post?.userId === user._id).length}</span>
                <span>Posts</span>
              </div>{" "}
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? (
        ""
      ) : (
        <span>
          <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            My Profile
          </Link>
        </span>
      )}
    </div>
  );
};

export default ProfileCard;
