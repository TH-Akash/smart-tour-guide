import { Tabs } from "antd";
import React from "react";
import LogDashboard from "./LogDashboard";
import UserList from "./UserList";
import VisitedHistoryList from "./VisitedHistoryList";
const { TabPane } = Tabs;

const Dashboard = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Tabs tabPosition="left">
        <TabPane tab="Dashboard" key="1">
          <LogDashboard />
        </TabPane>
        <TabPane tab="User List" key="2">
          <UserList />
        </TabPane>
        <TabPane tab="User Posts History" key="3">
          <VisitedHistoryList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;
