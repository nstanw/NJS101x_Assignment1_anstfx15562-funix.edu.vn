import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import DiemDanh from "./components/diemDanh";
import type { MenuProps } from "antd";
const { Header, Content } = Layout;

const App: React.FC = () => {
  const [current, setCurrent] = useState("diemDanhKetThucLam");
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items: MenuProps["items"] = [
    {
      label: (
        <Link to="/diemDanhKetThucLam">Điểm danh bắt đầu/kết thúc làm</Link>
      ),
      key: "diemDanhKetThucLam" || "diemDanh" || "ketThucLam" || "nghiPhep",
      children: [
        {
          type: "group",
          children: [
            {
              label: <Link to="/diemDanh">Điểm danh</Link>,
              key: "diemDanh",
            },
            {
              label: <Link to="/ketThucLam">Kết thúc làm</Link>,
              key: "ketThucLam",
            },
            {
              label: <Link to="/nghiPhep">Nghỉ phép</Link>,
              key: "nghiPhep",
            },
          ],
        },
      ],
    },
    {
      label: <Link to="/editThongTinCaNhan">Xem/sửa thông tin cá nhân</Link>,

      key: "editThongTinCaNhan",
    },
    {
      label: <Link to="/traCuuThongTinGioLam">Tra cứu thông tin giờ làm</Link>,
      key: "traCuuThongTinGioLam",
    },
    {
      label: <Link to="/thongTinCovidCaNhan">Thông tin Covid cá nhân</Link>,
      key: "thongTinCovidCaNhan",
    },
  ];

  return (
    <div className="App">
      <Router>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={items}
            />
          </Header>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route path="/" element={<DiemDanh />}></Route>
              <Route path="/diemDanh" element={<DiemDanh />}></Route>
            </Routes>
          </Content>

          <Footer />
        </Layout>
      </Router>
    </div>
  );
};

export default App;
