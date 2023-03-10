import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import userService, { ILoginInput } from "../../services/userService";
import { useLocation, useNavigate } from "react-router-dom";
import form from "antd/es/form";
import AuthenticationStore from "../../stores/authenticationStore";
import { useStore } from "../../helpers/use-store";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { AuthenticationStore } = useStore();
  const location: any = useLocation();
  const [checkedRemember, setCheckedRemember] = React.useState(false);

  React.useEffect(() => {
   console.log( AuthenticationStore.isLogin())
  });

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    if (form.getFieldsError().filter(({ errors }) => errors.length === 0)) {
      const values = form.getFieldsValue();
      const input: ILoginInput = {
        username: values.username,
        password: values.password,
      };
      let result = await AuthenticationStore.login(input);
      console.log(result);

      // let { state } = location;
      // console.log(state);
      // window.location = state ? state.from.pathname : '/';
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const loginChange = () => {
    setCheckedRemember(!checkedRemember);
  };

  return (
    <>
      <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
        <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name="Remember" valuePropName="checked">
          <Checkbox checked={checkedRemember} onChange={() => loginChange()}>
            Nhớ đăng nhập
          </Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            // disabled={!form.isFieldsTouched(["Username", "Password"]) || form.getFieldsError().filter(({ errors }) => errors.length).length > 0}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
