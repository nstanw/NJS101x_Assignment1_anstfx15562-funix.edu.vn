import React from "react";
import { Button, Form, Select } from "antd";

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
  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };


  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item label="Tên nhân viên">
        <span>Tên Nhân Viên</span>
      </Form.Item>
      <Form.Item
        name="noiLam"
        label="Nơi làm việc"
        rules={[{ required: true }]}
      >
        <Select
          allowClear
          labelInValue
        >
          <Option value="congTy">Công Ty</Option>
          <Option value="home">Nhà Riêng</Option>
          <Option value="khachHang">Khách hàng</Option>
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Điểm danh
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Kết Thúc
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DiemDanh;
