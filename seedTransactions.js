// seedTransactions.js (Sıralı Siler, Kontrol Eder, Kategorileri Detaylı Loglar - Güncel Tarihlerle)
import axios from 'axios';

// --- AYARLAR ---
const API_BASE_URL = 'https://wallet.b.goit.study/api';
// DİKKAT: Doğru giriş bilgilerinizle değiştirin
const USER_EMAIL = 'saim@gmail.com'; // Sizin e-postanız
const USER_PASSWORD = 's123456'; // Sizin şifreniz

// ✅ KRİTİK DÜZELTME: İşlem tarihlerini güncel yıla ve aya ayarla
const CURRENT_DATE = new Date();
const CURRENT_YEAR = CURRENT_DATE.getFullYear();
const CURRENT_MONTH = String(CURRENT_DATE.getMonth() + 1).padStart(2, '0'); // Ayı 2 haneli yap (01-12)
const CURRENT_DAY = String(CURRENT_DATE.getDate()).padStart(2, '0');

const DUMMY_TRANSACTIONS_WITH_NAMES = [
  {
    type: 'EXPENSE',
    categoryName: 'Other expenses',
    comment: 'Gift for your wife (Güncel)',
    sum: -300.0, // ✅ YENİ TARİH: Güncel Ay/Yıl/Gün
    transactionDate: `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}T10:00:00Z`,
  },
  {
    type: 'INCOME',
    categoryName: 'Income',
    comment: 'Monthly Salary (Güncel)',
    sum: 8000.0, // ✅ YENİ TARİH: Güncel Ay/Yıl/Gün
    transactionDate: `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}T11:00:00Z`,
  },
  {
    type: 'EXPENSE',
    categoryName: 'Car',
    comment: 'Oil change (Güncel)',
    sum: -1000.0, // ✅ YENİ TARİH: Güncel Ay/Yıl/Gün
    transactionDate: `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}T12:00:00Z`,
  },
];
// --- ---

