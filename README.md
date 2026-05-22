Men siz soʻragan barcha talablar asosida, zamonaviy hamda oʻta professional “Rang Palitrasi Generator” (HueCraft) web ilovasining toʻliq kodini yozib bitkazdim. Ilova dizayni minimalizm va oʻta nafis Glassmorphism uslublari asosida ishlab chiqildi.
📂 Papka va Fayllar Strukturasi
Ilova modullilik va toza kod qoidalariga rioya qilgan holda quyidagi struktura boʻyicha yaratildi:
/src/types.ts — Rang formatlari, palitralar va gradientlar uchun toʻliq TypeScript turlari va interfeyslari.
/src/utils/colorUtils.ts — HEX, RGB, HSL rang formatlarini bir-biriga oʻtkazish, rang uygʻunliklari (Analog, Monoxrom, Triada, Komplementar) hisoblagichlari, WCAG 2.1 boʻyicha kontrast tahlili va tayyor gradient shablonlari.
/src/components/Navbar.tsx — Rejim (Dark/Light), qidiruv formatlari va asosiy boʻlimlar navigatsiyasi.
/src/components/PaletteGenerator.tsx — Boʻgʻinli rang kartalari, qulflash tizimi, tayanch rang tanlash, HSL tahrirlagichlari va tasodifiy generatsiya.
/src/components/GradientGenerator.tsx — Burchak ostida linear va radial gradient qurish vizualizatori hamda tayyor preset va shablonlar kutubxonasi.
/src/components/ContrastChecker.tsx — WCAG standartlarida (AA, AAA) matn oʻqilish qulayligini tahlil qiluvchi va jonli vizual mock namuna koʻrsatuvchi doska.
/src/components/FavoritesList.tsx — Saqlangan palitra va gradientlarni saqlovchi hamda JSON fayl shaklida eksport qiluvchi panel.
/src/components/Toast.tsx — Kopya qilish yoki saqlash muvaffaqiyatli yakunlanganda silliq chiqib keluvchi bildirishnoma.
✨ Amalga Oshirilgan Imkoniyatlar & Visual UI/UX
Aesthetic Glassmorphism & Light/Dark Mode:
Ilova fonida och va toʻq rejimga moslashuvchi, silliq harakatlanuvchi ambient neon yorugʻligi bor.
Barcha kartalar oyna effekti (backdrop-blur), nozik hoshiyalar va yengil soyalar yordamida ajratilgan.
Plus Jakarta Sans geometrik shrifti sarlavhalarga, JetBrains Mono esa rang kodlarining joylashuviga mukammal vizual kelishuv beradi.
Uygʻun Ranglar Palitrasi (Arming Harmonies):
Rang kartalarini qulflash (Lock) faollashtirilsa, generatsiya paytida faqat tanlanmagan ranglargina oʻzgaradi.
Kompyuterda klaviaturaning Space (Boʻshliq) tugmasi bosilsa, bir zumda yangi ranglar palitrasi hosil boʻladi.
Analogous, Monochromatic, Triadic, Complementary, Tetradic uygʻunlik rejalari tayanch rang asosida butunlay moslashadi.
Pro Gradient va Rang Kontrasti:
Gradient bariga 5 tagacha nuqta (stops) qoʻshish, burchaklarni aylantirish va toʻgʻridan-toʻgʻri tayyor CSS kodini nusxalash mumkin.
Kontrast tekshiruvchasi matn va fon ranglari mos kelmaganda sarlavha oʻqilishi qiyinligidan ogohlantiradi.
Local Storage va Eksport:
Sevimli palitralaringiz va gektar-gradientlaringiz brauzer xotirasida barqaror saqlanadi.
Barcha saqlangan sevimli ranglarni JSON fayl shaklida kompyuterga eksport qilish imkoniyati mavjud.
🚀 Deploy Qilish Boʻyicha Yoʻriqnoma
Yaratilgan ushbu zamonaviy frontend ilovani juda tez va bepul deploy qilish mumkin:
1-usul: Vercel orqali (Eng oson va tezkor usul)
Loyihani oʻzingizning GitHub profilingizga yuklang (Push).
Vercel saytiga kiring va profilingizni GitHub bilan bogʻlang.
Import Project tugmasini bosing va ushbu loyihani tanlang.
Vercel avtomatik ravishda Vite loyihasini aniqlaydi. Hech qanday sozlamalarni oʻzgartirmasdan Deploy tugmasini bosing. 30 soniyada loyihangiz mukammal ishlaydigan havola (link) bilan jonli efirga chiqadi.
Men siz istagan "Zamonaviy va Immersive UI Rang Palitrasi hamda Gradient Generator" ilovasining barcha tahrirlarini va visual sayqallash ishlarini muvaffaqiyatli yakunladim!
Loyiha hech qanday ogohlantirish va xatolarsiz toʻliq muvaffaqiyatli build boʻldi (build succeeded).
🎨 Amalgamated Dizayn va Yangilanishlar Sarhisobi
Ushbu bosqichda ilovaga "Immersive UI" konsepsiyasi va o'zbekcha interfeys unsurlari mukammal ravishda integratsiya qilindi:
Gradient Tahrirlagich (GradientGenerator.tsx):
Tahrirlash paneli, yoʻnalish tugmalari, burchak slayderi hamda rang stoplari kiritish maydonchalari Modern Glassmorphism uslubiga keltirildi.
Toʻq rejimda border-white/10 hamda backdrop-blur-xl effektlari yordamida oʻta zamonaviy konturlar va shaffof fon qatlamlari qo'llanildi.
Tayyor shablonlar kutubxonasi kartalari va hover qatlamlari yangi dizayn tiliga moslashtirildi.
Rang Kontrasti Tekshiruvchisi (ContrastChecker.tsx):
Rang kiritish maydonlariga glass va to'q rejimlar uchun maxsus moslashuvchan soyalar biriktirildi.
WCAG 2.1 muvofiqlik tekshiruvi natijalarini koʻrsatuvchi ma'lumotlar panellari zamonaviy koʻrinishga olib kelindi hamda interaktiv namuna UI qatlami ranglar uygʻunligini yorqin aks ettirmoqda.
Sevimli Ranglar Toʻplami (FavoritesList.tsx):
Palitralar va gradientlar galereyasi kartalari backdrop-blur hamda oqshom rejimidagi shadow-lg shadow-black/5 konturlari bilan havolanib, nafis bular koʻrinishini oldi.
Nusxa olish (CSV, CSS, Tailwind) hamda JSON eksport qilish boshqaruv tugmalari interaktiv hover effektlari bilan ta'minlandi.
Tizim va Kod Sifati:
Barcha tahrirlar toʻliq TypeScript qoidalariga rioya qilingan holda bajarildi.
Visual xatolar, teglar yopilmay qolishi yoki sinf xatolari toʻliq bartaraf etildi.
index.css orqali Inter va JetBrains Mono shriftlari interfeysga muvaffaqiyatli ulangan.
