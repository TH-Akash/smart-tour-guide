import { Avatar, Space, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DateTime from "../../components/DateTime/DateTime";
const { Column, ColumnGroup } = Table;

const UserList = () => {
  const [totralUser, setTotalUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/user").then((res) => {
      setTotalUser(res.data);
      setLoading(false);
    });
  }, []);

  const processData = (res) => {
    console.log(res);
    return res.map((x, index) => {
      return { ...x, index: index + 1 };
    });
  };

  return (
    <div>
      <Table loading={loading} dataSource={processData(totralUser)}>
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

        <Column title="User Name" dataIndex="username" key="username" />
        <Column title="First Name" dataIndex="firstname" key="firstname" />
        <Column title="Last Name" dataIndex="lastname" key="lastname" />
        <Column
          title="createdAt"
          dataIndex="createdAt"
          key="createdAt"
          render={(createdAt) => (
            <>
              <Tag color="blue" key={createdAt}>
                <DateTime date={createdAt} />
              </Tag>
            </>
          )}
        />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <a>Deactive </a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default UserList;
