import "./Profile.css";
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Spin,
  message,
  Popconfirm,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

import { authUserSelector } from "../../redux/selectors/authSelectors";
import { logout } from "../../redux/slices/authSlice";

import {
  fetchProfileThunk,
  updateProfileThunk,
  deleteAccountThunk,
} from "../../redux/slices/userSlice";

import {
  profileSelector,
  profileLoadingSelector,
  profileUpdatingSelector,
  profileDeletingSelector,
} from "../../redux/selectors/userSelectors";

import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector(authUserSelector);
  const profile = useSelector(profileSelector);
  const loading = useSelector(profileLoadingSelector);
  const updating = useSelector(profileUpdatingSelector);
  const deleting = useSelector(profileDeletingSelector);

  const [open, setOpen] = useState(false);
  const [editField, setEditField] = useState(null); // "fullName" | "username" | "email" | "password"
  const [form] = Form.useForm();

  const userId = authUser?.id;

  console.log("in profile.jsx, user = ", authUser);

  useEffect(() => {
    if (userId) dispatch(fetchProfileThunk(userId));
  }, [dispatch, userId]);

  const displayUser = profile || authUser;

  const titleName = displayUser?.fullName || displayUser?.username || "User";
  const titleEmail = displayUser?.email || "";

  const avatarText = useMemo(() => {
    const s = (titleName || "").trim();
    return s ? s[0].toUpperCase() : "U";
  }, [titleName]);

  const openEdit = (field) => {
    setEditField(field);
    setOpen(true);

    if (field === "password") {
      form.setFieldsValue({ password: "", confirmPassword: "" });
      return;
    }

    form.setFieldsValue({
      value:
        field === "fullName"
          ? displayUser?.fullName || ""
          : field === "username"
            ? displayUser?.username || ""
            : field === "email"
              ? displayUser?.email || ""
              : "",
    });
  };

  const closeEdit = () => {
    setOpen(false);
    setEditField(null);
    form.resetFields();
  };

  const submitEdit = async () => {
    try {
      const values = await form.validateFields();

      if (!userId) {
        message.error("Chưa đăng nhập");
        return;
      }

      let payload = {};

      if (editField === "password") {
        payload = { password: values.password };
      } else if (editField === "fullName") {
        payload = { fullName: values.value.trim() };
      } else if (editField === "username") {
        payload = { username: values.value.trim() };
      } else if (editField === "email") {
        payload = { email: values.value.trim() };
      }

      const updated = await dispatch(
        updateProfileThunk({ userId, payload })
      ).unwrap();
      message.success("Cập nhật thành công!");
      closeEdit();

      // optional: if your app header uses authUser only, you may want to refresh auth from storage
      // (or you can add a setAuthUser action in authSlice later).
      // For now profile page itself uses `profile`, so UI here updates immediately.
      console.log("Updated user:", updated);
    } catch (err) {
      // validateFields throws object; thunk throws message string
      if (typeof err === "string") message.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    try {
      await dispatch(deleteAccountThunk(userId)).unwrap();
      message.success("Đã xóa tài khoản");
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      message.error(err || "Không thể xóa tài khoản");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div
            style={{ display: "flex", justifyContent: "center", padding: 40 }}
          >
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div style={{ padding: 40, textAlign: "center" }}>
            Không có dữ liệu người dùng.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <Avatar className="profile-avatar" size={72}>
            {avatarText}
          </Avatar>
          <div className="profile-header-text">
            <div className="profile-name">{titleName}</div>
            <div className="profile-email">{titleEmail}</div>
          </div>
        </div>

        <div className="profile-section-title">Thông tin cá nhân</div>

        <div className="profile-row">
          <div className="profile-row-left">
            <div className="profile-row-label">Tên</div>
            <div className="profile-row-value">
              {(displayUser.fullName || "").trim() || displayUser.username}
            </div>
          </div>
          <div
            className="profile-row-right"
            onClick={() => openEdit("fullName")}
          >
            Sửa
          </div>
        </div>

        <div className="profile-row">
          <div className="profile-row-left">
            <div className="profile-row-label">Tên đăng nhập</div>
            <div className="profile-row-value">{displayUser.username}</div>
          </div>
          <div
            className="profile-row-right"
            onClick={() => openEdit("username")}
          >
            Sửa
          </div>
        </div>

        <div className="profile-row">
          <div className="profile-row-left">
            <div className="profile-row-label">Địa chỉ Email</div>
            <div className="profile-row-value">{displayUser.email}</div>
          </div>
          <div className="profile-row-right" onClick={() => openEdit("email")}>
            Sửa
          </div>
        </div>

        <div className="profile-row profile-row--last">
          <div className="profile-row-left">
            <div className="profile-row-label">Mật khẩu</div>
            <div className="profile-row-value">••••••••••••••••</div>
          </div>
          <div
            className="profile-row-right"
            onClick={() => openEdit("password")}
          >
            Sửa
          </div>
        </div>

        <div className="profile-footer">
          <Popconfirm
            title="Xóa tài khoản?"
            description="Hành động này không thể hoàn tác."
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={handleDeleteAccount}
          >
            <Button danger className="delete-btn" loading={deleting}>
              Xóa tài khoản
            </Button>
          </Popconfirm>
        </div>
      </div>

      <Modal
        open={open}
        onCancel={closeEdit}
        onOk={submitEdit}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={updating}
        title={
          editField === "fullName"
            ? "Sửa tên"
            : editField === "username"
              ? "Sửa tên đăng nhập"
              : editField === "email"
                ? "Sửa email"
                : "Đổi mật khẩu"
        }
      >
        <Form form={form} layout="vertical">
          {editField !== "password" ? (
            <Form.Item
              label="Giá trị"
              name="value"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin" },
                ...(editField === "username"
                  ? [{ min: 3, message: "Tối thiểu 3 ký tự" }]
                  : []),
                ...(editField === "email"
                  ? [{ type: "email", message: "Email không hợp lệ" }]
                  : []),
              ]}
            >
              <Input />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp"));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
