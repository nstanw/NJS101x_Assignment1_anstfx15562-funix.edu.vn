import React, { useState } from "react";
import {
  Avatar,
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  message,
  Modal,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import nhanVienService from "../../services/nhanVienService";
import { type } from "@testing-library/user-event/dist/type";

type INhanVien = {
  annualLeave: number;
  department: string;
  doB: string;
  image: string;
  name: string;
  salaryScale: number;
  startDate: string;
  _id: string;
};

const EditThongTinCaNhan: React.FC = () => {
  const [nhanVien, setNhanVien] = useState<INhanVien>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkImage, setLinkImage] = useState();
  const [form] = Form.useForm();

  const getInfo = async function run() {
    let nhanVienInfo = await nhanVienService.getNhanVien();
    setNhanVien({
      ...nhanVienInfo,
      doB: new Date(nhanVienInfo.doB).toLocaleDateString(),
      startDate: new Date(nhanVienInfo.startDate).toLocaleDateString(),
    });
    console.log(nhanVienInfo);
  };

  React.useEffect(() => {
    getInfo();
  }, []);

  const onFinish = async (values: any) => {
    form.resetFields();
    try {
      await nhanVienService.editLinkImage(values.image);
      setLinkImage(values.image);
      console.log(values.image);

      getInfo();
      message.success("Đã thay đổi link ảnh thành công");
    } catch (error) {
      console.log("Failed to edit link image:", error);
    }
    console.log(values);
    setIsModalOpen(false);
  };

  return (
    <>
      {nhanVien && (
        <>
          <Modal
            title="Thay đổi hình ảnh"
            open={isModalOpen}
            footer={false}
            onCancel={() => setIsModalOpen(false)}
          >
            <Form onFinish={onFinish}>
              <Form.Item name="image" label="Nhập đường dẫn hình ảnh">
                <Input allowClear />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
                <Button  danger htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            // src={"data:image/jpeg;base64,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"}
            onClick={() => setIsModalOpen(true)}
            src={nhanVien.image}
          />
          <Descriptions title="User Info">
            <Descriptions.Item label="Id">{nhanVien?._id}</Descriptions.Item>
            <Descriptions.Item label="name">{nhanVien?.name}</Descriptions.Item>
            <Descriptions.Item label="doB">{nhanVien?.doB}</Descriptions.Item>
            <Descriptions.Item label="salaryScale">
              {nhanVien?.salaryScale}
            </Descriptions.Item>
            <Descriptions.Item label="startDate">
              {nhanVien?.startDate}
            </Descriptions.Item>
            <Descriptions.Item label="department">
              {nhanVien?.department}
            </Descriptions.Item>
            <Descriptions.Item label="annualLeave">
              {nhanVien?.annualLeave}
            </Descriptions.Item>
            {/* <Descriptions.Item label="image">
              {nhanVien?.image}
            </Descriptions.Item> */}
          </Descriptions>
        </>
      )}
    </>
  );
};

export default EditThongTinCaNhan;
