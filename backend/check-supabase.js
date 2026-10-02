import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

console.log('🔍 KIỂM TRA KẾT NỐI VÀ DỮ LIỆU SUPABASE...\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = process.env.DATABASE_URL;

console.log(`📌 Database Provider hiện tại (Prisma): SQLite (Local file: ./prisma/dev.db)`);
console.log(`📌 DATABASE_URL trong .env: ${dbUrl ? (dbUrl.includes('supabase') ? 'Đã chứa URL Supabase PostgreSQL' : dbUrl) : 'Chưa cấu hình'}`);
console.log(`📌 SUPABASE_URL: ${supabaseUrl || 'Chưa điền trong .env'}`);

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_PROJECT')) {
  console.log('\n❌ KẾT LUẬN: Dữ liệu CƠ SỞ DỮ LIỆU CHƯA ĐƯỢC UPLOAD LÊN SUPABASE.');
  console.log('👉 Hiện tại hệ thống đang chạy hoàn toàn trên Cơ sở dữ liệu SQLite Local (file: ./prisma/dev.db).');
} else {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('\n🔄 Đang thử kết nối tới Supabase API...');
    
    supabase.from('users').select('count', { count: 'exact' }).then(({ data, error, count }) => {
      if (error) {
        console.log('⚠️ Bảng `users` chưa có trên Supabase (Cần chạy npx prisma db push). Error:', error.message);
      } else {
        console.log(`✅ Đã kết nối Supabase! Số lượng bản ghi users trên Supabase: ${count}`);
      }
    });
  } catch (e) {
    console.log('❌ Lỗi kết nối Supabase:', e.message);
  }
}
