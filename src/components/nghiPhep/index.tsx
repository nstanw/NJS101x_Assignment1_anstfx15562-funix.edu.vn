import React from "react";
import { Button, DatePicker, Form, Input, message, Switch } from "antd";
import nghiPhepService, { IDangKiNghiPhepInput } from "../../services/nghiPhepService";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const NghiPhep: React.FC = () => {
  const [nghiNhieuNgay, setNghiNhieuNgay] = React.useState(false);
  const [soNgayPhepConLai, setSoNgayPhepConLai] = React.useState(0);
  const [soNgayPhepDangKi, setSoNgayPhepDangKi] = React.useState(0);
  const [isChange, setIsChange] = React.useState(false);

  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    (async function run() {
      let PhepConLai = await nghiPhepService.getNgayPhepConLai();
      setSoNgayPhepConLai(PhepConLai.soNgayPhepConLai);
    })();
  }, [soNgayPhepConLai, soNgayPhepDangKi, isChange]);
  const onFinish = async (fieldsValue: any) => {
    console.log("fieldsValue", fieldsValue);
    try {
      // Should format date value before submit.
      const rangeValue = fieldsValue["range-picker"];
      if (nghiNhieuNgay) {
        const values = {
          lyDo: fieldsValue.lyDo,
          gio: Math.abs(new Date(rangeValue[0].format("YYYY-MM-DD")).getDate() - new Date(rangeValue[1].format("YYYY-MM-DD")).getDate()),
          ngayDangKiPhep: [rangeValue[0].format("YYYY-MM-DD"), rangeValue[1].format("YYYY-MM-DD")],
        };

        if (soNgayPhepConLai && values.gio > soNgayPhepConLai) {
          return message.error("Số ngày phép đăng kí phải nhỏ hơn số ngày phép còn lại");
        }
        if (soNgayPhepConLai && soNgayPhepConLai < 0) {
          return message.error("Bạn đã hết số phép quy định");
        }

        const input: IDangKiNghiPhepInput = {
          ngay: values.ngayDangKiPhep.toString(),
          gio: 8,
          lyDo: values.lyDo,
        };
        console.log("input", input);
        setSoNgayPhepDangKi(values.ngayDangKiPhep.length);
        await nghiPhepService.dangKiNghiPhep(input);
        message.success("Đăng kí phép thành công");
        setIsChange(!isChange);

        return;
      }

      if (fieldsValue.soGioNghi > 8 || fieldsValue.soGioNghi <= 0) {
        return message.error("Số giờ phải nhỏ hơn 8 và lớn hơn 0");
      }

      const values = {
        lyDo: fieldsValue.lyDo,
        ngayDangKiPhep: fieldsValue["date-picker"].format("YYYY-MM-DD"),
        soNgayDangKiNghi: fieldsValue.soGioNghi,
      };

      const input: IDangKiNghiPhepInput = {
        ngay: values.ngayDangKiPhep,
        gio: values.soNgayDangKiNghi,
        lyDo: values.lyDo,
      };
      setSoNgayPhepDangKi(values.soNgayDangKiNghi);
      if (soNgayPhepConLai && values.soNgayDangKiNghi > soNgayPhepConLai) {
        return message.error("Số ngày phép đăng kí phải nhỏ hơn số ngày phép còn lại");
      }
      if (soNgayPhepConLai && soNgayPhepConLai < 0) {
        return message.error("Bạn đã hết số phép quy định");
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
