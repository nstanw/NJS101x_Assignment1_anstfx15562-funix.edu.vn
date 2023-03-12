import React from "react";
import { Button, DatePicker, Form, Input, InputNumber, message, Switch } from "antd";
import nghiPhepService, { IDangKiNghiPhepInput } from "../../services/nghiPhepService";
import { useNavigate } from "react-router-dom";
import form from "antd/es/form";

const { RangePicker } = DatePicker;

const NghiPhep: React.FC = () => {
  const [nghiNhieuNgay, setNghiNhieuNgay] = React.useState(false);
  const [soNgayPhepConLai, setSoNgayPhepConLai] = React.useState(0);
  const [soNgayPhepDangKi, setSoNgayPhepDangKi] = React.useState(0);
  const [isChange, setIsChange] = React.useState(false);

  const navigate = useNavigate();
  React.useEffect(() => {
    (async function run() {
      let getThongTinNghiPhepNV = await nghiPhepService.getThongTinNghiPhepNV();
      console.log(getThongTinNghiPhepNV);
      setSoNgayPhepConLai(getThongTinNghiPhepNV.annualLeave);
      if (getThongTinNghiPhepNV.annualLeave === 0) {
        message.error("Bạn đã đăng kí hết số phép trong năm!")
      }
    })();
  }, [soNgayPhepConLai, soNgayPhepDangKi, isChange, form]);

  const onFinish = async (fieldsValue: any) => {
    console.log("fieldsValue", fieldsValue);
    try {
      // Should format date value before submit.
      const rangeValue = fieldsValue["range-picker"];
      if (nghiNhieuNgay) {
        const values = {
          ngayStart: new Date(rangeValue[0]),
          ngayEnd: new Date(rangeValue[1]),
          soNgay: Math.abs(new Date(rangeValue[0].format("YYYY-MM-DD")).getDate() - new Date(rangeValue[1].format("YYYY-MM-DD")).getDate()) + 1,
          lyDo: fieldsValue.lyDo,
        };

        if (soNgayPhepConLai) {
          if (values.soNgay > soNgayPhepConLai) {
            return message.error("Số ngày phép đăng kí phải nhỏ hơn số ngày phép còn lại");
          }
          if (soNgayPhepConLai < 0) {
            return message.error("Bạn đã hết số phép quy định");
          }
        }
        setSoNgayPhepDangKi(values.soNgay);
        console.log(values);
        await nghiPhepService.dangKiNghiPhep(values);
        message.success("Đăng kí phép thành công");
        setIsChange(!isChange);
        return;
      }
      console.log(fieldsValue);

      if (fieldsValue.soGioNghi > 8 || fieldsValue.soGioNghi <= 0) {
        return message.error("Số giờ phải nhỏ hơn 8 và lớn hơn 0");
      }

      const input: IDangKiNghiPhepInput = {
        ngayStart: fieldsValue["date-picker"],
        ngayEnd: null,
        soNgay: fieldsValue.soGioNghi / 8,
        lyDo: fieldsValue.lyDo,
      };
      setSoNgayPhepDangKi( fieldsValue.soGioNghi/8);
      if (soNgayPhepConLai) {
        if (fieldsValue.soGioNghi / 8 > soNgayPhepConLai) {
          return message.error("Số ngày phép đăng kí phải nhỏ hơn số ngày phép còn lại");
        }
        if (soNgayPhepConLai < 0) {
          return message.error("Bạn đã hết số phép quy định");
        }
      }

      await nghiPhepService.dangKiNghiPhep(input);
      setIsChange(!isChange);
      message.success("Đăng kí phép thành công");
      return;
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
  };

  return (
    <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
      <h4>Đăng kí nghỉ phép</h4>
      <p>Số ngày phép còn lại : {soNgayPhepConLai && soNgayPhepConLai}</p>
      <p>Số ngày phép đăng kí : {soNgayPhepDangKi && soNgayPhepDangKi}</p>
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
          <Form.Item
            label="Số giờ nghỉ"
            name="soGioNghi"
            rules={[
              { required: true },
              {
                pattern: new RegExp(/^[0-9]+$/),
                min: 0,
                max: 8,
                message: "Nhập số giờ nghỉ, không được lớn hơn 8",
              },
            ]}
          >
            <InputNumber />
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
