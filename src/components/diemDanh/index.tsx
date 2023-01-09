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
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isActive, setIsActive] = React.useState(false);
  const [phienLamViecHienTai, setPhienLamViecHienTai] = React.useState<any>();
  const [name, setName] = React.useState<any>();
  const [listPhienLamViec, setListPhienLamViec] = React.useState([]);

  // check active
  React.useEffect(() => {
    (async function run() {
      const result = await phienLamViecService.getActive();
      // if (!result.isAuth) {
      //   message.error("Vui lòng đăng nhập!");
      //   return navigate("/login");
      // }
      setPhienLamViecHienTai(result);
      if (result[0].active && result[0].name) {
        setName(result[0].name);
        return setIsActive(result[0].active);
      }
      setIsActive(false);
    })();
  }, []);

  const onFinish = async (values: any) => {
    setIsActive(!isActive);
    if (values) {
      try {
        let phienLamViecHienTai = await phienLamViecService.addPhienLamViec(values.noiLam.label);
        setPhienLamViecHienTai(phienLamViecHienTai);
      } catch (error) {
        console.log("Failed:", error);
      }
    }
  };

  const columnsTablePhienHienTai = [
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
        <Table
          pagination={false}
          dataSource={phienLamViecHienTai.map((d: any, index: any) => ({ ...d, key: index }))}
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