// Ana fonksiyon (async IIFE)
(async () => {
  let token = null;
  let categoriesMap = {};
  let incomeCategoryId = null;

  try {
    // 1. Adım: Login ol ve token al
    console.log('Giriş yapılıyor...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/sign-in`, {
      email: USER_EMAIL,
      password: USER_PASSWORD,
    });
    token = loginResponse.data.token;
    console.log('Giriş başarılı! Token alındı.'); // 2. Adım: Mevcut işlemleri çek

    console.log('\nMevcut işlemler çekiliyor...');
    let existingTransactions = [];
    try {
      const getResponse = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      existingTransactions = getResponse.data;
      console.log(
        ` -> ${existingTransactions.length} adet mevcut işlem bulundu.`,
      );
    } catch (getError) {
      console.warn(
        'Mevcut işlemler çekilirken bir hata oluştu (veya hiç işlem yok). Devam ediliyor...',
        getError.response?.data || getError.message,
      );
    } // 3. Adım: Mevcut işlemleri SIRAYLA sil

    if (existingTransactions.length > 0) {
      console.log('\nMevcut işlemler SİLİNİYOR (Sırayla)...');
      let deletedCount = 0;
      for (const tx of existingTransactions) {
        try {
          await axios.delete(`${API_BASE_URL}/transactions/${tx.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(` -> Silindi: ${tx.comment || tx.id}`);
          deletedCount++;
        } catch (deleteError) {
          console.error(
            ` -> Silinemedi: ${tx.comment || tx.id}`,
            deleteError.response?.data || deleteError.message,
          );
        }
      }
      console.log(
        `Silme işlemi tamamlandı. ${deletedCount}/${existingTransactions.length} işlem silindi.`,
      ); // Silme sonrası kontrol

      console.log('\nSilme sonrası kontrol için işlemler tekrar çekiliyor...');
      try {
        const checkResponse = await axios.get(`${API_BASE_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(
          ` -> Kontrol sonucu: ${checkResponse.data.length} adet işlem kaldı.`,
        );
        if (checkResponse.data.length > 0) {
          console.warn('UYARI: Silme işlemine rağmen hala işlem görünüyor.');
        }
      } catch (checkError) {
        console.error(
          'Silme sonrası kontrol sırasında hata!',
          checkError.response?.data || checkError.message,
        );
      }
    } else {
      console.log('Silinecek mevcut işlem bulunamadı.');
    } // 4. Adım: Kategorileri çek ve Eşleştir

    console.log('\nKategoriler çekiliyor...');
    try {
      const categoriesResponse = await axios.get(
        `${API_BASE_URL}/transaction-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!Array.isArray(categoriesResponse.data)) {
        throw new Error(
          'API /transaction-categories endpointinden dizi (array) dönmedi.',
        );
      }

      let foundIncomeCategory = false;
      categoriesResponse.data.forEach((category) => {
        if (category.id && category.name) {
          categoriesMap[category.name] = category.id;
          if (category.name === 'Income') {
            incomeCategoryId = category.id;
            foundIncomeCategory = true;
          }
        } else {
          console.warn('UYARI: Geçersiz kategori verisi alındı:', category);
        }
      });

      if (!foundIncomeCategory) {
        console.error(
          'HATA: API yanıtında geçerli bir "Income" kategorisi bulunamadı! Script durduruluyor.',
        );
        return;
      }
      console.log('Kategoriler çekildi, eşleştirildi ve Income ID bulundu.');
    } catch (categoryError) {
      console.error('\n--- Kategori çekme/işleme sırasında KRİTİK HATA ---');
      if (categoryError.response) {
        console.error('Status:', categoryError.response.status);
        console.error('Data:', categoryError.response.data);
      } else {
        console.error('Error message:', categoryError.message);
      }
      return; // Hata oluştuğu için script'i durdur
    } // ==============================================
    // 5. Adım: Yeni verileri ekle
    console.log('\nÖrnek veriler eklenmeye başlanıyor...');
    for (const txData of DUMMY_TRANSACTIONS_WITH_NAMES) {
      let categoryId = null;

      if (txData.type === 'INCOME') {
        categoryId = incomeCategoryId;
      } else if (txData.type === 'EXPENSE') {
        categoryId = txData.categoryName
          ? categoriesMap[txData.categoryName]
          : null;
        if (txData.categoryName && !categoryId) {
          console.warn(
            `"${txData.categoryName}" için Kategori ID bulunamadı. İşlem atlanıyor: ${txData.comment}`,
          );
          continue;
        }
        if (!categoryId) {
          console.warn(
            `Gider işlemi için geçerli Kategori ID bulunamadı (${txData.categoryName || 'Belirtilmemiş'}). İşlem atlanıyor: ${txData.comment}`,
          );
          continue;
        }
      } else {
        console.warn(
          `Bilinmeyen işlem tipi "${txData.type}". İşlem atlanıyor: ${txData.comment}`,
        );
        continue;
      }

      const payload = {
        // ✅ KRİTİK DÜZELTME: API'ye giderken milisaniyeyi kesme
        transactionDate: txData.transactionDate.slice(0, 19),
        type: txData.type,
        comment: txData.comment,
        amount: txData.sum,
        categoryId: categoryId,
      };

      try {
        console.log(
          `Ekleniyor: ${payload.comment} (${payload.amount}) KategoriID: ${payload.categoryId}`,
        );
        await axios.post(`${API_BASE_URL}/transactions`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(` -> Başarılı!`);
      } catch (postError) {
        console.error(` -> İşlem eklenirken HATA oluştu: ${payload.comment}`);
        console.error(
          '    Hata Detayları:',
          postError.response?.data || postError.message,
        );
      }
    }
    console.log('\nVeri ekleme işlemi tamamlandı.');
  } catch (error) {
    // Genel hata yakalama (Öncekiyle aynı)
    console.error('\n--- Veri ekleme sırasında genel bir hata oluştu ---');
    if (error.response) {
      console.error('Durum Kodu:', error.response.status);
      console.error('Hata Verisi:', error.response.data);
    } else {
      console.error('Hata Mesajı:', error.message);
    }
  }
})();
