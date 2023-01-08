import { Button, Form, Input, message, Select, Tabs } from 'antd';
import React from 'react';
import covidService, { IDangKiThongTinVaccineInput } from '../../services/covidService';
const { Option } = Select;

const CovidCaNhan = () => {
  const onFinish = async (values: any) => {
    if (values) {
      console.log(typeof values.ngayKhaiBaoCovid);
      try {
        //kiểm tra dữ liệu và update csdl đăng kí thân nhiệt
        if (values.ngayGioDangKiThanNhiet && values.nhietDo) {
          let dangKiThanNhiet = await covidService.dangKiThongTinThanNhiet(
            values.ngayGioDangKiThanNhiet,
            values.nhietDo
          );
          message.success('Đăng kí thân nhiệt thành công');
        }

        //kiểm tra dữ liệu và update csdl đăng kí thân nhiệt
        if (
          values.ngayTiemVaccine1 &&
          values.tenVaccine1 &&
          values.ngayTiemVaccine2 &&
          values.tenVaccine2
        ) {
          const input: IDangKiThongTinVaccineInput = {
            ngayTiemVaccine1: values.ngayTiemVaccine1.label,
            tenVaccine1: values.tenVaccine1,
            ngayTiemVaccine2: values.ngayTiemVaccine2.label,
            tenVaccine2: values.tenVaccine2,
          };
          await covidService.dangKiThongTinVaccin(input);
          message.success('Đăng kí thông tin tiêm vaccine thành công');
        }

        //kiểm tra dữ liệu và update csdl dangKiDuongTinhCovid
        if (values.duongTinh && values.ngayKhaiBaoCovid) {
           await covidService.dangKiDuongTinhCovid(
            values.duongTinh.value,
            values.ngayKhaiBaoCovid
          );
          message.success('Đăng kí thông tin Covid thành công');
        }
      } catch (error) {
        message.error('đã có lỗi xảy ra: ' + error);
        console.log(error);
      }
    }
    console.log(values);
  };

  const onChange = (key: string) => {
    // console.log(key);
  };

  return (
    <div className='CovidCaNhan'>
      <Tabs
        defaultActiveKey='1'
        onChange={onChange}
        items={[
          {
            label: `Đăng kí thân nhiệt`,
            key: '1',
            children: (
              <div className='dangKiThanNhiet'>
                <h4> Đăng ký thông tin thân nhiệt</h4>
                <Form onFinish={onFinish}>
                  <Form.Item
                    name='ngayGioDangKiThanNhiet'
                    label='Chọn thời gian'
                    rules={[{ required: true }]}
                  >
                    <Input type='datetime-local' />
                  </Form.Item>
                  <Form.Item
                    label='Nhiệt độ'
                    name='nhietDo'
                    rules={[{ required: true }]}
                  >
                    <Input type='number' />
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                      type='primary'
                      danger
                      htmlType='submit'
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ),
          },
          {
            label: `Đăng ký thông tin tiêm vaccine`,
            key: '2',
            children: (
              <div className='dangKiThongTinTiem'>
                <h4>Đăng ký thông tin tiêm vaccine</h4>
                <Form onFinish={onFinish}>
                  <Form.Item
                    name='ngayTiemVaccine1'
                    label='Ngày tiêm mũi 1'
                    rules={[{ required: true }]}
                  >
                    <Input type='date' />
                  </Form.Item>
                  <Form.Item
                    name='tenVaccine1'
                    label='Tên loại vaccine 1'
                    rules={[{ required: true }]}
                  >
                    <Select
                      allowClear
                      placeholder='Chọn loại vaccine'
                    >
                      <Option value='AstraZeneca'>Vắc xin AstraZeneca</Option>
                      <Option value='Gam-Covid-Vac'>Vắc xin Gam-Covid-Vac</Option>
                      <Option value='VeroCell'> Vắc xin Vero Cell</Option>
                      <Option value='Moderna'>Vắc xin Spokevax (Moderna)</Option>
                      <Option value='Pfizer'> Vắc xin Pfizer</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name='ngayTiemVaccine2'
                    label='Ngày tiêm mũi 2'
                    rules={[{ required: true }]}
                  >
                    <Input type='date' />
                  </Form.Item>
                  <Form.Item
                    name='tenVaccine2'
                    label='Tên loại vaccine 2'
                    rules={[{ required: true }]}
                  >
                    <Select allowClear>
                      <Option value='AstraZeneca'>Vắc xin AstraZeneca</Option>
                      <Option value='Gam-Covid-Vac'>Vắc xin Gam-Covid-Vac</Option>
                      <Option value='VeroCell'> Vắc xin Vero Cell</Option>
                      <Option value='Moderna'> Vắc xin Spokevax (Moderna)</Option>
                      <Option value='Pfizer'> Vắc xin Pfizer</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                      type='primary'
                      danger
                      htmlType='submit'
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ),
          },
          {
            label: `Đăng ký thông tin dương tính với covid.`,
            key: '3',
            children: (
              <>
                <h4>Đăng ký thông tin dương tính với covid.</h4>
                <Form onFinish={onFinish}>
                  <Form.Item
                    name='ngayKhaiBaoCovid'
                    label='Ngày khai báo'
                    rules={[{ required: true }]}
                  >
                    <Input type='date' />
                  </Form.Item>
                  <Form.Item
                    name='duongTinh'
                    label='Chọn trạng thái'
                    rules={[{ required: true }]}
                  >
                    <Select
                      allowClear
                      labelInValue
                    >
                      <Option value={true}>Dương Tính</Option>
                      <Option value={false}>Âm Tính</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                      type='primary'
                      danger
                      htmlType='submit'
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CovidCaNhan;
