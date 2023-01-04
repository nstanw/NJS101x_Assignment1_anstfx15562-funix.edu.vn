import React from "react";
import { Button, DatePicker, Form, Input } from "antd";

const { RangePicker } = DatePicker;

const NghiPhep: React.FC = () => {
  const [isRangePicker, setIsRangePicker] = React.useState(false);

  const onFinish = (fieldsValue: any) => {
    // Should format date value before submit.
    const rangeValue = fieldsValue["range-picker"];
    const values = {
      ...fieldsValue,
      'date': fieldsValue['date-picker'].format('YYYY-MM-DD'),
      "listDate": [
        rangeValue[0].format("YYYY-MM-DD"),
        rangeValue[1].format("YYYY-MM-DD"),
      ],
    };
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const rangeConfig = {
    rules: [
      {
        type: "array" as const,
        required: true,
        message: "Vui lòng chọn ngày",
      },
    ],
  };
  const config = {
    rules: [{ type: 'object' as const, required: true, message: 'Please select time!' }],
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item name="range-picker" label="Chọn nhiều ngày" {...rangeConfig}>
        <RangePicker />
      </Form.Item>

      <Form.Item name="date-picker" label="DatePicker" {...config}>
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Lý do"
        name="lyDo"
        rules={[{ required: true, message: "Lý do nghỉ phép" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Số giờ nghỉ"
        name="soGioNghi"
        rules={[{ required: true, message: "Nhập số giờ nghỉ" }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NghiPhep;
