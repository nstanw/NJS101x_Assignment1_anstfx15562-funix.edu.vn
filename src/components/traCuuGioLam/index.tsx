import { Form, Table } from 'antd';
import React from 'react';
import phienLamViecService from '../../services/phienLamViec/phienLamViecService';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface ITraCuuGioLamViec {
  name: String | null;
  noiLam: String | null;
  annualLeave?: Number | null;
  batDau: Date | null;
  ketThuc: Date | null;
  thoiGianLam: Number | null;
  active: Boolean;
}
type ITraCuuGioLamViecDto = ITraCuuGioLamViec[];

const TraCuuGioLam = () => {
  const [listTraCuuState, setListTraCuuState] =
    React.useState<ITraCuuGioLamViecDto>();

  React.useEffect(() => {
    (async function run() {
      try {
        let listTraCuuGioLam =
          await phienLamViecService.traCuuThongTinGioLamCongTy();
        setListTraCuuState(listTraCuuGioLam);
      } catch (error) {}
    })();
  },[]);

  const columnsTableListPhien = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nơi làm việc',
      dataIndex: 'noiLam',
      key: 'noiLam',
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'batDau',
      key: 'batDau',
      render: (batDau: Date) => {
        return <span>{new Date(batDau).toLocaleTimeString()}</span>;
      },
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'ketThuc',
      key: 'ketThuc',
      render: (ketThuc: Date) => {
        return <span>{new Date(ketThuc).toLocaleTimeString()}</span>;
      },
    },
    {
      title: 'Thời gian làm việc',
      dataIndex: 'thoiGianLam',
      key: 'thoiGianLam',
    },
    {
      title: 'Đăng kí nghỉ phép',
      dataIndex: 'annualLeave',
      key: 'annualLeave',
    },
  ];

  const onFinish = async (values: any) => {
    console.log(values);
  };

  return (
    <div className='traCuuGioLam'>
      <Form
        {...layout}
        name='control-hooks'
        onFinish={onFinish}
      >
        <h2>Danh sách giờ đã làm</h2>
        <Table
         
          dataSource={listTraCuuState}
          columns={[
            ...columnsTableListPhien,
            {
              title: 'Trạng thái',
              dataIndex: 'active',
              render: (value: boolean, record: any, index) => {
                return (
                  <span key={index}>{value ? 'Đang làm' : 'Không làm'}</span>
                );
              },
            },
          ]}
        />
      </Form>
    </div>
  );
};

export default TraCuuGioLam;
