import axios from "axios";
import React, { useEffect, useState } from "react";

import "./style.css";

const Dashboard = () => {
  const [totralUser, setTotalUser] = useState(0);
  const [totalPost, setTotalPost] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/user").then((res) => setTotalUser(res.data.length));
    axios.get("http://localhost:5000/posts").then((res) => setTotalPost(res.data.length));
  }, []);

  return (
    <div className='"container'>
      <div className="row">
        <div className="col-md-4">
          <div className="card d-flex justify-content-center flex-colum card-custom">
            <h1 className="text-center"> Total user</h1>
            <h2 className="text-center">{totralUser}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card d-flex justify-content-center flex-colum card-custom">
            <h1 className="text-center"> Total Post </h1>
            <h2 className="text-center">{totalPost}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
