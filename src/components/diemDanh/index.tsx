import React, { useEffect } from 'react';
import { Button, Card, Col, Descriptions, Form, message, Row, Select, Spin, Table } from 'antd';
import phienLamViecService from '../../services/phienLamViecService';
import { useNavigate } from 'react-router-dom';
import columnsTableListPhien from './colunm';
import ViewPhienLamViec from '../../Dtos/phienLamViec/phienlamviecDto';
import { useStore } from '../../helpers/use-store';
const { Option } = Select;

const DiemDanh: React.FC = () => {
  const { AuthenticationStore } = useStore();
  const { authentication } = AuthenticationStore;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isActive, setIsActive] = React.useState(false);
  const [phienHienTai, setPhienHienTai] = React.useState<any>();
  const [listEndPhiens, setListEndPhiens] = React.useState<any[]>();
  const [totalTime, setTotalTime] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const initialValues = {
    noiLam: 'congTy',
  };

  useEffect(() => {
    AuthenticationStore.isLogin();
  }, []);

  useEffect(() => {
    (async function run() {
      setIsLoading(true);
      let getAll: any[] = await phienLamViecService.getAll({
        ngay: new Date(Date.now()),
      });
      if (getAll) {
        let phienAvtive = getAll.filter((p) => p.active === true)[0];
        let listPhienEnd = getAll.filter((p) => p.active === false);

        setTotalTime(getAll.filter((s: any) => s.totalTime >= 0)[0].totalTime);
        setListEndPhiens(listPhienEnd);
        setPhienHienTai(phienAvtive);

        if (phienAvtive) {
          setIsActive(phienAvtive.active);
        }
        setIsLoading(false);
      } else {
        setTotalTime(0);
        setListEndPhiens([]);
        setIsLoading(false);
      }

    })();
  }, [isActive, form]);

  const onFinish = async (values: any) => {
    if (values) {
      try {
        setIsLoading(true);
        let phienLamViec = await phienLamViecService.diemDanh(values.noiLam);
        setPhienHienTai(phienLamViec);
        setIsActive(true);
        setIsLoading(false);
      } catch (error) {
        console.log('Failed:', error);
      }
    }
  };

  return (
    <Card>
      <Spin spinning={isLoading}>
        <Row>
          <Col span={24}>
            {isActive ? (
              <>
                <Descriptions title='Thông tin phiên làm việc'>
                  <Descriptions.Item label='Tên nhân viên'>{phienHienTai.name}</Descriptions.Item>
                  <Descriptions.Item label='Nơi làm'>
                    {phienHienTai.noiLam === 'congTy'
                      ? 'Công Ty'
                      : phienHienTai.noiLam === 'home'
                      ? 'Nhà riêng'
                      : 'Khách hàng'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Thời gian bắt đầu'>
                    {new Date(phienHienTai.startTime).toLocaleTimeString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Trạng thái'>
                    {phienHienTai.active ? 'Đang làm' : 'Không làm'}
                  </Descriptions.Item>
                </Descriptions>
                <Button
                  type='primary'
                  danger
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await phienLamViecService.ketThucPhienLamViec();
                      let getAll: any[] = await phienLamViecService.getAll({
                        ngay: new Date(Date.now()),
                        active: false,
                      });
                      setListEndPhiens(getAll);
                      setIsActive(false);
                      setIsLoading(false);
                    } catch (error) {
                      console.log('failure', error);
                    }
                  }}
                >
                  Kết thúc
                </Button>
              </>
            ) : (
              <Row>
                <Col span={24}>
                  <Form
                    form={form}
                    onFinish={onFinish}
                    initialValues={initialValues}
                  >
                    <Form.Item label='Tên nhân viên'>{authentication.name}</Form.Item>
                    <Form.Item
                      name='noiLam'
                      label='Nơi làm việc'
                      rules={[{ required: true }]}
                    >
                      <Select
                        allowClear
                        style={{ width: 200 }}
                      >
                        <Option
                          value='congTy'
                          key='congTy'
                        >
                          Công Ty
                        </Option>
                        <Option
                          value='home'
                          key='home'
                        >
                          Nhà Riêng
                        </Option>
                        <Option
                          value='khachHang'
                          key='khachHang'
                        >
                          Khách hàng
                        </Option>
                      </Select>
                    </Form.Item>
                    <Button
                      key='submit'
                      type='primary'
                      htmlType='submit'
                      onClick={() => {
                        try {
                          // setIsActive(false);
                        } catch (error) {}
                      }}
                    >
                      Điểm danh
                    </Button>
                  </Form>
                </Col>
                {!isActive && (
                  <Col span={24}>
                    <h3>Tổng thời gian làm: {totalTime}</h3>
                    <Table
                      columns={columnsTableListPhien}
                      dataSource={listEndPhiens}
                    />
                  </Col>
                )}
              </Row>
            )}
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default DiemDanh;
