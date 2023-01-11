import { Modal } from "antd";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";

// const qs = require("qs");
// const getToken: string = () => {
//   return "token";
// };

const http = axios.create({
  baseURL: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
  timeout: 30000,
});

const getToken = localStorage.getItem("token");
const token = "Bearer " + getToken;
console.log("Bearer " + getToken);
http.defaults.headers.common["Authorization"] = token;

http.interceptors.request.use(
  function (config) {
    // console.log(config);
    
    // config.headers.common["Authorization"] = "Bearer " + getToken;

    // config.headers = { ...config.headers } as AxiosHeaders;
    // config.headers.set('Authorization', "Bearer " + getToken);

    //       if (!!abp.auth.getToken()) {
    //       }
    //       config.headers.common['.AspNetCore.Culture'] = abp.utils.getCookieValue('Abp.Localization.CultureName');
    //       config.headers.common['Abp.TenantId'] = abp.multiTenancy.getTenantIdCookie();
    //       return config;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    // console.log(response);
    return response;
  },
  (error) => {
    // console.log(error);

    //xu li loi
    if (!!error.response && !!error.response.data.error && !!error.response.data.error.message && !!error.response.data.error.detail) {
      Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.detail,
      });
    } else if (!!error.response && !!error.response.data.error && !!error.response.data.error.message) {
      Modal.error({
        title: "Lỗi",
        content: error.response.data.error.message,
      });
    } else if (!error.response) {
      Modal.error({
        title: "Đã có lỗi xảy ra",
        content: error.message,
      });
    }

    setTimeout(() => {}, 1000);
  }
);

export default http;
