import React from "react";
import { Button, Form, Input, Select } from "antd";

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

  const onGenderChange = (value: string) => {
    switch (value) {
      case "male":
        form.setFieldsValue({ note: "Hi, man!" });
        return;
      case "female":
        form.setFieldsValue({ note: "Hi, lady!" });
        return;
      case "other":
        form.setFieldsValue({ note: "Hi there!" });
        break;
      default:
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: "Hello world!",
      gender: "male",
    });
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="note" label="Tên nhân viên" rules={[{ required: true }]}>
        <span>Tên Nhân Viên</span>
      </Form.Item>
      <Form.Item
        name="gender"
        label="Nơi làm việc"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Chọn nơi làm việc"
          onChange={onGenderChange}
          allowClear
        >
          <Option value="male">Công Ty</Option>
          <Option value="female">Nhà Riêng</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.gender !== currentValues.gender
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("gender") === "other" ? (
            <Form.Item
              name="customizeGender"
              label="Customize Gender"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          ) : null
        }
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
