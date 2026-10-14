// ==========================================
// DANH MỤC LOẠI VI PHẠM CHUẨN HÓA (PBL4 FLEET)
// ==========================================

export const VIOLATION_TYPES = {
  BUON_NGU: {
    id: 1,
    code: 'BUON_NGU',
    name: 'Ngủ gật / Mất tập trung kéo dài (Microsleep)',
    icon: '🚨',
    defaultPoints: 10,
    dieuKien: 'Mắt nhắm liên tục >= 2 giây hoặc góc đầu gục đột ngột',
    xuLyOffline: 'Còi báo động khẩn cấp trong cabin, kích rung ghế, cắt video 10s',
    description: 'Mô hình AI YOLO phát hiện tài xế nhắm mắt liên tục >= 2 giây. Bật chuông báo gắt & trừ điểm uy tín.',
  },
  MET_MOI_NGAP: {
    id: 2,
    code: 'MET_MOI_NGAP',
    name: 'Mệt mỏi / Ngáp dài liên tục',
    icon: '🥱',
    defaultPoints: 2,
    dieuKien: 'Ngáp dài liên tục >= 3 giây hoặc tần suất ngáp dày đặc',
    xuLyOffline: 'Bật quạt gió cabin lấy gió tươi, phát loa nhắc tìm trạm nghỉ',
    description: 'Phát hiện ngáp dài liên tục >= 3 giây, dấu hiệu thể trạng mệt mỏi. Gợi ý trạm dừng chân gần nhất.',
  },
  CO2_CAO: {
    id: 3,
    code: 'CO2_CAO',
    name: 'Nồng độ CO2 vượt ngưỡng an toàn',
    icon: '⚠️',
    defaultPoints: 0,
    dieuKien: 'Cảm biến MQ-135 đo nồng độ CO2 buồng lái > 1000 - 1200 ppm',
    xuLyOffline: 'Đóng Relay tự động bật quạt hút thông gió cabin',
    description: 'Cảm biến MQ-135 ghi nhận nồng độ CO2 cabin vượt ngưỡng (> 1000 ppm), nguy cơ thiếu oxy gây buồn ngủ.',
  },
  DIEN_THOAI: {
    id: 4,
    code: 'DIEN_THOAI',
    name: 'Sử dụng điện thoại khi đang lái xe',
    icon: '📱',
    defaultPoints: 5,
    dieuKien: 'Tay cầm điện thoại áp tai hoặc nhìn xuống thao tác màn hình',
    xuLyOffline: 'Phát âm thanh nhắc nhở tập trung lái xe, cắt video 10s',
    description: 'Mô hình AI YOLO phát hiện tài xế cầm điện thoại khi lái xe, nguy cơ gây mất tập trung.',
  },
  QUA_TOC_DO: {
    id: 5,
    code: 'QUA_TOC_DO',
    name: 'Chạy quá tốc độ an toàn quy định',
    icon: '⚡',
    defaultPoints: 5,
    dieuKien: 'Định vị GPS ghi nhận vận tốc xe vượt quá 80 km/h',
    xuLyOffline: 'Phát âm thanh cảnh báo vượt quá tốc độ cho phép',
    description: 'Hệ thống định vị GPS phát hiện vận tốc xe chạy vượt quá giới hạn 80 km/h quy định.',
  },
};

/**
 * Tra cứu loại lỗi theo ID số
 */
export const getViolationTypeById = (id) => {
  if (!id) return null;
  const numId = parseInt(id, 10);
  return Object.values(VIOLATION_TYPES).find((t) => t.id === numId) || null;
};

/**
 * Tra cứu loại lỗi theo Mã Code (chuỗi)
 */
export const getViolationTypeByCode = (code) => {
  if (!code) return null;
  const upper = String(code).toUpperCase().trim();
  
  // Trực tiếp khớp theo mã code
  if (VIOLATION_TYPES[upper]) return VIOLATION_TYPES[upper];

  // Khớp mềm với các cờ phần cứng hoặc chuỗi cũ
  if (upper.includes('EYES_CLOSED') || upper.includes('NGỦ GẬT') || upper.includes('BUON_NGU')) {
    return VIOLATION_TYPES.BUON_NGU;
  }
  if (upper.includes('PHONE') || upper.includes('ĐIỆN THOẠI') || upper.includes('DIEN_THOAI')) {
    return VIOLATION_TYPES.DIEN_THOAI;
  }
  if (upper.includes('YAWN') || upper.includes('NGÁP') || upper.includes('MET_MOI')) {
    return VIOLATION_TYPES.MET_MOI_NGAP;
  }
  if (upper.includes('CO2') || upper.includes('CO2_CAO')) {
    return VIOLATION_TYPES.CO2_CAO;
  }
  if (upper.includes('SPEED') || upper.includes('TỐC ĐỘ') || upper.includes('QUA_TOC_DO')) {
    return VIOLATION_TYPES.QUA_TOC_DO;
  }

  return null;
};

/**
 * Ánh xạ tín hiệu cảm biến / AI phần cứng sang loại lỗi chuẩn
 */
export const resolveViolationFromFlag = ({ aiViolationFlag, co2, speed, co2Threshold = 1000 }) => {
  if (aiViolationFlag === 'EYES_CLOSED' || aiViolationFlag === 'BUON_NGU') {
    return VIOLATION_TYPES.BUON_NGU;
  }
  if (aiViolationFlag === 'PHONE' || aiViolationFlag === 'DIEN_THOAI') {
    return VIOLATION_TYPES.DIEN_THOAI;
  }
  if (aiViolationFlag === 'YAWN' || aiViolationFlag === 'MET_MOI_NGAP') {
    return VIOLATION_TYPES.MET_MOI_NGAP;
  }
  if (co2 && co2 > co2Threshold && !aiViolationFlag) {
    return VIOLATION_TYPES.CO2_CAO;
  }
  if (speed && speed > 80.0 && !aiViolationFlag) {
    return VIOLATION_TYPES.QUA_TOC_DO;
  }
  return null;
};

/**
 * Trả về danh sách tất cả các loại lỗi để gửi cho Frontend
 */
export const getAllViolationTypes = () => Object.values(VIOLATION_TYPES);
