import React, { useState } from "react";
import "./App.css";
import { Layout, Menu, theme } from "antd";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import DiemDanh from "./components/diemDanh";
import type { MenuProps } from "antd";
import NghiPhep from "./components/nghiPhep";
import EditThongTinCaNhan from "./components/editThongTinCaNhan";
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
    // {
    //   label: <img src="/favicon.ico" alt="icon" />,
    //   key: "icon",
    // },
    {
      label: (
        <Link to="/diemDanh">Điểm danh bắt đầu/kết thúc làm</Link>
      ),
      key: "diemDanh",
    },
    {
      label: <Link to="/nghiPhep">Nghỉ phép</Link>,
      key: "nghiPhep",
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
          <Header>
            <Menu
              theme="dark"
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
              <Route path="/nghiPhep" element={<NghiPhep />}></Route>
              <Route path="/editThongTinCaNhan" element={<EditThongTinCaNhan />}></Route>
            </Routes>
          </Content>

          <Footer />
        </Layout>
      </Router>
    </div>
  );
};

export default App;
