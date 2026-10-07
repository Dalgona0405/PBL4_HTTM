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
    <div className="bg-brand-light flex min-h-screen flex-col font-sans">
      <header className="flex h-20 shrink-0 items-center justify-between bg-white px-8 shadow-xs border-b border-slate-100">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logoImg} alt="FleetGuard Logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              FleetGuard
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
              Telematics & Safety
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="border-blue-600 w-full max-w-md rounded-3xl border-t-8 bg-white p-10 shadow-xl border border-slate-100">
          <div className="mb-8 text-center">
            <img src={logoImg} alt="FleetGuard Logo" className="h-14 w-14 object-contain mx-auto mb-3" />
            <h2 className="mb-1 text-2xl font-black text-slate-900">
              FleetGuard Telematics
            </h2>
            <p className="text-xs text-slate-500">Đăng nhập hệ thống điều phối an toàn xe tải</p>
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
            <Button type="submit" isLoading={isLoading}>
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
