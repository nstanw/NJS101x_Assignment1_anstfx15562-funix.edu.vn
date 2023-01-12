import { Button, Form, message, Select, Space, Table } from "antd";
import React from "react";
import phienLamViecService from "../../services/phienLamViecService";
import Search from "./search";
import { useNavigate } from "react-router-dom";
import quanLyService from "../../services/quanLyService";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

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

const QuanLyGioLam = () => {
  const [listTraCuuState, setListTraCuuState] = React.useState<any[]>();
  const [chiTietLuong, setChiTietLuong] = React.useState<any>();
  const [showLuong, setShowLuong] = React.useState(false);
  const [listFilter, setListFilter] = React.useState<any>(listTraCuuState);
  const [isFilter, setIsFilter] = React.useState(false);
  const [optioneNhanVien, setOptioneNhanVien]: any[] = React.useState();
  const navigate = useNavigate();

  React.useEffect(() => {
    (async function run() {
      let getNhanVienMinhQuanLy: any[] = await quanLyService.getNhanVienMinhQuanLy();
      // let optioneNhanVien = getNhanVienMinhQuanLy.map((nhanVien) => ({ label: nhanVien.name, key: nhanVien._id, value: nhanVien.idNhanVien }));
      console.log("getNhanVienMinhQuanLy", getNhanVienMinhQuanLy);
      // setOptioneNhanVien(optioneNhanVien);
    })();
  }, []);

  React.useEffect(() => {
    (async function run() {
      try {
        // get toàn bộ phiên về
        let listTraCuuGioLam = await phienLamViecService.traCuuThongTinGioLamCongTy();
        // if (!listTraCuuGioLam.isAuth) {
        //   message.error("Vui lòng đăng nhập!");
        //   return navigate("/login");
        // }
        // get các ngày có trong phiên
        const cacNgayCoTrongPhien: Set<number> = new Set(listTraCuuGioLam.map((date: any) => new Date(date.ngay).getDay()));

        // duyệt vào các ngày. tính thông tin lương
        let traCuuThongTin: any[] = [];
        let sum; // tổng giờ làm

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
      key: "namel",
    },
    {
      title: "Hệ số lương",
      dataIndex: "salaryScale",
      key: "salaryScalel",
    },
    {
      title: "Số ngày phép đã đăng kí",
      dataIndex: "annualLeave",
      key: "annualLeavel",
    },
    {
      title: "Số giờ tăng ca",
      dataIndex: "lamThem",
      key: "lamTheml",
    },
    {
      title: "Số giờ làm thiếu",
      dataIndex: "gioLamThieu",
      key: "gioLamThieul",
    },
  ];

  const handleChangeSelectThangLuong = async (value: any) => {
    try {
      console.log(value);
    } catch (error) {
      console.log("Failed:", error);
    }
  };
  const handleChangeSelectNhanVien = async (value: any) => {
    try {
      console.log(value);
     let gioLamNhanVien =  await phienLamViecService.traCuuThongTinGioLamNhanVien(value);
      console.log("gioLamNhanVien",gioLamNhanVien);
      
      
    } catch (error) {
      console.log("Failed:", error);
    }
  };

  return (
    <div className="traCuuGioLam">
      <Form {...layout} name="control-hooks">
        <span>
          Chọn nhân viên: <Space />
          <Select
            placeholder="Chọn nhân viên muốn kiểm tra"
            style={{ width: 120 }}
            onChange={handleChangeSelectNhanVien}
            options={optioneNhanVien ? optioneNhanVien.map((d: any) => ({ key: d.key, value: d.value, label: d.label })) : []}
          />
        </span>
        <Table
          style={{ padding: 10 }}
          dataSource={[chiTietLuong].map((d: any, index: any) => ({ ...d, key: index }))}
          columns={[
            ...columnsChiTietLuong,
            {
              title: "Lương",
              dataIndex: "luong",
              key: "luongl",
            },
          ]}
        />
      </Form>

      <Search
        handleSubmit={(active, q) => {
          const listFilter = listTraCuuState?.filter((d) => d.active === active);
          setListFilter(listFilter);
          setIsFilter(true);
        }}
        onCandle={() => setIsFilter(false)}
      />
      {!isFilter ? (
        <Form {...layout} name="control-hooks">
          <h2>Danh sách giờ đã làm</h2>
          <Table
            dataSource={listTraCuuState ? listTraCuuState.map((d: any, index: any) => ({ ...d, key: index })) : []}
            columns={[
              ...columnsTableListPhien,
              {
                title: "Trạng thái",
                dataIndex: "active",
                key: "active",
                render: (value: boolean, record: any, index) => {
                  return <span key={value.toString() + index.toString()}>{value ? "Đang làm" : "Không làm"}</span>;
                },
              },
            ]}
          />
        </Form>
      ) : (
        <Form {...layout} name="control-hooks">
          <h2>Danh sách giờ đã làm</h2>
          <Table
            dataSource={listFilter.map((d: any, index: any) => ({ ...d, key: index }))}
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
      <Button
        danger
        onClick={() => {
          const thangHienTai = new Date(Date.now()).getMonth() + 1;
          handleChangeSelectThangLuong(thangHienTai);
          setShowLuong(!showLuong);
        }}
      >
        Xem lương các tháng
      </Button>
      {showLuong && (
        <Form {...layout} name="control-hooks">
          <h2>Lương = salaryScale * 3000000 + (overTime - số giờ làm thiếu) * 200000</h2>
          <span>
            Chọn tháng xem lương: <Space />
            <Select
              defaultValue={`${new Date(Date.now()).getMonth() + 1}`}
              style={{ width: 120 }}
              onChange={handleChangeSelectThangLuong}
              options={[
                {
                  value: "1",
                  label: "Tháng 1",
                  key: "thang1",
                },
                {
                  value: "2",
                  label: "Tháng 2",
                  key: "thang2",
                },
                {
                  value: "3",
                  label: "Tháng 3",
                  key: "thang3",
                },
                {
                  value: "4",
                  label: "Tháng 4",
                  key: "thang4",
                },
                {
                  value: "5",
                  label: "Tháng 5",
                  key: "thang5",
                },
                {
                  value: "6",
                  label: "Tháng 6",
                  key: "thang6",
                },
                {
                  value: "7",
                  label: "Tháng 7",
                  key: "thang7",
                },
                {
                  value: "8",
                  label: "Tháng 8",
                  key: "thang8",
                },
                {
                  value: "9",
                  label: "Tháng 9",
                  key: "thang9",
                },
                {
                  value: "10",
                  label: "Tháng 10",
                  key: "thang10",
                },
                {
                  value: "11",
                  label: "Tháng 11",
                  key: "thang11",
                },
                {
                  value: "12",
                  label: "Tháng 12",
                  key: "thang12",
                },
              ]}
            />
          </span>
          <Table
            style={{ padding: 10 }}
            dataSource={[chiTietLuong].map((d: any, index: any) => ({ ...d, key: index }))}
            columns={[
              ...columnsChiTietLuong,
              {
                title: "Lương",
                dataIndex: "luong",
                key: "luongl",
              },
            ]}
          />
        </Form>
      )}
    </div>
  );
};

export default QuanLyGioLam;
