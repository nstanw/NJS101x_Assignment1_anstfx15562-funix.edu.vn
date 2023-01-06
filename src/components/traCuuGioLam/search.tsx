import * as React from "react";
import { Button, Row, Col, Form, Input, Select } from "antd";
import { useForm } from "antd/lib/form/Form";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const { Option } = Select;

export interface IFilterDto {
  property: string;
  value: any;
 operator: string;
}

interface ISearch {
  handleSubmit: (active : boolean, q: any) => void;
  onCandle: () => void;
}

const Search : React.FC<ISearch> = ({handleSubmit,onCandle}) => {
  const [form] = useForm();

  const onFinish = async (values: any) => {
   
    console.log(values);
    await handleSubmit(values.active, values.q);
  };
  const resetForm = async () => {
    form.resetFields();
    let values = form.getFieldsValue();
    await onFinish(values);
    onCandle();
  };
  return (
    <Form {...layout} form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish} initialValues={{ active: false }}>
      <Row gutter={24}>
        <Col key="q" span={12}>
          {/* <Form.Item label="Tìm kiếm" name="q">
            <Input placeholder="Tìm kiếm" />
          </Form.Item> */}
        </Col>
        <Col key="active" span={12}>
          <Form.Item label="Trạng thái" name="active">
            <Select placeholder="Trạng thái" style={{ width: 420 }}>
              <Option value={false}>Không làm</Option>
              <Option value={true}>Đang làm</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>{/* <DialogCreateVatTuHangHoa onDone={async () => await resetForm()} /> */}</Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              resetForm();
            }}
          >
            Xóa bộ lọc
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default Search;
