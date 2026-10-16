import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import mockUsers from "../../mock/mockUsers.json";
import logoImg from "../../assets/Logo.png";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Đang kiểm tra thông tin...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = mockUsers.find(
        (u) =>
          u.username === credentials.username &&
          u.password === credentials.password,
      );

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          name: foundUser.ho_ten,
          role: foundUser.role,
        };

        login(userData, foundUser.token);
        toast.success(`Chào mừng ${foundUser.ho_ten}!`, { id: toastId });

        navigate("/");
      } else {
        toast.error("Sai tên đăng nhập hoặc mật khẩu!", { id: toastId });
      }
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      toast.error("Lỗi đăng nhập", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-brand-text-secondary flex min-h-screen flex-col bg-transparent font-sans">
      <header className="border-brand-border-dark/60 bg-brand-dark/85 flex h-20 shrink-0 items-center justify-between border-b px-8 shadow-md backdrop-blur-md">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => navigate("/")}
        >
          <img
            src={logoImg}
            alt="FleetGuard Logo"
            className="h-10 w-10 object-contain drop-shadow"
          />
          <div>
            <h1 className="text-brand-text-primary text-xl font-black tracking-tight">
              FleetGuard
            </h1>
            <p className="text-brand-blue-sky text-[10px] font-bold tracking-widest uppercase">
              Telematics & Safety
            </p>
          </div>
        </div>
      </header>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8">
        {/* Khối thẻ đăng nhập nổi trên lớp nền ảnh của body */}
        <div className="card-glass border-brand-border relative z-10 w-full max-w-md rounded-3xl border p-10 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <img
              src={logoImg}
              alt="FleetGuard Logo"
              className="mx-auto mb-3 h-14 w-14 object-contain drop-shadow"
            />
            <h2 className="text-brand-text-primary mb-1 text-2xl font-black">
              FleetGuard Telematics
            </h2>
            <p className="text-brand-text-muted text-xs">
              Đăng nhập hệ thống điều phối an toàn xe tải
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <InputField
              label="Tài khoản"
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập..."
              required
              disabled={isLoading}
            />
            <InputField
              label="Mật khẩu"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu..."
              required
              disabled={isLoading}
            />
            <Button type="submit" isLoading={isLoading} fullWidth>
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
