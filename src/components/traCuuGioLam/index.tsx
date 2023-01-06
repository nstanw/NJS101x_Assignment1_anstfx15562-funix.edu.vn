import { Form, message, Select, Space, Table } from "antd";
import React from "react";
import nghiPhepService from "../../services/nghiPhepService";
import phienLamViecService from "../../services/phienLamViecService";
import Search from "./search";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface IChiTietLuong {
  name: String;
  salaryScale: number;
  annualLeave?: number | null;
  thoiGianLam?: number | null;
  gioLamThieu?: number | null;
  lamThem?: number | null;
  luong: number;
}
//- Hiển thị thông tin chi tiết lương tháng (chọn được tháng muốn xem). Lương = salaryScale * 3000000 + (overTime - số giờ làm thiếu) * 200000.
//  Số giờ làm còn thiếu là khi chưa đủ 8h/ngày kể cả đã cộng annualLeave của ngày đó. Hiển thị chi tiết thông tin trong công thức trên.
interface ITraCuuGioLamViec {
  ngay: Date;
  name: String;
  noiLam: String;
  annualLeave?: number;
  batDau: Date;
  ketThuc?: Date | null;
  thoiGianLam?: number | null;
  lamThem?: number | null;
  active: Boolean;
  salaryScale: number;
}
type ITraCuuGioLamViecDto = ITraCuuGioLamViec[];

