import { Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Avatar, Space, Table, Tag } from "antd";
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const VisitedHistoryList = () => {
  const [userListByPost, setUserListByPost] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("https://bdapis.herokuapp.com/api/v1.1/districts").then((res) => setDistricts(res?.data?.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = selectedDistrict ? `http://localhost:5000/posts/district/${selectedDistrict}` : "http://localhost:5000/posts";
    axios.get(url).then((res) => {
      const user = res.data.map((x, index) => {
        return {
          userName: x.userId.username,
          id: x._id,
          profilePicture: x.userId.profilePicture,
          index: index + 1,
          firstName: x.userId.firstname,
          lastName: x.userId.lastname,
        };
      });
      setLoading(false);
      setUserListByPost(user);
    });
  }, [selectedDistrict]);

  console.log(userListByPost, selectedDistrict, "userListByPost");

  const handelDistictChange = (v) => {
    setSelectedDistrict(v);
  };

  const processData = (data) => {
    const newData = [];

    data.map((x) => {
      console.log(x);
      let inx = newData.findIndex((y) => y.userName == x.userName);

      console.log(inx);
      if (inx === -1) {
        newData.push({ ...x, visited: 1 });
      } else {
        let extractData = newData[inx];
        extractData.visited += 1;

        newData.splice(inx, 1, extractData);
      }
    });
    console.log(newData);
    return newData;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <Select
            style={{ minWidth: "400px" }}
            showSearch
            placeholder="Select a district"
            label="Selete district"
            optionFilterProp="children"
            onChange={handelDistictChange}
            defaultValue={districts}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {districts.map((x) => (
              <Option key={x._id} value={x._id}>
                {x.district}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Table loading={loading} dataSource={processData(userListByPost)}>
        <Column title="#SL" dataIndex="index" key="index" />

        <Column
          title="profilePicture"
          dataIndex="profilePicture"
          key="profilePicture"
          render={(profilePicture) => (
            <>
              <Avatar src={profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + profilePicture : "https://joeschmoe.io/api/v1/random"} />
            </>
          )}
        />

        <Column title="User Name" dataIndex="userName" key="userName" />
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="firstName" key="firstName" />
        <Column
          title="Total Posts"
          dataIndex="visited"
          key="visited"
          render={(visited) => (
            <>
              <Tag color="blue" key={visited}>
                {visited}
              </Tag>
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default VisitedHistoryList;
