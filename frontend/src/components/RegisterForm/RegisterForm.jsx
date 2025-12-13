import "./RegisterForm.css";
import logo from "../../assets/logo.png";
import { Divider, Form, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerThunk } from "../../redux/slices/authSlice";
import { registerLoadingSelector } from "../../redux/selectors/authSelectors";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(registerLoadingSelector);
  const [form] = Form.useForm();

  const goToLogin = () => {
    navigate("/login");
  };

  const onFinish = async (values) => {
    const payload = {
      username: (values.username || "").trim(),
      email: (values.email || "").trim(),
      password: values.password,
    };

    try {
      const createdUser = await dispatch(registerThunk(payload)).unwrap();
      message.success("Tạo tài khoản thành công!");
      console.log("Created user:", createdUser);

      form.resetFields();
      // TODO: navigate("/login");
    } catch (errMsg) {
      message.error(errMsg || "Đăng ký thất bại");
    }
  };

  return (
    <div className="register-form-container">
      <div className="content-wrapper">
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <div className="register-by-google">
          <div className="icon-wapper">
            <FcGoogle className="icon" />
          </div>
          <div className="text">Đăng ký bằng Google</div>
        </div>

        <Divider className="divider">hoặc đăng ký bằng số điện thoại</Divider>

        <Form
          className="register-form"
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input className="name-input form-input" placeholder="" />
          </Form.Item>

          <Form.Item
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
          </Form.Item>

          {/* ✅ NEW: email field (backend requires IsEmail) */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input className="email-input form-input" placeholder="" />
          </Form.Item>

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
            className="register-submit-btn"
            loading={loading}
            block
          >
            Tạo tài khoản
          </Button>
        </Form>
        <div className="login-question">
          Bạn đã có tài khoản?{" "}
          <span className="login-text" onClick={goToLogin}>
            Đăng nhập
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
