import React from "react";
import { Button, DatePicker, Form, Input, message, Switch } from "antd";
import nghiPhepService, { IDangKiNghiPhepInput } from "../../services/nghiPhepService";

const { RangePicker } = DatePicker;

const NghiPhep: React.FC = () => {
  const [nghiNhieuNgay, setNghiNhieuNgay] = React.useState(false);

  const onFinish = async (fieldsValue: any) => {
    try {
      // Should format date value before submit.
      const rangeValue = fieldsValue["range-picker"];
      if (nghiNhieuNgay) {
        const values = {
          lyDo: fieldsValue.lyDo,
          soGioNghi: Math.abs(new Date(rangeValue[0].format("YYYY-MM-DD")).getDate() - new Date(rangeValue[1].format("YYYY-MM-DD")).getDate()) * 8,
          ngayDangKiPhep: [rangeValue[0].format("YYYY-MM-DD"), rangeValue[1].format("YYYY-MM-DD")],
        };

        const input: IDangKiNghiPhepInput = {
          ngayDangKiPhep: values.ngayDangKiPhep,
          soGioNghi: values.soGioNghi,
          lyDo: values.lyDo,
        };
        let dangKiNghiPhep = await nghiPhepService.dangKiNghiPhep(input);

        console.log("dangKiNghiPhep:", dangKiNghiPhep);
        console.log("Success:", values);
        return;
      }
      const values = {
        lyDo: fieldsValue.lyDo,
        ngayDangKiPhep: [fieldsValue["date-picker"].format("YYYY-MM-DD")],
        soGioNghi: fieldsValue.soGioNghi,
      };
      const input: IDangKiNghiPhepInput = {
        ngayDangKiPhep: values.ngayDangKiPhep,
        soGioNghi: values.soGioNghi,
        lyDo: values.lyDo,
      };
      let dangKiNghiPhep = await nghiPhepService.dangKiNghiPhep(input);
      console.log("dangKiNghiPhep:", dangKiNghiPhep);
      console.log("Success:", values);
      return;
      message.success("Đăng kí phép thành công");
    } catch (error) {
      message.error("Lỗi");
    }
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
    rules: [{ type: "object" as const, required: true, message: "Please select time!" }],
  };

  const onChangeModeNghiPhep = (checked: boolean) => {
    setNghiNhieuNgay(!nghiNhieuNgay);
    console.log(`switch to ${checked}`);
  };

  return (
    <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
      <h4>Đăng kí nghỉ phép</h4>
      <span>
        <Switch onChange={onChangeModeNghiPhep} /> Nghỉ nhiều ngày
      </span>
      {nghiNhieuNgay && (
        <Form.Item name="range-picker" label="Chọn nhiều ngày" {...rangeConfig}>
          <RangePicker />
        </Form.Item>
      )}
      {!nghiNhieuNgay && (
        <>
          <Form.Item name="date-picker" label="Chọn ngày" {...config}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Số giờ nghỉ" name="soGioNghi" rules={[{ required: true, message: "Nhập số giờ nghỉ" }]}>
            <Input type="number" />
          </Form.Item>
        </>
      )}

      <Form.Item label="Lý do" name="lyDo" rules={[{ required: true, message: "Lý do nghỉ phép" }]}>
        <Input />
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