const TraCuuGioLam = () => {
  const [listTraCuuState, setListTraCuuState] = React.useState<any[]>();
  const [chiTietLuong, setChiTierLuong] = React.useState<any>();
  const [listFilter, setListFilter] = React.useState<any>(listTraCuuState);
  const [isFilter, setIsFilter] = React.useState(false);
  const [thongTinNghiPhep, setThongTinNghiPhep] = React.useState<number>();

  React.useEffect(() => {
    (async function run() {
      try {
        // get toàn bộ phiên về
        let listTraCuuGioLam = await phienLamViecService.traCuuThongTinGioLamCongTy();
        let thongTinNghiPhepNV = await nghiPhepService.getThongTinNghiPhepNV();
        setThongTinNghiPhep(thongTinNghiPhepNV);

        // get các ngày có trong phiên
        const cacNgayCoTrongPhien: Set<number> = new Set(listTraCuuGioLam.map((date: any) => new Date(date.ngay).getDay()));

        // duyệt vào các ngày. tính thông tin lương
        let traCuuThongTin: any[] = [];
        let chiTietLuong: IChiTietLuong;
        let sum; // tổng giờ làm
        let gioLamThieu;

        //#region  Tra cứu giờ làm

        cacNgayCoTrongPhien.forEach((ngay) => {
          // nhóm các phiên làm trong ngày vào 1 mảng
          const listPhienCuaNgayCuThe: ITraCuuGioLamViecDto = listTraCuuGioLam.filter((date: any) => new Date(date.ngay).getDay() === ngay);

          // Kiểm tra  trong ngày còn đang làm hay không
          let checkActiveCuaPhienNgayCuThe = listPhienCuaNgayCuThe.filter((phien: any) => phien.active === false);

          //Nếu không có phiên nào hoạt động
          if (listPhienCuaNgayCuThe.length === checkActiveCuaPhienNgayCuThe.length) {
            // nếu phiên cuối thì tính thời gian làm trong ngày
            const thoiGianLamTrongNgay = listPhienCuaNgayCuThe.map((thoiGianLam) => thoiGianLam.thoiGianLam);
            sum = thoiGianLamTrongNgay.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);

            let lamThemGio = sum < 8 ? 0 : sum - 8;
            // dữ liệu render ra UI
            let rowTraCuuGioLamViec = {
              ...checkActiveCuaPhienNgayCuThe[0],
              ketThuc: checkActiveCuaPhienNgayCuThe[checkActiveCuaPhienNgayCuThe.length - 1].ketThuc,
              thoiGianLam: Math.round(sum * 100) / 100,
              lamThem: lamThemGio,
            };
            traCuuThongTin.push(rowTraCuuGioLamViec);
            setListTraCuuState(traCuuThongTin);

            let lamThem: number;
            let gioLamThieu: number;
            if (sum && sum > 8) {
              lamThem = Math.round(sum * 100) / 100 - 8;
              gioLamThieu = 0;
            } else {
              lamThem = 0;
              gioLamThieu = 8 - Math.round(sum * 100) / 100;
            }

            chiTietLuong = {
              name: checkActiveCuaPhienNgayCuThe[0].name,
              annualLeave: thongTinNghiPhepNV.soPhepDangKi,
              lamThem: lamThem,
              gioLamThieu: gioLamThieu - thongTinNghiPhepNV.soPhepDangKi,
              thoiGianLam: Math.round(sum * 100) / 100,
              salaryScale: checkActiveCuaPhienNgayCuThe[0].salaryScale,
              luong: checkActiveCuaPhienNgayCuThe[0].salaryScale * 3000000 + (lamThem - (gioLamThieu - thongTinNghiPhepNV.soPhepDangKi)) * 200000,
            };
            setChiTierLuong(chiTietLuong);
            return;
          }
          // dữ liệu render ra UI
          let rowTraCuuGioLamViec = {
            ...listPhienCuaNgayCuThe[0],
            ketThuc: null,
            thoiGianLam: null,
            active: true,
            lamThem: null,
          };
          traCuuThongTin.push(rowTraCuuGioLamViec);
          setListTraCuuState(traCuuThongTin);
          return;
        });
        //#endregion
      } catch (error) {
        console.log("Failed:", error);
      }
    })();
  }, []);

  const columnsTableListPhien = [
    {
      title: "Ngày",
      dataIndex: "ngay",
      key: "ngay",
      render: (ngay: Date) => {
        return <span>{new Date(ngay).toLocaleDateString()}</span>;
      },
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nơi làm việc",
      dataIndex: "noiLam",
      key: "noiLam",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "batDau",
      key: "batDau",
      render: (batDau: Date) => {
        return <span>{new Date(batDau).toLocaleTimeString()}</span>;
      },
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "ketThuc",
      key: "ketThuc",
      render: (ketThuc: Date) => {
        return <span>{ketThuc ? new Date(ketThuc).toLocaleTimeString() : "--"}</span>;
      },
    },
    {
      title: "Thời gian làm việc",
      dataIndex: "thoiGianLam",
      key: "thoiGianLam",
    },
    {
      title: "Thêm giờ",
      dataIndex: "lamThem",
      key: "lamThem",
    },
    {
      title: "Đăng kí nghỉ phép",
      dataIndex: "annualLeave",
      key: "annualLeave",
    },
  ];

  const columnsChiTietLuong = [
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hệ số lương",
      dataIndex: "salaryScale",
      key: "salaryScale ",
    },
    {
      title: "Số ngày phép đã đăng kí",
      dataIndex: "annualLeave",
      key: "annualLeave",
    },
    {
      title: "Số giờ tăng ca",
      dataIndex: "lamThem",
      key: "lamThem",
    },
    {
      title: "Số giờ làm thiếu",
      dataIndex: "gioLamThieu",
      key: "gioLamThieu",
    },
  ];

  const onFinish = async (values: any) => {
    console.log(values);
  };

  const handleChangeSelectThangLuong = (value: string) => {
    
    console.log(`selected ${value}`);
  };

  return (
    <div className="traCuuGioLam">
      <Search
        handleSubmit={(active, q) => {
          const listFilter = listTraCuuState?.filter((d) => d.active === active);
          setListFilter(listFilter);
          setIsFilter(true);
          console.log("listDangLam", listFilter);
        }}
        onCandle={() => setIsFilter(false)}
      />
      {!isFilter ? (
        <Form {...layout} name="control-hooks" onFinish={onFinish}>
          <h2>Danh sách giờ đã làm</h2>
          <Table
            dataSource={listTraCuuState}
            columns={[
              ...columnsTableListPhien,
              {
                title: "Trạng thái",
                dataIndex: "active",
                render: (value: boolean, record: any, index) => {
                  return <span key={index}>{value ? "Đang làm" : "Không làm"}</span>;
                },
              },
            ]}
          />
        </Form>
      ) : (
        <Form {...layout} name="control-hooks" onFinish={onFinish}>
          <h2>Danh sách giờ đã làm</h2>
          <Table
            dataSource={listFilter}
            columns={[
              ...columnsTableListPhien,
              {
                title: "Trạng thái",
                dataIndex: "active",
                render: (value: boolean, record: any, index) => {
                  return <span key={index}>{value ? "Đang làm" : "Không làm"}</span>;
                },
              },
            ]}
          />
        </Form>
      )}
      <Form {...layout} name="control-hooks" onFinish={onFinish}>
        <h2>Lương = salaryScale * 3000000 + (overTime - số giờ làm thiếu) * 200000</h2>
        <span > Chọn tháng xem lương: < Space/>
          <Select
            defaultValue={`${new Date(Date.now()).getMonth() + 1}`}
            style={{ width: 120 }}
            onChange={handleChangeSelectThangLuong}
            options={[
              {
                value: "1",
                label: "Tháng 1",
                key: "1",
              },
              {
                value: "2",
                label: "Tháng 2",
                key: "2",
              },
              {
                value: "3",
                label: "Tháng 3",
                key: "3",
              },
              {
                value: "4",
                label: "Tháng 4",
                key: "4",
              },
              {
                value: "5",
                label: "Tháng 5",
                key: "5",
              },
              {
                value: "6",
                label: "Tháng 6",
                key: "6",
              },
              {
                value: "7",
                label: "Tháng 7",
                key: "7",
              },
              {
                value: "8",
                label: "Tháng 8",
                key: "8",
              },
              {
                value: "9",
                label: "Tháng 9",
                key: "9",
              },
              {
                value: "10",
                label: "Tháng 10",
                key: "10",
              },
              {
                value: "11",
                label: "Tháng 11",
                key: "11",
              },
              {
                value: "12",
                label: "Tháng 12",
                key: "12",
              },
            ]}
          />
        </span>
        <Table
        style={{padding: 10}}
          dataSource={[chiTietLuong]}
          columns={[
            ...columnsChiTietLuong,
            {
              title: "Lương",
              dataIndex: "luong",
            },
          ]}
        />
      </Form>
    </div>
  );
};

export default TraCuuGioLam;
