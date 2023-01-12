import { Button, Col, Form, message, Pagination, Row, Select, Space, Table } from "antd";
import React, { useState } from "react";
import phienLamViecService from "../../services/phienLamViecService";
import Search from "./search";
import { useNavigate } from "react-router-dom";
import QuanLy from "./quanLy";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

//- Hiển thị thông tin chi tiết lương tháng (chọn được tháng muốn xem). Lương = salaryScale * 3000000 + (overTime - số giờ làm thiếu) * 200000.
//  Số giờ làm còn thiếu là khi chưa đủ 8h/ngày kể cả đã cộng annualLeave của ngày đó. Hiển thị chi tiết thông tin trong công thức trên.
interface ITraCuuGioLamViec {
  ngay: Date;
  name: String;
  noiLam: String;
  annualLeave?: number;
  batDau: Date;
  ketThuc?: Date | null;
  thoiGianLam?: number | null;
  lamThem?: number | null;
  active: Boolean;
  salaryScale: number;
}
type ITraCuuGioLamViecDto = ITraCuuGioLamViec[];

const TraCuuGioLam = () => {
  const [currentPage, setCurrentPage] = useState(1); // trang hiện tại
  const [pageSize, setPageSize] = useState(10); // số dòng trên mỗi trang

  const [listTraCuuState, setListTraCuuState] = React.useState<any[]>();
  const [infoQuanLy, setInfoQuanLy] = React.useState<any>();
  const [chiTietLuong, setChiTietLuong] = React.useState<any>();
  const [showLuong, setShowLuong] = React.useState(false);
  const [listFilter, setListFilter] = React.useState<any>(listTraCuuState);
  const [isFilter, setIsFilter] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    (async function run() {
      try {
        let gioLamTheoNgay = await phienLamViecService.traCuuThongTinGioLamNhanVienTheoNgay();
        setListTraCuuState(gioLamTheoNgay);

        let infoQuanLy = await phienLamViecService.getInfoQuanLy();
        setInfoQuanLy(infoQuanLy);
        //#endregion
      } catch (error) {
        console.log("Failed:", error);
      }
    })();
  }, []);

  const columnsTableListPhien = [
    {
      title: "Ngày",
      dataIndex: "ngay",
      key: "ngay",
      render: (ngay: Date) => {
        return <span>{new Date(ngay).toLocaleDateString()}</span>;
      },
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nơi làm việc",
      dataIndex: "noiLam",
      key: "noiLam",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "batDau",
      key: "batDau",
      render: (batDau: Date) => {
        return <span>{new Date(batDau).toLocaleTimeString()}</span>;
      },
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "ketThuc",
      key: "ketThuc",
      render: (ketThuc: Date) => {
        return <span>{ketThuc ? new Date(ketThuc).toLocaleTimeString() : "--"}</span>;
      },
    },
    {
      title: "Thời gian làm việc",
      dataIndex: "thoiGianLam",
      key: "thoiGianLam",
    },
    {
      title: "Thêm giờ",
      dataIndex: "lamThem",
      key: "lamThem",
    },
    {
      title: "Giờ đăng kí nghỉ phép",
      dataIndex: "soGioDangKiPhep",
      key: "soGioDangKiPhep",
    },
  ];

  const columnsChiTietLuong = [
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "namel",
    },
    {
      title: "Hệ số lương",
      dataIndex: "salaryScale",
      key: "salaryScalel",
    },
    {
      title: "Số ngày phép đã đăng kí",
      dataIndex: "thoiGianDangKiNghiPhep",
      key: "thoiGianDangKiNghiPhep",
    },
    {
      title: "Số giờ tăng ca",
      dataIndex: "overTime",
      key: "overTime",
    },
    {
      title: "Số giờ làm thiếu",
      dataIndex: "gioLamThieu",
      key: "gioLamThieul",
    },
  ];

  const handleChangeSelectThangLuong = async (value: any) => {
    try {
      let luongThang = await phienLamViecService.getLuongTheoThang(parseInt(value));
      setChiTietLuong(luongThang);
    } catch (error) {
      console.log("Failed:", error);
    }
  };

  const handlePageSizeChange = (size: any) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    onChange: handlePageSizeChange,
    showSizeChanger: true,
    onShowSizeChange: handlePageSizeChange,
  };

  return (
    <div className="traCuuGioLam">
      <Search
        handleSubmit={(active, q) => {
          const listFilter = listTraCuuState?.filter((d) => d.active === active);
          setListFilter(listFilter);
          setIsFilter(true);
        }}
        onCandle={() => setIsFilter(false)}
      />
      <Form>
        <Row gutter={24}>
          <Col key="q" span={12}></Col>
          <Col key="idQuanLy" span={12}>
            <Form.Item label="ID quản lý">
              <span>{infoQuanLy ? infoQuanLy.id : ""}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col key="q" span={12}>
            {/* <Form.Item label="Tìm kiếm" name="q">
            <Input placeholder="Tìm kiếm" />
          </Form.Item> */}
          </Col>
          <Col key="nameQuanLy" span={12}>
            <Form.Item label="Tên quản lý">
              <span>{infoQuanLy ? infoQuanLy.name : ""}</span>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {!isFilter ? (
        <>
          <Form {...layout} name="control-hooks">
            <h2>Danh sách giờ đã làm</h2>
            <Table
              pagination={pagination}
              dataSource={listTraCuuState ? listTraCuuState.map((d: any, index: any) => ({ ...d, key: index })) : []}
              columns={[
                ...columnsTableListPhien,
                {
                  title: "Trạng thái",
                  dataIndex: "active",
                  key: "active",
                  render: (value: boolean, record: any, index) => {
                    return <span key={value.toString() + index.toString()}>{value ? "Đang làm" : "Không làm"}</span>;
                  },
                },
              ]}
            />
          </Form>
          {/* <Pagination style={{ marginTop: 10 }} {...pagination} /> */}
        </>
      ) : (
        <Form {...layout} name="control-hooks">
          <h2>Danh sách giờ đã làm</h2>
          <Table
            dataSource={listFilter.map((d: any, index: any) => ({ ...d, key: index }))}
            columns={[
              ...columnsTableListPhien,
              {
                title: "Trạng thái",
                dataIndex: "active",
                render: (value: boolean, record: any, index) => {
                  return <span key={index}>{value ? "Đang làm" : "Không làm"}</span>;
                },
              },
            ]}
          />
        </Form>
      )}
      <Button
        danger
        onClick={() => {
          const thangHienTai = new Date(Date.now()).getMonth() + 1;
          handleChangeSelectThangLuong(thangHienTai);
          setShowLuong(!showLuong);
        }}
      >
        Xem lương các tháng
      </Button>
      {showLuong && (
        <Form {...layout} name="control-hooks">
          <h2>Lương = salaryScale * 3000000 + (overTime - số giờ làm thiếu) * 200000</h2>
          <span>
            Chọn tháng xem lương: <Space />
            <Select
              defaultValue={`${new Date(Date.now()).getMonth() + 1}`}
              style={{ width: 120 }}
              onChange={handleChangeSelectThangLuong}
              options={[
                {
                  value: "1",
                  label: "Tháng 1",
                  key: "thang1",
                },
                {
                  value: "2",
                  label: "Tháng 2",
                  key: "thang2",
                },
                {
                  value: "3",
                  label: "Tháng 3",
                  key: "thang3",
                },
                {
                  value: "4",
                  label: "Tháng 4",
                  key: "thang4",
                },
                {
                  value: "5",
                  label: "Tháng 5",
                  key: "thang5",
                },
                {
                  value: "6",
                  label: "Tháng 6",
                  key: "thang6",
                },
                {
                  value: "7",
                  label: "Tháng 7",
                  key: "thang7",
                },
                {
                  value: "8",
                  label: "Tháng 8",
                  key: "thang8",
                },
                {
                  value: "9",
                  label: "Tháng 9",
                  key: "thang9",
                },
                {
                  value: "10",
                  label: "Tháng 10",
                  key: "thang10",
                },
                {
                  value: "11",
                  label: "Tháng 11",
                  key: "thang11",
                },
                {
                  value: "12",
                  label: "Tháng 12",
                  key: "thang12",
                },
              ]}
            />
          </span>
          <Table
            style={{ padding: 10 }}
            dataSource={[chiTietLuong].map((d: any, index: any) => ({ ...d, key: index }))}
            columns={[
              ...columnsChiTietLuong,
              {
                title: "Lương",
                dataIndex: "luong",
                key: "luongl",
              },
            ]}
          />
        </Form>
      )}
    </div>
  );
};

export default TraCuuGioLam;
