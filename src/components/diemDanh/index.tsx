import React from "react";
import { Button, Form, message, Select, Table } from "antd";
import phienLamViecService from "../../services/phienLamViecService";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const DiemDanh: React.FC = () => {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = React.useState(false);
  const [phienLamViecHienTai, setPhienLamViecHienTai] = React.useState<any>();
  const [name, setName] = React.useState<any>();
  const [listPhienLamViec, setListPhienLamViec] = React.useState([]);

  const navigate = useNavigate();
  // check active
  React.useEffect(() => {
    (async function run() {
      // kiểm tra login
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Vui lòng đăng nhập");
        return navigate("/login");
      }
      // get thông tin username
      const username = localStorage.getItem("username");
      if (username) {
        const result = await phienLamViecService.getActive(username);
        setIsActive(result.active);
        setName(result.name);
        if (result.active) {
          let phienDangLam = await phienLamViecService.getPhienDangLam();
          console.log([phienDangLam]);
          const dataSourcePhienHienTai = phienDangLam ? phienDangLam.map((d: any, index: any) => ({ ...d, key: index })) : [];
          setPhienLamViecHienTai(dataSourcePhienHienTai);
        }
      }
    })();
  }, []);

  const onFinish = async (values: any) => {
    setIsActive(!isActive);
    if (values) {
      try {
        const username = localStorage.getItem("username");
        if (username) {
          let phienLamViecHienTai = await phienLamViecService.addPhienLamViec(username, values.noiLam.label);
          setPhienLamViecHienTai(phienLamViecHienTai);
        }
      } catch (error) {
        console.log("Failed:", error);
      }
    }
  };

  const columnsTablePhienHienTai = [
    {
      title: "Ngày",
      dataIndex: "ngay",
      key: "ngay",
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
    },
  ];

  const columnsTableListPhien = [
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
        return <span>{new Date(ketThuc).toLocaleTimeString()}</span>;
      },
    },
    {
      title: "Thời gian làm việc",
      dataIndex: "thoiGianLam",
      key: "thoiGianLam",
    },
  ];

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      {isActive ? (
        <>
          <Table
            pagination={false}
            dataSource={phienLamViecHienTai}
            columns={[
              ...columnsTablePhienHienTai,
              {
                title: "Trạng thái",
                dataIndex: "active",
                key: "active",
                render: (value: boolean, record: any, index) => {
                  return <span>{value ? "Đang làm" : "Không làm"}</span>;
                },
              },
            ]}
          />
          {console.log("phienLamViecHienTai", phienLamViecHienTai)}
        </>
      ) : (
        <>
          <Form.Item label="Tên nhân viên">{name ? name : ""}</Form.Item>
          <Form.Item name="noiLam" label="Nơi làm việc" rules={[{ required: true }]}>
            <Select allowClear labelInValue>
              <Option value="congTy">Công Ty</Option>
              <Option value="home">Nhà Riêng</Option>
              <Option value="khachHang">Khách hàng</Option>
            </Select>
          </Form.Item>
        </>
      )}
      <Form.Item {...tailLayout}>
        <Button type="primary" danger htmlType="submit" disabled={isActive}>
          Điểm danh
        </Button>
        <Button
          htmlType="button"
          type="primary"
          danger
          disabled={!isActive}
          onClick={async () => {
            try {
              let phienLamViecs = await phienLamViecService.ketThucPhienLamViec();
              phienLamViecs = phienLamViecs.filter((d: any) => new Date(d.batDau).getDate() === new Date(Date.now()).getDate());
              setListPhienLamViec(phienLamViecs);
              setIsActive(!isActive);
            } catch (error) {
              console.log("failed", error);
            }
          }}
        >
          Kết Thúc
        </Button>
      </Form.Item>
      {listPhienLamViec.length > 0 && (
        <Table
          dataSource={listPhienLamViec.map((d: any, index: any) => ({ ...d, key: index }))}
          columns={[
            ...columnsTableListPhien,
            {
              title: "Trạng thái",
              dataIndex: "active",
              key: "active",
              render: (value: boolean, record: any, index) => {
                return <span key={index + value.toString()}>{value ? "Đang làm" : "Không làm"}</span>;
              },
            },
          ]}
        />
      )}
    </Form>
  );
};

export default DiemDanh;
