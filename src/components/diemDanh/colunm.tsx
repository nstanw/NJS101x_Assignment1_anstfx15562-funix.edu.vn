import * as React from "react";
import momemnt from "moment";
import { tableColumnTextFilterConfig } from "../../helpers/tableColumnTextFilterConfig";
import moment from "moment";

const columnsTableListPhien = [
  // {
  //   title: "Tên nhân viên",
  //   dataIndex: "name",
  //   key: "name",
  // },
  {
    title: "Ngày",
    dataIndex: "ngay",
    key: "ngay",
    render: (ngay: Date) => {
      return <span>{moment(ngay).format("DD/MM/YYYY")}</span>;
    },
    ...tableColumnTextFilterConfig(),
    onFilter: (value: any, record: any) => {
      return moment(record.ngay).format("DD/MM/YYYY").toString().toLowerCase().includes(value.toString().toLowerCase());
    },
    sorter: (a: any, b: any) => {
      return new Date(a.ngay).getTime() - new Date(b.ngay).getTime();
    },
    ellipsis: true,
  },
  {
    title: "Nơi làm việc",
    dataIndex: "noiLam",
    key: "noiLam",
    filters: [
      {
        text: "Công Ty",
        value: "congTy",
      },
      {
        text: "Nhà riêng",
        value: "home",
      },
      {
        text: "Khách hàng",
        value: "khachHang",
      },
    ],
    onFilter: (value: any, record: any) => record.noiLam.startsWith(value),
    filterSearch: true,
    render: (noiLam: string) => {
      return <span>{noiLam === "congTy" ? "Công Ty" : noiLam === "home" ? "Nhà riêng" : "Khách hàng"}</span>;
    },
  },
  // {
  //   title: "Quản lý",
  //   dataIndex: "quanLy",
  //   key: "quanLy",
  // },
  {
    title: "Thời gian bắt đầu",
    dataIndex: "startTime",
    key: "startTime",
    render: (startTime: Date) => {
      return <span>{new Date(startTime).toLocaleTimeString()}</span>;
    },
    ...tableColumnTextFilterConfig(),
    onFilter: (value: any, record: any) => {
      return moment(record.startTime).format("hh:mm A").toString().toLowerCase().includes(value.toString().toLowerCase());
    },
    sorter: (a: any, b: any) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    },
    ellipsis: true,
  },
  {
    title: "Thời gian kết thúc",
    dataIndex: "endTime",
    key: "endTime",
    render: (endTime: Date) => {
      return <span>{new Date(endTime).toLocaleTimeString()}</span>;
    },
    ...tableColumnTextFilterConfig(),
    onFilter: (value: any, record: any) => {
      return moment(record.endTime).format("hh:mm A").toString().toLowerCase().includes(value.toString().toLowerCase());
    },
    sorter: (a: any, b: any) => {
      return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    },
    ellipsis: true,
  },
  {
    title: "Thời gian làm việc",
    dataIndex: "tongThoiGian",
    key: "tongThoiGian",
    sorter: (a: any, b: any) => {
      return a.tongThoiGian - b.tongThoiGian;
    },
    ...tableColumnTextFilterConfig(),
    onFilter: (value: any, record: any) => {
      return record.tongThoiGian.toString().toLowerCase().includes(value.toString().toLowerCase());
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "active",
    key: "active",
    render: (value: boolean, record: any, index: any) => {
      return <span key={index}>{value ? "Đang làm" : "Không làm"}</span>;
    }
  },
];

export default columnsTableListPhien;
