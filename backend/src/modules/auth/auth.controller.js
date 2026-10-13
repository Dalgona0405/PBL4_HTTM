import * as authService from './auth.service.js';

export const handleRegister = async (req, res, next) => {
  try {
    const { username, password, hoTen, sdt, bangLai } = req.body;
    if (!username || !password || !hoTen) {
      return res.status(400).json({ message: 'Vui lòng cung cấp username, password và hoTen.' });
    }

    const newUser = await authService.registerUser({ username, password, hoTen, sdt, bangLai });
    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công.',
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const handleLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    const { user, token } = await authService.loginUser({ username, password });

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Đăng nhập thành công.',
      token,
      user,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export const handleGetMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    return res.json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const handleGetUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const handleUpdateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { trangThai, role } = req.body;
    const adminId = req.user.id;
    const user = await authService.updateUserStatus(userId, { trangThai, role }, adminId);
    return res.json({ message: 'Cập nhật tài khoản thành công.', user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const handleGetConfig = async (req, res, next) => {
  try {
    const config = await authService.getSystemConfig();
    return res.json({ config });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const handleUpdateConfig = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const config = await authService.updateSystemConfig(req.body, adminId);
    return res.json({ message: 'Cập nhật tham số AI & Cảm biến thành công.', config });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

