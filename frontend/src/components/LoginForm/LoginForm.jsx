import "./LoginForm.css";
import logo from "../../assets/logo.png";
import { Divider, Form, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import { registerThunk } from "../../redux/slices/authSlice";
// import { registerLoadingSelector } from "../../redux/selectors/authSelectors";

const LoginForm = () => {
  //   const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const loading = useSelector(registerLoadingSelector);
  const [form] = Form.useForm();

  const goToRegister = () => {
    navigate("/register");
  };

  const onFinish = async (values) => {
    console.log("Received values:", values);
    // const payload = {
    //   username: (values.username || "").trim(),
    //   email: (values.email || "").trim(),
    //   password: values.password,
    // };

    try {
      //   const createdUser = await dispatch(registerThunk(payload)).unwrap();
      message.success("Tạo tài khoản thành công!");
      //   console.log("Created user:", createdUser);

      form.resetFields();
      // TODO: navigate("/login");
    } catch (errMsg) {
      message.error(errMsg || "Đăng ký thất bại");
    }
  };

  return (
    <div className="login-form-container">
      <div className="content-wrapper">
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <div className="login-by-google">
          <div className="icon-wapper">
            <FcGoogle className="icon" />
          </div>
          <div className="text">Đăng nhập bằng Google</div>
        </div>

        <Divider className="divider">Đăng nhập bằng tên đăng nhập</Divider>

        <Form
          className="login-form"
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {/* <Form.Item
            label="Tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input className="name-input form-input" placeholder="" />
          </Form.Item> */}

          {/* <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9]{9,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input className="phone-input form-input" placeholder="" />
          </Form.Item> */}

          {/* <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input className="email-input form-input" placeholder="" />
          </Form.Item> */}

          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập" },
              { min: 3, message: "Tối thiểu 3 ký tự" },
            ]}
          >
            <Input className="username-input form-input" placeholder="" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              className="password-input form-input"
              placeholder="6+ kí tự"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Button
            htmlType="submit"
            className="login-submit-btn"
            // loading={loading}
            block
          >
            Đăng nhập
          </Button>
        </Form>
        <div className="register-question">
          Bạn chưa có tài khoản?{" "}
          <span className="register-text" onClick={goToRegister}>
            Đăng kí ngay
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
