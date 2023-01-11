import * as React from "react";
import { Row, Col, Form } from "antd";

const QuanLy: React.FC = () => {
  React.useEffect(() => {});
  return (
    <>
      <Form>
        <Row gutter={24}>
          <Col key="q" span={12}>
            {/* <Form.Item label="Tìm kiếm" name="q">
            <Input placeholder="Tìm kiếm" />
          </Form.Item> */}
          </Col>
          <Col key="idQuanLy" span={12}>
            <Form.Item label="ID quản lý" name="active">
              <span></span>
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
            <Form.Item label="Tên quản lý" name="active">
              <span></span>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default QuanLy;
