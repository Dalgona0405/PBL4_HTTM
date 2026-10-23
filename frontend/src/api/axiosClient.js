import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// KHI GỬI YÊU CẦU ĐI (REQUEST INTERCEPTOR)
// Trước khi gửi bất kỳ request nào xuống Backend, sẽ chặn lại để nhét Token.
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// KHI NHẬN KẾT QUẢ VỀ (RESPONSE INTERCEPTOR)
// Kiểm tra xem response từ Backend trả về có bị lỗi không
axiosClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success != undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Nếu Backend báo lỗi 401 (Hết hạn Token / Chưa đăng nhập)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    const errorMessage =
      error.response?.data?.error?.messange ||
      error.messange ||
      "Đã có lỗi kết nối xảy ra";
    return Promise.reject(new Error(errorMessage));
  },
);

export default axiosClient;
