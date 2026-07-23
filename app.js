document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 150);
    }

    // --- 0.2 Scroll to Top Button ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 0.5 Language Toggle System ---
    const langToggleBtn = document.getElementById('lang-toggle');
    const defaultLang = 'id';
    let currentLang = localStorage.getItem('kkn-lang') || defaultLang;

    const applyLanguage = (lang) => {
        if (!window.KKN_LANG || !window.KKN_LANG[lang]) return;

        const dictionary = window.KKN_LANG[lang];

        // Update Text Elements
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (dictionary[key]) {
                el.innerHTML = dictionary[key];
            }
        });

        // Update Placeholders
        document.querySelectorAll('[data-lang-ph]').forEach(el => {
            const key = el.getAttribute('data-lang-ph');
            if (dictionary[key]) {
                el.setAttribute('placeholder', dictionary[key]);
            }
        });

        // Update Button UI with Flags
        if (langToggleBtn) {
            if (lang === 'en') {
                langToggleBtn.innerHTML = '<span class="lang-id" style="opacity: 0.4; font-weight: 400;">ID</span> <span class="lang-sep">|</span> <span class="lang-en" style="opacity: 1; font-weight: 800;">EN</span>';
            } else {
                langToggleBtn.innerHTML = '<span class="lang-id" style="opacity: 1; font-weight: 800;">ID</span> <span class="lang-sep">|</span> <span class="lang-en" style="opacity: 0.4; font-weight: 400;">EN</span>';
            }
        }

        // Set HTML lang attribute for SEO & Accessibility
        document.documentElement.setAttribute('lang', lang);
    };

    // Apply saved language on load
    applyLanguage(currentLang);

    // Initialise window-level lang references so renderBlogCards can read them on first load
    window.currentLang = currentLang;
    window.translations = window.KKN_LANG;

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'id' ? 'en' : 'id';
            localStorage.setItem('kkn-lang', currentLang);

            // Add transition class for smooth fade out
            document.body.classList.add('lang-switching');

            // Wait for fade out to complete before swapping text
            setTimeout(() => {
                applyLanguage(currentLang);

                // Expose to window so renderBlogCards and other renderers can read it
                window.currentLang = currentLang;
                window.translations = window.KKN_LANG;

                // Notify other renderers (blog cards, etc.)
                document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: currentLang } }));

                // Remove transition class to fade back in
                document.body.classList.remove('lang-switching');
            }, 250); // Matches CSS transition duration
        });
    }

    // --- 1. Mobile Menu Toggler ---
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // --- 2. Hash-Based SPA Routing ---
    const pageSections = document.querySelectorAll('.page-section');

    const handleRouting = () => {
        let currentHash = window.location.hash;
        if (!currentHash || currentHash === '#') {
            currentHash = '#beranda';
        }

        // Hide all page sections, show active one
        pageSections.forEach(section => {
            if (`#${section.getAttribute('id')}` === currentHash) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Highlight active navigation link in header
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Scroll to top of the page on route change
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    };

    window.addEventListener('hashchange', handleRouting);
    // Execute routing on page load
    handleRouting();

    // --- 3. STATIC DATA (No Backend Required) ---

    // Helper to escape HTML and prevent XSS (defined here so all renderers can use it)
    const escapeHTML = (str) => {
        if (!str) return '';
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    };

    // ================================================================
    // DATA E-KATALOG UMKM - Edit di sini untuk update produk
    // ================================================================
    const umkmData = {
        1: {
            name: "Kerajinan Popor Senapan Kayu",
            badge: "Kerajinan Khas",
            price: "Mulai dari Rp 250.000",
            owner: "Pengrajin: Warga Dusun Wungurejo (Hub: 087785165871)",
            desc: "Mahakarya seni ukir kayu berkualitas tinggi yang dikerjakan secara handmade oleh pengrajin lokal Dusun Wungurejo. Bahan baku kayu pilihan diolah dengan teknik tradisional yang telah diwariskan turun-temurun. Cocok untuk kolektor senjata, pecinta olahraga menembak, dan sebagai cendera mata khas Gunungkidul.",
            images: ["assets/KatalogUMKM/RT03/Pengrajin_Popor_SenapanKayu/IMG_0998_final.JPG", "assets/KatalogUMKM/RT03/Pengrajin_Popor_SenapanKayu/IMG_0999_final.JPG"],
            waLink: "https://wa.me/6287785165871?text=Halo%20Pengrajin%20Popor%2C%20saya%20tertarik%20dengan%20karya%20popor%20kayu%20dari%20Wungurejo.%20Bisa%20tanya-tanya%3F",
            // Google Maps embed src untuk lokasi pengrajin popor
            mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d494.4!2d110.60471903789087!3d-7.874912049612724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTInMjkuNyJTIDExMMKwMzYnMTcuMCJF!5e0!3m2!1sid!2sid!4v1000000000000!5m2!1sid!2sid"
        },
        2: {
            name: "Madu Klanceng Murni",
            badge: "Hasil Peternakan",
            price: "Harga Bervariasi",
            owner: "Peternak: Usaha Madu TBS (Bapak Sutadi) — Dusun Wungurejo",
            desc: "Madu klanceng murni 100% tanpa campuran, dipanen langsung dari koloni lebah tanpa sengat (Trigona sp.) yang diternakkan di alam asri Dusun Wungurejo. Kaya akan antioksidan, vitamin, dan mineral alami. Berkhasiat untuk meningkatkan imun tubuh, menyembuhkan luka, dan menjaga kesehatan secara holistik. Dalam galeri terdapat momen kunjungan kami dan foto bersama Bapak Sutadi selaku pemilik Usaha Madu TBS.",
            images: [
                "assets/KatalogUMKM/RT06/Madu_TBS/IMG_0850_final.JPG",
                "assets/KatalogUMKM/RT06/Madu_TBS/IMG_0851_final.JPG",
                "assets/KatalogUMKM/RT06/Madu_TBS/IMG_0852_final.JPG",
                "assets/KatalogUMKM/RT06/Madu_TBS/IMG_0853_final.JPG",
                "assets/KatalogUMKM/RT06/Madu_TBS/IMG_0854_final.JPG",
                "assets/KatalogUMKM/RT06/Madu_TBS/IMG_0855_final.JPG",
                "assets/KatalogUMKM/RT06/Madu_TBS/IMG_0856_final.JPG"
            ],
            waLink: "https://wa.me/6281804093906?text=Halo%20Madu%20Klanceng%20Murni%20%28TBS%29",
            mapSrc: "https://maps.app.goo.gl/vjDa8UGaf69wPBEi6?g_st=ic"
        },
        3: {
            name: "Bibit & Konsumsi Ikan Air Tawar",
            badge: "Hasil Peternakan",
            price: "Harga Bervariasi (Hubungi Peternak)",
            owner: "Peternak: Bapak Sugino Wiryo (Hub: 082226799923) — Dusun Wungurejo",
            desc: "Menyediakan bibit ikan berkualitas (Lele, Nila, Mas) dan ikan siap konsumsi hasil budidaya intensif oleh Bapak Sugino Wiryo. Kolam ikan dikelola secara higienis dengan pakan alami. Cocok untuk pembelian retail maupun partai besar untuk kebutuhan hajatan atau warung makan.",
            images: ["assets/images/umkm_ikan.png"],
            waLink: "https://wa.me/6282226799923?text=Halo%20Bapak%20Sugino%2C%20saya%20tertarik%20dengan%20hasil%20perikanannya.%20Bisa%20tanya%20stok%20yang%20ready%3F",
            mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d494.4!2d110.60831684355774!3d-7.879900709814317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTInNDcuNiJTIDExMMKwMzYnMzAuMCJF!5e0!3m2!1sid!2sid!4v1000000000002!5m2!1sid!2sid"
        },
        4: {
            name: "Kripik Singkong & Kripik Pisang Ibu Anik",
            badge: "Olahan Pangan",
            price: "Harga Bervariasi",
            owner: "Peternak/Pembuat: Ibu Anik — Dusun Wungurejo",
            desc: "Menyediakan olahan hasil bumi berupa kripik singkong dan kripik pisang yang renyah dan gurih. Diproduksi dari bahan baku segar pilihan dan diolah dengan bumbu rahasia yang menggugah selera. Cocok untuk camilan santai keluarga maupun oleh-oleh khas Wungurejo.",
            images: [
                "assets/KatalogUMKM/RT01/kripik_singkong_ibu_anik/IMG_0554.JPG",
                "assets/KatalogUMKM/RT01/kripik_singkong_ibu_anik/IMG_0555.JPG",
                "assets/KatalogUMKM/RT01/kripik_singkong_ibu_anik/IMG_0557.JPG",
                "assets/KatalogUMKM/RT01/kripik_singkong_ibu_anik/IMG_0558.JPG",
                "assets/KatalogUMKM/RT01/kripik_singkong_ibu_anik/IMG_0559.JPG"
            ],
            waLink: "https://wa.me/62882005973468?text=Halo%20Ibu%20Anik%2C%20saya%20ingin%20bertanya%20tentang%20Kripik",
            mapSrc: "https://maps.app.goo.gl/bTx3yPihw3cb3hzy6?g_st=ic"
        },
        5: {
            name: "Jahe Instan KWT Ngudi Makmur",
            badge: "Minuman Herbal",
            price: "Harga Bervariasi",
            owner: "KWT Ngudi Makmur — Dusun Wungurejo",
            desc: "Minuman serbuk jahe instan yang praktis dan menyehatkan produksi Kelompok Wanita Tani (KWT) Ngudi Makmur. Dibuat dari jahe pilihan berkualitas tinggi dengan pemrosesan higienis. Sangat cocok untuk menghangatkan badan dan menjaga daya tahan tubuh.",
            images: [
                "assets/KatalogUMKM/RT01/Jahe_instant_KWT_Ngudi_Makmur/IMG_0551.JPG",
                "assets/KatalogUMKM/RT01/Jahe_instant_KWT_Ngudi_Makmur/IMG_0552.JPG",
                "assets/KatalogUMKM/RT01/Jahe_instant_KWT_Ngudi_Makmur/IMG_0553.JPG",
                "assets/KatalogUMKM/RT01/Jahe_instant_KWT_Ngudi_Makmur/IMG_0559.JPG"
            ],
            waLink: "https://wa.me/62882005973468?text=Halo%20KWT%20Ngudi%20Makmur%2C%20saya%20ingin%20bertanya%20tentang%20Jahe%20Instant",
            mapSrc: "https://maps.app.goo.gl/s2JxcV9jzKaBdMvk9?g_st=ic"
        },
        6: {
            name: "Duwisty Snack",
            badge: "Olahan Pangan",
            price: "Harga Bervariasi",
            owner: "Duwisty Snack — Dusun Wungurejo",
            desc: "Menyediakan aneka camilan ringan (snack) berkualitas dengan rasa yang lezat dan harga terjangkau. Diproduksi dengan bahan-bahan pilihan yang aman dikonsumsi. Sangat cocok sebagai teman bersantai, hidangan tamu, maupun oleh-oleh khas.",
            images: [
                "assets/KatalogUMKM/RT02/Duwisty_Snack/IMG_0520.JPG",
                "assets/KatalogUMKM/RT02/Duwisty_Snack/IMG_0521.JPG",
                "assets/KatalogUMKM/RT02/Duwisty_Snack/IMG_0550.JPG"
            ],
            waLink: "https://wa.me/6282111587174?text=Halo%20Duwisty%20Snack",
            mapSrc: "https://maps.app.goo.gl/BUq1EjmqaenaDfkM9?g_st=ic"
        },
        7: {
            name: "Hikmah Bakery",
            badge: "Olahan Pangan",
            price: "Harga Bervariasi",
            owner: "Hikmah Bakery — Dusun Wungurejo",
            desc: "Menyediakan aneka roti dan kue (bakery) segar dengan cita rasa lezat dan tekstur lembut. Diproduksi setiap hari menggunakan bahan-bahan berkualitas tanpa bahan pengawet berlebih. Pilihan tepat untuk sarapan, bekal, maupun suguhan acara.",
            images: [
                "assets/KatalogUMKM/RT02/Hikmah_Bakery/IMG_0525.JPG"
            ],
            waLink: "https://wa.me/6282122815553?text=Halo%20Hikmah%20Bakery",
            mapSrc: "https://maps.app.goo.gl/VCmwcT9pXiWBwfkdA?g_st=ic"
        },
        8: {
            name: "Warung Ibu Umi",
            badge: "Toko Kelontong",
            price: "Harga Bervariasi",
            owner: "Ibu Umi — Dusun Wungurejo",
            desc: "Toko kelontong milik Ibu Umi yang menyediakan berbagai kebutuhan sehari-hari warga Dusun Wungurejo. Tersedia aneka sembako, bumbu masak, minuman, dan keperluan rumah tangga lainnya dengan harga yang terjangkau dan pelayanan yang ramah.",
            images: [
                "assets/KatalogUMKM/RT02/Warung_Ibu_Umi/IMG_0548.JPG",
                "assets/KatalogUMKM/RT02/Warung_Ibu_Umi/IMG_0549.JPG"
            ],
            waLink: "https://wa.me/6281329358918?text=Halo%20Warung%20Ibu%20Umi",
            mapSrc: "https://maps.app.goo.gl/wjxJcbmp4oP2xEiz5?g_st=ic"
        },
        9: {
            name: "Meubel Pak Wasimin",
            badge: "Kerajinan Kayu",
            price: "Harga Bervariasi",
            owner: "Pak Wasimin — Dusun Wungurejo",
            desc: "Usaha meubel milik Pak Wasimin yang memproduksi berbagai perabot dan furnitur kayu berkualitas tinggi. Mengerjakan berbagai pesanan mulai dari meja, kursi, lemari, hingga perabot rumah tangga lainnya. Dibuat dengan bahan kayu pilihan dan pengerjaan yang teliti oleh tenaga ahli berpengalaman.",
            images: [
                "assets/KatalogUMKM/RT03/Meubel_Pak_Wasimin/IMG_0527.JPG",
                "assets/KatalogUMKM/RT03/Meubel_Pak_Wasimin/IMG_0528.JPG",
                "assets/KatalogUMKM/RT03/Meubel_Pak_Wasimin/IMG_0529.JPG",
                "assets/KatalogUMKM/RT03/Meubel_Pak_Wasimin/IMG_0563.JPG"
            ],
            waLink: "https://wa.me/6281904709013?text=Halo%20Meubel%20Pak%20Wasimin",
            mapSrc: "https://maps.app.goo.gl/jjsjjnjGZinftVju8?g_st=ic"
        },
        10: {
            name: "Meubel Pak Puryanto",
            badge: "Kerajinan Kayu",
            price: "Harga Bervariasi",
            owner: "Pak Puryanto — Dusun Wungurejo",
            desc: "Usaha meubel milik Pak Puryanto yang memproduksi berbagai perabot dan furnitur kayu berkualitas. Melayani pesanan berbagai jenis furniture seperti meja, kursi, lemari, dan perabot lainnya sesuai kebutuhan pelanggan. Dikerjakan dengan ketelitian tinggi menggunakan kayu pilihan.",
            images: [
                "assets/KatalogUMKM/RT03/Meubel_Pak_Puryanto/IMG_0530.JPG",
                "assets/KatalogUMKM/RT03/Meubel_Pak_Puryanto/IMG_0531.JPG",
                "assets/KatalogUMKM/RT03/Meubel_Pak_Puryanto/IMG_0532.JPG"
            ],
            waLink: "https://wa.me/6281289243969?text=Halo%20Meubel%20Pak%20Puryanto",
            mapSrc: "https://maps.app.goo.gl/9JuhCLDKVf49oKbQ7?g_st=ic"
        },
        11: {
            name: "Pecel Mbah Tini",
            badge: "Kuliner Lokal",
            price: "Harga Bervariasi",
            owner: "Mbah Tini — Dusun Wungurejo",
            desc: "Menyediakan sego pecel khas dengan bumbu kacang gurih dan sayuran segar. Resep turun temurun yang sudah menjadi favorit masyarakat setempat. Sangat pas untuk menu sarapan yang sehat dan mengenyangkan.",
            images: [
                "assets/KatalogUMKM/RT03/Pecel_Mbah_Tini/IMG_0562.JPG"
            ],
            waLink: "https://wa.me/6283845121303?text=Halo%20Pecel%20Mbah%20Tini",
            mapSrc: "https://maps.app.goo.gl/fEsKbsa8wR1J88Au9?g_st=ic"
        },
        12: {
            name: "Tikar Mendong Mbah Tuminem",
            badge: "Kerajinan Tangan",
            price: "Harga Bervariasi",
            owner: "Mbah Tuminem — Dusun Wungurejo",
            desc: "Pengrajin tikar mendong tradisional asli Dusun Wungurejo. Tikar anyaman tangan yang dibuat dengan ketelitian dan bahan mendong berkualitas, menghasilkan produk yang awet, nyaman digunakan, dan ramah lingkungan. Cocok untuk alas duduk santai di rumah tangga.",
            images: [
                "assets/KatalogUMKM/RT03/Tikar_Mendong_Mbah_Tuminem/IMG_0526.JPG",
                "assets/KatalogUMKM/RT03/Tikar_Mendong_Mbah_Tuminem/IMG_0533.JPG",
                "assets/KatalogUMKM/RT03/Tikar_Mendong_Mbah_Tuminem/IMG_0534.JPG",
                "assets/KatalogUMKM/RT03/Tikar_Mendong_Mbah_Tuminem/IMG_0561.JPG"
            ],
            waLink: "https://wa.me/628818786473?text=Halo%20Mbah%20Tuminem%2C%20saya%20tertarik%20dengan%20Tikar%20Mendong",
            mapSrc: "https://maps.app.goo.gl/BbimRVtqb6RSjUdeA?g_st=ic"
        },
        13: {
            name: "Bengkel AB SQUAD",
            badge: "Jasa Servis",
            price: "Sesuai Kerusakan",
            owner: "AB SQUAD — Dusun Wungurejo",
            desc: "Bengkel terpercaya di Dusun Wungurejo yang melayani servis kendaraan roda dua maupun roda empat. Layanan meliputi servis rutin, perbaikan mesin, ganti oli, tune up, dan berbagai masalah kendaraan motor maupun mobil lainnya. Dikerjakan oleh mekanik handal dengan pelayanan yang cepat dan memuaskan.",
            images: [
                "assets/KatalogUMKM/RT03/Bengkel_AB_SQUAD/IMG_0535.JPG?v=3",
                "assets/KatalogUMKM/RT03/Bengkel_AB_SQUAD/IMG_0536.JPG?v=3"
            ],
            waLink: "https://wa.me/6288233955479?text=Halo%20Bengkel%20AB%20SQUAD",
            mapSrc: "https://maps.app.goo.gl/bro6fJdKdUNFYSdw7?g_st=ic"
        },
        14: {
            name: "Bengkel Fergi",
            badge: "Jasa Servis Mobil",
            price: "Sesuai Kerusakan",
            owner: "Fergi — RT 04, Dusun Wungurejo",
            desc: "Bengkel spesialis kendaraan roda empat di Dusun Wungurejo. Melayani servis rutin, perbaikan mesin mobil, tune up, ganti oli, serta berbagai kerusakan kendaraan roda empat lainnya. Dikerjakan oleh tenaga ahli berpengalaman dengan hasil kerja yang teliti dan terpercaya.",
            images: [
                "assets/KatalogUMKM/RT04/Fergi_Bengkel/IMG_0477.JPG?v=2",
                "assets/KatalogUMKM/RT04/Fergi_Bengkel/IMG_0478.JPG?v=2",
                "assets/KatalogUMKM/RT04/Fergi_Bengkel/IMG_0491.JPG?v=2"
            ],
            waLink: "https://wa.me/6287839154457?text=Halo%20Bengkel%20Fergi",
            mapSrc: "https://maps.app.goo.gl/GhXC9YrVmBDmCYyd6?g_st=ic"
        },
        15: {
            name: "Warung Sayur Ibu Wacik",
            badge: "Warung Sayur",
            price: "Harga Bervariasi",
            owner: "Ibu Wacik — RT 04, Dusun Wungurejo",
            desc: "Menyediakan berbagai macam sayuran segar, bumbu dapur, dan kebutuhan pokok harian. Warung sayur Ibu Wacik menjadi pilihan warga untuk mendapatkan bahan makanan segar setiap harinya.",
            images: [
                "assets/KatalogUMKM/RT04/Ibu_Wacik_Sayur/IMG_0544.JPG"
            ],
            waLink: "https://wa.me/62882007544905?text=Halo%20Warung%20Sayur%20Ibu%20Wacik",
            mapSrc: "https://maps.app.goo.gl/C4r77RhGJhoBG6GF8?g_st=ic"
        },
        16: {
            name: "FFS Ternak Ayam Petelur",
            badge: "Hasil Peternakan",
            price: "Harga Bervariasi",
            owner: "Fam Fergi Sabriansyah — RT 04, Dusun Wungurejo",
            desc: "Peternakan ayam petelur berkualitas yang menghasilkan telur segar setiap harinya. Telur ayam diproduksi dengan pakan ternak terbaik untuk menjaga kualitas dan nilai gizi yang tinggi.",
            images: [
                "assets/KatalogUMKM/RT04/FFS_(Fam_Fergi_Sabriansyah)_Ternak_Ayam_Petelur/IMG_0522.JPG",
                "assets/KatalogUMKM/RT04/FFS_(Fam_Fergi_Sabriansyah)_Ternak_Ayam_Petelur/IMG_0523.JPG",
                "assets/KatalogUMKM/RT04/FFS_(Fam_Fergi_Sabriansyah)_Ternak_Ayam_Petelur/IMG_0524.JPG",
                "assets/KatalogUMKM/RT04/FFS_(Fam_Fergi_Sabriansyah)_Ternak_Ayam_Petelur/IMG_0545.JPG",
                "assets/KatalogUMKM/RT04/FFS_(Fam_Fergi_Sabriansyah)_Ternak_Ayam_Petelur/IMG_0547.JPG"
            ],
            waLink: "https://wa.me/6283846375523?text=Halo%20FFS%20Ternak%20Ayam%20Petelur",
            mapSrc: "https://maps.app.goo.gl/dWqipGcYV5zQD9n76?g_st=ic"
        },
        17: {
            name: "Jual Beli Kambing Pak Sutikno",
            badge: "Hasil Peternakan",
            price: "Harga Bervariasi",
            owner: "Pak Sutikno — RT 04, Dusun Wungurejo",
            desc: "Melayani jual beli kambing berkualitas untuk berbagai keperluan seperti aqiqah, qurban, maupun ternak. Kambing sehat, terawat, dan pakan terjamin.",
            images: [
                "assets/KatalogUMKM/RT04/Jual_Beli_Kambing_Pak_Sutikno/IMG_0483.JPG",
                "assets/KatalogUMKM/RT04/Jual_Beli_Kambing_Pak_Sutikno/IMG_0542.JPG"
            ],
            waLink: "https://wa.me/6281802655336?text=Halo%20Pak%20Sutikno%2C%20saya%20tertarik%20dengan%20kambingnya",
            mapSrc: "#"
        },
        18: {
            name: "Penanam Cabai Mas Rida",
            badge: "Hasil Pertanian",
            price: "Harga Bervariasi",
            owner: "Mas Rida — RT 04, Dusun Wungurejo",
            desc: "Hasil panen cabai berkualitas langsung dari kebun Mas Rida. Cabai segar, pedas mantap, dan ditanam dengan perawatan yang baik untuk menghasilkan panen yang optimal.",
            images: [
                "assets/KatalogUMKM/RT04/Penanam_Cabai_Mas_Rida/IMG_0541.JPG"
            ],
            waLink: "https://wa.me/6285946686947?text=Halo%20Mas%20Rida%2C%20saya%20tertarik%20dengan%20cabai",
            mapSrc: "https://maps.app.goo.gl/3ERJt6r1bG8TwogG6?g_st=ic"
        },
        19: {
            name: "Anyaman Tikar Mendong Ibu Sugiyanto",
            badge: "Kerajinan Tangan",
            price: "Harga Bervariasi",
            owner: "Ibu Sugiyanto — RT 06, Dusun Wungurejo",
            desc: "Kerajinan anyaman tikar berbahan dasar mendong yang ditenun secara tradisional oleh Ibu Sugiyanto. Tikar mendong memiliki keunggulan sejuk saat digunakan, kuat, dan ramah lingkungan.",
            images: [
                "assets/KatalogUMKM/RT06/Anyaman_Tikar_Mendong_Ibu_Sugiyanto/IMG_0516.JPG",
                "assets/KatalogUMKM/RT06/Anyaman_Tikar_Mendong_Ibu_Sugiyanto/IMG_0537.JPG",
                "assets/KatalogUMKM/RT06/Anyaman_Tikar_Mendong_Ibu_Sugiyanto/IMG_0538.JPG"
            ],
            waLink: "https://wa.me/6283846618593?text=Halo%20Ibu%20Sugiyanto%2C%20saya%20tertarik%20dengan%20Anyaman%20Tikar%20Mendong",
            mapSrc: "https://maps.app.goo.gl/4RPWGhGvmCjV3o248?g_st=ic"
        },
        20: {
            name: "Cilok Pak Ngatijo",
            badge: "Kuliner Lokal",
            price: "Mulai dari Rp 5.000",
            owner: "Pak Ngatijo — RT 05, Dusun Wungurejo",
            desc: "Jajanan cilok khas buatan Pak Ngatijo yang kenyal, gurih, dan lezat. Disajikan hangat dengan bumbu kacang spesial yang menggugah selera. Cocok untuk camilan santai keluarga.",
            images: [
                "assets/KatalogUMKM/RT05/Ngatijo_Cilok/IMG_0539.JPG",
                "assets/KatalogUMKM/RT05/Ngatijo_Cilok/IMG_0540.JPG"
            ],
            waLink: "#",
            mapSrc: "#"
        },
        21: {
            name: "Toko Qutis",
            badge: "Toko Kelontong",
            price: "Harga Terjangkau",
            owner: "Pemilik — RT 03, Dusun Wungurejo",
            desc: "Menyediakan berbagai macam kebutuhan pokok dan sehari-hari dengan harga terjangkau. [Silakan isi deskripsi lengkap di sini atau kirimkan via chat agar saya dapat memperbaruinya].",
            images: [
                "assets/KatalogUMKM/RT03/Toko_Qutis/IMG_0771.JPG",
                "assets/KatalogUMKM/RT03/Toko_Qutis/IMG_0774.JPG",
                "assets/KatalogUMKM/RT03/Toko_Qutis/IMG_0775.JPG",
                "assets/KatalogUMKM/RT03/Toko_Qutis/IMG_0776.JPG"
            ],
            waLink: "https://wa.me/6283843734543?text=Halo%20Toko%20Qutis",
            mapSrc: "https://maps.app.goo.gl/bq8tUBsfZj739Ut57?g_st=ic"
        },
        22: {
            name: "Brigaz Sablon",
            badge: "Jasa & Layanan",
            price: "Harga Bervariasi",
            owner: "Pemilik — RT 04, Dusun Wungurejo",
            desc: "Melayani jasa sablon berkualitas untuk kaos, jaket, seragam, dan kebutuhan lainnya. [Silakan isi deskripsi lengkap di sini atau kirimkan via chat agar saya dapat memperbaruinya].",
            images: [
                "assets/KatalogUMKM/RT04/Brigaz_Sablon/IMG_0770.JPG?v=5",
                "assets/KatalogUMKM/RT04/Brigaz_Sablon/IMG_0772.JPG?v=5",
                "assets/KatalogUMKM/RT04/Brigaz_Sablon/IMG_0773.JPG?v=5"
            ],
            waLink: "https://wa.me/6287878455546?text=Halo%20Brigaz%20Sablon",
            mapSrc: "https://maps.app.goo.gl/PMUTfDzucc1977Ns7?g_st=ic"
        }
    };

    // --- UMKM Modal Logic ---
    (function () {
        const overlay = document.getElementById('umkm-modal-overlay');
        const closeBtn = document.getElementById('umkm-modal-close');
        if (!overlay) return;

        function openUmkmModal(id) {
            const data = umkmData[id];
            if (!data) return;

            // Fill content
            document.getElementById('umkm-modal-badge').textContent = data.badge;
            document.getElementById('umkm-modal-name').textContent = data.name;
            document.getElementById('umkm-modal-price').textContent = data.price;
            document.getElementById('umkm-modal-desc').textContent = data.desc;
            document.getElementById('umkm-modal-owner').textContent = data.owner;
            document.getElementById('umkm-modal-wa-btn').href = data.waLink;

            // Main image
            const mainImg = document.getElementById('umkm-modal-main-img');
            mainImg.src = data.images[0];
            
            // Add zoom interaction to main image
            mainImg.style.cursor = 'zoom-in';
            mainImg.onclick = () => {
                if(typeof window.openLightbox === 'function') {
                    window.openLightbox(mainImg.src);
                }
            };

            // Thumbnails
            const thumbsContainer = document.getElementById('umkm-gallery-thumbs');
            thumbsContainer.innerHTML = '';
            if (data.images.length > 1) {
                data.images.forEach((src, i) => {
                    const thumb = document.createElement('img');
                    thumb.src = src;
                    thumb.alt = `Foto ${i + 1}`;
                    thumb.className = 'umkm-thumb' + (i === 0 ? ' active' : '');
                    thumb.addEventListener('click', () => {
                        mainImg.src = src;
                        thumbsContainer.querySelectorAll('.umkm-thumb').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    });
                    thumbsContainer.appendChild(thumb);
                });
                thumbsContainer.style.display = 'flex';
            } else {
                thumbsContainer.style.display = 'none';
            }

            // Google Maps
            const mapEl = document.getElementById('umkm-modal-map');
        if (data.mapSrc && data.mapSrc !== "#") {
            mapEl.href = data.mapSrc;
            mapEl.style.display = 'block';
        } else {
            mapEl.style.display = 'none';
        }

            // Open modal
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeUmkmModal() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            // Clear iframe src to stop map loading in bg
            setTimeout(() => { document.getElementById('umkm-modal-map').href = '#'; }, 300);
        }

        // Bind clicks on UMKM cards
        document.querySelectorAll('.umkm-clickable').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.getAttribute('data-umkm-id'));
                openUmkmModal(id);
            });
        });

        closeBtn.addEventListener('click', closeUmkmModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeUmkmModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeUmkmModal(); });
    })();

    // ================================================================
    // UMKM SEARCH LOGIC
    // ================================================================
    (function () {
        const searchInput  = document.getElementById('umkm-search-input');
        const searchClear  = document.getElementById('umkm-search-clear');
        const searchInfo   = document.getElementById('umkm-search-info');
        const noResult     = document.getElementById('umkm-no-result');
        if (!searchInput) return;

        // Kumpulkan data searchable dari umkmData
        // Setiap card punya data-umkm-id; kita ambil name + badge + desc untuk matching
        function getSearchText(id) {
            const d = umkmData[id];
            if (!d) return '';
            return [d.name, d.badge, d.desc, d.owner].filter(Boolean).join(' ').toLowerCase();
        }

        let debounceTimer;

        function runSearch() {
            const query = searchInput.value.trim().toLowerCase();
            const cards = document.querySelectorAll('#umkm-grid .umkm-card');
            let visible = 0;

            cards.forEach(card => {
                const id = parseInt(card.getAttribute('data-umkm-id'));
                const text = getSearchText(id);
                // Juga cek teks h3 dan p di dalam card sebagai fallback
                const cardText = (card.querySelector('h3')?.textContent || '') + ' ' +
                                 (card.querySelector('p')?.textContent  || '') + ' ' +
                                 (card.querySelector('.umkm-badge')?.textContent || '');
                const combined = text + ' ' + cardText.toLowerCase();

                if (!query || combined.includes(query)) {
                    card.classList.remove('search-hidden');
                    visible++;
                } else {
                    card.classList.add('search-hidden');
                }
            });

            // Tombol clear
            searchClear.style.display = query ? 'flex' : 'none';

            // Info teks
            if (query) {
                searchInfo.style.display = 'block';
                searchInfo.innerHTML = visible > 0
                    ? `Menampilkan <span class="highlight">${visible}</span> produk untuk "<span class="highlight">${searchInput.value.trim()}</span>"`
                    : `Tidak ada hasil untuk "<span class="highlight">${searchInput.value.trim()}</span>"`;
            } else {
                searchInfo.style.display = 'none';
            }

            // Pesan tidak ditemukan
            if (noResult) {
                noResult.classList.toggle('show', visible === 0 && query.length > 0);
            }
        }

        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runSearch, 200);
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            runSearch();
        });
    })();

    // ================================================================
    // EDIT DATA PROGRAM KERJA DI SINI:
    // ================================================================

    const prokersData = [
        // PROKER BERSAMA
        { id: 1, type: "Proker Bersama", owner_name: null, title: "Pembuatan Peta Administrasi Fisik dan Digital", description_markdown: "Pembuatan peta administrasi fisik dan digital Dusun Wungurejo, mencakup batas RT, fasilitas umum, dan potensi UMKM.", status: "Belum Mulai", image_urls: [] },
        { id: 2, type: "Proker Bersama", owner_name: null, title: "Sosialisasi dan Pelatihan Pertanian KWT", description_markdown: "Sosialisasi dan pelatihan budidaya pertanian, pengendalian hama, dan pengolahan hasil panen untuk Kelompok Wanita Tani (KWT) Wungurejo.", status: "Belum Mulai", image_urls: [] },
        { id: 3, type: "Proker Bersama", owner_name: null, title: "Penomoran Rumah & Database Warga", description_markdown: "Pembuatan sistem penomoran rumah terstandar dan pendataan database warga Dusun Wungurejo yang terdigitalisasi.", status: "Belum Mulai", image_urls: [] },

        // PROKER INDIVIDU
        { id: 4, type: "Proker Individu", owner_name: "Ahmad Firdaus Nugrahadi", title: "Pemetaan Kualitas Air & Hidrogeologi", description_markdown: "Pemetaan kualitas air dan kondisi hidrogeologi pada sumur gali warga Dusun Wungurejo.", status: "Belum Mulai", image_urls: [] },
        { id: 5, type: "Proker Individu", owner_name: "Fanida Rahmi Bay", title: "Pemasangan Rambu-Rambu Evakuasi Bencana", description_markdown: "Pemasangan rambu-rambu evakuasi bencana merupakan program kerja yang bertujuan memberikan penanda jalur evakuasi dan titik kumpul untuk meningkatkan kesiapsiagaan masyarakat dalam menghadapi situasi darurat. Rambu dipasang pada lokasi-lokasi strategis agar memudahkan warga melakukan evakuasi secara cepat, aman, dan terarah saat terjadi bencana.", status: "Belum Mulai", image_urls: [] },
        { id: 6, type: "Proker Individu", owner_name: "Havez Reza Zein Abizard", title: "Evaluasi Kualitas Air Sumur Masyarakat", description_markdown: "Evaluasi kualitas air sumur masyarakat melalui pengujian laboratorium dan rekomendasi pengolahan air bersih.", status: "Belum Mulai", image_urls: [] },
        { id: 7, type: "Proker Individu", owner_name: "Shofa Salsabila Ratna W", title: "Pembuatan Eco Enzyme", description_markdown: "Edukasi dan praktik pembuatan Eco Enzyme yang memanfaatkan limbah pertanian organik warga.", status: "Belum Mulai", image_urls: [] },
        { id: 8, type: "Proker Individu", owner_name: "Laksana Atmaja Putra", title: "Pembangunan Website Desa", description_markdown: "Membangun website profil desa, katalog UMKM, serta digitalisasi logbook KKN.", status: "Belum Mulai", image_urls: [] },
        { id: 9, type: "Proker Individu", owner_name: "Nabila Vanesya Fiorella", title: "Pestisida Nabati MICESSLA", description_markdown: "Edukasi dan praktik pembuatan pestisida nabati (MICESSLA) untuk membasmi hama tanaman secara alami.", status: "Belum Mulai", image_urls: [] },
        { id: 10, type: "Proker Individu", owner_name: "Dian Meutia Zalianti", title: "Penguatan Identitas dan Profil Usaha UMKM", description_markdown: "Program ini dilaksanakan melalui penyusunan company profile untuk UMKM TBS sebagai media pengenalan usaha, serta pendataan informasi UMKM di Dusun Wungurejo yang mencakup nomor WhatsApp dan titik lokasi Google Maps sebagai pendukung penyajian informasi pada website dusun.", status: "Belum Mulai", image_urls: [] },
        { id: 11, type: "Proker Individu", owner_name: "Anas Rifai Prayogo", title: "Edukasi Keuangan Anak Usia Dini", description_markdown: "Memberikan edukasi dan literasi manajemen keuangan sejak dini untuk anak-anak Dusun Wungurejo.", status: "Belum Mulai", image_urls: [] },
        { id: 12, type: "Proker Individu", owner_name: "Lyra Artha Amarila", title: "Optimalisasi Media Promosi Digital dan Pendataan Informasi UMKM", description_markdown: "Program ini bertujuan untuk mendukung promosi digital dan penyediaan informasi UMKM di Dusun Wungurejo. Kegiatan yang dilakukan meliputi penataan akun Instagram, pembuatan konten, dan penyusunan Linktree pada UMKM TBS, serta pendataan nomor WhatsApp dan pembuatan titik lokasi Google Maps UMKM di Dusun Wungurejo yang akan diintegrasikan ke dalam website dusun.", status: "Belum Mulai", image_urls: [] },
        { id: 13, type: "Proker Individu", owner_name: "Sabrina Az Zahra", title: "Sosialisasi dan Pendampingan Komunikasi Publik", description_markdown: "Kegiatan ini terdiri dari dua sesi yang dilaksanakan pada hari terpisah. Sesi pertama berupa sosialisasi anti bullying untuk anak-anak usia SD dan SMP di Desa Wungurejo, disampaikan secara interaktif dan menyenangkan melalui diskusi ringan, kartu visual, dan kuis berhadiah. Sesi kedua berupa pendampingan langsung kepada ibu-ibu Kelompok Wanita Tani Ngudi Makmur dalam mempersiapkan presentasi produk unggulan mereka seperti jahe instan, kencur instan, dan kunyit instan untuk ditampilkan di acara Warna Sari Kelurahan, mencakup penyusunan materi presentasi dan tips dasar public speaking agar ibu-ibu dapat mempromosikan produk dengan percaya diri dan komunikatif.", status: "Belum Mulai", image_urls: [] }
    ];

    const prokerGridContainer = document.getElementById('proker-grid-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    const renderProkers = (filter) => {
        if (!prokerGridContainer) return;
        prokerGridContainer.innerHTML = '';

        const filteredProkers = prokersData.filter(proker => {
            if (filter === 'all') return true;
            return proker.type === filter;
        });

        if (filteredProkers.length === 0) {
            prokerGridContainer.innerHTML = `<div class="empty-msg" style="text-align: center; padding: 40px; color: var(--color-text-muted); width: 100%;">Belum ada program kerja untuk kategori ini.</div>`;
            return;
        }

        filteredProkers.forEach(proker => {
            const prokerCard = document.createElement('div');
            prokerCard.className = 'proker-card';
            prokerCard.setAttribute('data-aos', 'fade-up');
            prokerCard.setAttribute('data-category', proker.type);
            prokerCard.style.cursor = 'pointer';

            // Determine badge class for status
            let statusClass = 'status-planned';
            let statusIcon = 'fa-hourglass-start';
            if (proker.status === 'Selesai') {
                statusClass = 'status-completed';
                statusIcon = 'fa-circle-check';
            } else if (proker.status === 'Sedang Berjalan') {
                statusClass = 'status-ongoing';
                statusIcon = 'fa-spinner fa-spin';
            }

            // Determine background and icon color based on category/owner
            let iconBoxClass = proker.type === 'Proker Bersama' ? 'bg-maroon' : 'bg-blue';
            let icon = proker.type === 'Proker Bersama' ? 'fa-people-group' : 'fa-user-gear';

            // Parse description using marked if available
            const descHtml = typeof marked !== 'undefined' ? marked.parse(proker.description_markdown) : proker.description_markdown;

            prokerCard.innerHTML = `
                <div class="proker-icon-box ${iconBoxClass}"><i class="fa-solid ${icon}"></i></div>
                <div class="proker-body">
                    <span class="proker-tag">${proker.type}${proker.owner_name ? ` &bull; ${proker.owner_name}` : ''}</span>
                    <h3 class="proker-title">${escapeHTML(proker.title)}</h3>
                    <div class="proker-desc">${descHtml}</div>
                    <div class="proker-footer">
                        <span class="proker-status ${statusClass}"><i class="fa-solid ${statusIcon}"></i> ${proker.status}</span>
                    </div>
                </div>
            `;

            prokerCard.addEventListener('click', () => {
                openDetailsModal(proker, 'Proker');
            });

            prokerGridContainer.appendChild(prokerCard);
        });

        // Refresh AOS for new elements
        if (typeof AOS !== 'undefined') AOS.refresh();
    };

    // Filter button click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            renderProkers(filterValue);
        });
    });

    // --- Logbook Timeline Rendering ---
    const logbookTimelineContainer = document.getElementById('logbook-timeline-container');
    const logbookFilterButtons = document.querySelectorAll('.logbook-filter-btn');
    let logbookData = [];

    // ================================================================
    // EDIT DATA LOGBOOK DI SINI:
    // ================================================================
    logbookData = [
        { id: 1, phase: "Pra-KKN", date: "2026-06-15", title: "Pembekalan KKN Universitas", content_markdown: "Seluruh mahasiswa KKN mengikuti pembekalan resmi dari pihak universitas mengenai tata tertib, program kerja, dan panduan pengabdian di lapangan.", image_urls: [] },
        { id: 2, phase: "Pra-KKN", date: "2026-06-20", title: "Koordinasi Awal Kelompok", content_markdown: "Pertemuan perdana kelompok AB 84.095 untuk membahas pembagian tugas, program kerja, dan persiapan teknis sebelum berangkat ke lokasi KKN.", image_urls: [] },
        { id: 3, phase: "Pelaksanaan KKN", date: "2026-07-01", title: "Tiba di Dusun Wungurejo", content_markdown: "Kelompok KKN AB 84.095 resmi tiba di Dusun Wungurejo dan disambut hangat oleh Bapak Dukuh serta warga setempat. Acara perkenalan dan serah terima berlangsung dengan khidmat.", image_urls: [] },
        { id: 4, phase: "Pelaksanaan KKN", date: "2026-07-02", title: "Observasi dan Pemetaan Wilayah", content_markdown: "Tim melakukan survei keliling Dusun Wungurejo untuk memahami kondisi geografis, sosial, dan potensi UMKM yang ada sebagai dasar penyusunan program kerja.", image_urls: [] }
    ];
    // renderLogbook dipanggil di bagian startup bawah

    const renderLogbook = (filter) => {
        if (!logbookTimelineContainer) return;
        logbookTimelineContainer.innerHTML = '';

        const filteredLogbook = logbookData.filter(entry => {
            if (filter === 'all') return true;
            return entry.phase === filter;
        });

        if (filteredLogbook.length === 0) {
            logbookTimelineContainer.innerHTML = `<div class="empty-msg" style="text-align: center; padding: 40px; color: var(--color-text-muted); width: 100%;">Belum ada catatan logbook untuk fase ini.</div>`;
            return;
        }

        filteredLogbook.forEach(entry => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.setAttribute('data-aos', 'fade-up');

            // Phase badge styling
            let phaseIcon = entry.phase === 'Pra-KKN' ? 'fa-clipboard-list' : 'fa-person-digging';

            // Format YYYY-MM-DD to Indonesian date
            const dateObj = new Date(entry.date);
            const formattedDate = isNaN(dateObj.getTime()) ? entry.date : dateObj.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const contentHtml = typeof marked !== 'undefined' ? marked.parse(entry.content_markdown) : entry.content_markdown;

            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-date">${formattedDate}</div>
                <div class="timeline-content" style="cursor: pointer;">
                    <h3>${escapeHTML(entry.title)}</h3>
                    <div class="timeline-text">${contentHtml}</div>
                    <span class="timeline-badge"><i class="fa-solid ${phaseIcon}"></i> ${entry.phase}</span>
                </div>
            `;

            timelineItem.querySelector('.timeline-content').addEventListener('click', () => {
                openDetailsModal(entry, 'Logbook');
            });

            logbookTimelineContainer.appendChild(timelineItem);
        });

        // Refresh AOS for new elements
        if (typeof AOS !== 'undefined') AOS.refresh();
    };

    // Filter button click handler for logbook
    logbookFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            logbookFilterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'transparent';
                btn.style.color = 'var(--color-primary)';
            });
            button.classList.add('active');
            button.style.background = 'var(--color-primary)';
            button.style.color = 'var(--color-white)';
            const filterValue = button.getAttribute('data-filter');
            renderLogbook(filterValue);
        });
    });

    // Style active button initially
    const activeLogbookBtn = document.querySelector('.logbook-filter-btn.active');
    if (activeLogbookBtn) {
        activeLogbookBtn.style.background = 'var(--color-primary)';
        activeLogbookBtn.style.color = 'var(--color-white)';
    }

    // --- 4. Interactive Team Photo Section ---
    const teamMembers = {
        'laksa': {
            name: "Laksa",
            shortName: "Laksa",
            shortRole: "Logistic",
            role: "Logistik",
            major: "Teknik Informatika",
            quote: "Memastikan ketersediaan sarana dan prasarana demi kelancaran operasional kegiatan.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/laksalkss?igsh=dDBzOHl4cHYyNHdk",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/LAKSA.JPG"
        },
        'ahmad': {
            name: "Ahmad",
            shortName: "Ahmad",
            shortRole: "Sekretaris",
            role: "Sekretaris",
            major: "Teknik Pertambangan",
            quote: "Mengelola administrasi dengan teliti demi kelancaran dan kerapian setiap program kerja KKN.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/ahmad_firdn?igsh=OHp4OGtybWg0amtj",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/AHMAD.jpeg"
        },
        'sabrina': {
            name: "Sabrina",
            shortName: "Sabrina",
            shortRole: "PDD",
            role: "Publikasi, Dekorasi & Dokumentasi (PDD)",
            major: "Ilmu Komunikasi",
            quote: "Mengabadikan setiap momen bermakna dan mengemas publikasi visual yang kreatif.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/sabrinzahr?igsh=Ymlya2E4cjdlaXZ1",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/SABRINA.JPG?v=" + new Date().getTime()
        },
        'havez': {
            name: "Havez",
            shortName: "Havez",
            shortRole: "Logistic",
            role: "Logistik",
            major: "Teknik Perminyakan",
            quote: "Mendukung eksekusi program dengan manajemen perlengkapan yang sigap, tanggap, dan rapi.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/havezein?igsh=MWJ6dWhraXE2NGc1cA==",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/HAVEZ.JPG"
        },
        'anas': {
            name: "Anas",
            shortName: "Anas",
            shortRole: "Ketua",
            role: "Ketua KKN",
            major: "Akuntansi",
            quote: "Mengayomi dan memimpin tim untuk memberikan dampak positif berkelanjutan bagi Dusun Wungurejo.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/anasrfai_?igsh=c3h3M29oYzV4Mm92",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/ANAS.JPG"
        },
        'nabila': {
            name: "Nabila",
            shortName: "Nabila",
            shortRole: "Humas",
            role: "Hubungan Masyarakat (Humas)",
            major: "Agribisnis",
            quote: "Menjadi jembatan komunikasi yang hangat antara tim KKN dengan masyarakat Wungurejo.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/nabilavnsy._?igsh=cjM4NDNubzdhNjZt",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/NABILA.JPG"
        },
        'fanida': {
            name: "Fanida",
            shortName: "Fanida",
            shortRole: "Bendahara",
            role: "Bendahara",
            major: "Teknik Geologi",
            quote: "Memastikan transparansi dan efisiensi anggaran untuk menunjang keberhasilan pengabdian.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/fanidaby?igsh=YTloaWNnbGtncm5z",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/FANIDA.JPG"
        },
        'lyra': {
            name: "Lyra",
            shortName: "Lyra",
            shortRole: "PDD",
            role: "Publikasi, Dekorasi & Dokumentasi (PDD)",
            major: "Ekonomi Pembangunan",
            quote: "Merangkai dokumentasi menarik untuk menyebarluaskan cerita inspiratif dari desa.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/lyraarthaa?igsh=Y3cwZ3kydHpsb3Y0",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/LYRA.JPG"
        },
        'dian': {
            name: "Dian",
            shortName: "Dian",
            shortRole: "PDD",
            role: "Publikasi, Dekorasi & Dokumentasi (PDD)",
            major: "Manajemen",
            quote: "Menghadirkan desain dan publikasi estetis untuk mendukung setiap agenda kegiatan KKN.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/dianmeutiaa?igsh=cm1uMGx4dXo4eHlv",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/DIAN.JPG"
        },
        'shofa': {
            name: "Shofa",
            shortName: "Shofa",
            shortRole: "Humas",
            role: "Hubungan Masyarakat (Humas)",
            major: "Teknik Kimia",
            quote: "Menjaga silaturahmi dan memfasilitasi informasi secara efektif kepada seluruh warga.",
            iconClass: "fa-solid fa-user",
            instagram: "https://www.instagram.com/shofasalsabilaaw?igsh=MWJhaDQ0ZXo5Njh3Mg==",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/SHOFA.JPG"
        }
    };

    const hotspots = document.querySelectorAll('.hotspot');
    const tooltip = document.getElementById('team-tooltip');
    const svgElement = document.getElementById('team-svg');
    const placeholder = document.getElementById('team-detail-placeholder');
    const content = document.getElementById('team-detail-content');
    const card = document.getElementById('team-detail-card');

    const detailName = document.getElementById('detail-name');
    const detailRole = document.getElementById('detail-role');
    const detailMajor = document.getElementById('detail-major');
    const detailQuote = document.getElementById('detail-quote');
    const detailIcon = document.getElementById('detail-icon');
    const detailPhoto = document.getElementById('detail-photo');
    const detailIg = document.getElementById('detail-ig');
    const detailLi = document.getElementById('detail-li');

    if (hotspots && tooltip && svgElement) {
        hotspots.forEach(hotspot => {
            const id = hotspot.getAttribute('data-member');
            const member = teamMembers[id];

            // Helper to get the highlight element (supports both old cutout- and new clip- prefix)
            const getHighlight = (memberId) => {
                return document.getElementById(`cutout-${memberId}`) || document.getElementById(`clip-${memberId}`);
            };

            // Hover effect to show tooltip, dim others, and highlight
            hotspot.addEventListener('mouseenter', () => {
                if (!member) return;
                tooltip.textContent = `${member.shortName} (${member.shortRole})`;
                tooltip.classList.add('visible');

                // Dim base photo
                const basePhoto = document.getElementById('team-base-photo');
                if (basePhoto) basePhoto.classList.add('dimmed');

                // Activate highlight
                const highlight = getHighlight(id);
                if (highlight) highlight.classList.add('active');
            });

            hotspot.addEventListener('mousemove', (e) => {
                // Position the tooltip based on mouse coordinates relative to svg container
                const rect = svgElement.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y}px`;
            });

            hotspot.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');

                // Restore base photo dimming only if there are no selected highlights
                const hasSelected = document.querySelector('.cutout-overlay.selected, .person-highlight.selected');
                if (!hasSelected) {
                    const basePhoto = document.getElementById('team-base-photo');
                    if (basePhoto) basePhoto.classList.remove('dimmed');
                }

                // Deactivate highlight
                const highlight = getHighlight(id);
                if (highlight) highlight.classList.remove('active');
            });

            // Click effect to select and show profile details
            hotspot.addEventListener('click', () => {
                if (!member) return;

                // Remove selected class from all hotspots
                hotspots.forEach(h => h.classList.remove('selected'));

                // Add selected class to clicked one
                hotspot.classList.add('selected');

                // Remove selected class from all highlight elements and add to current
                const allHighlights = document.querySelectorAll('.cutout-overlay, .person-highlight');
                allHighlights.forEach(c => c.classList.remove('selected'));

                const highlight = getHighlight(id);
                if (highlight) highlight.classList.add('selected');

                // Keep base photo dimmed while someone is selected
                const basePhoto = document.getElementById('team-base-photo');
                if (basePhoto) basePhoto.classList.add('dimmed');

                // Hide placeholder, show content
                if (placeholder) placeholder.classList.add('hidden');
                if (content) content.classList.remove('hidden');

                // Update content details
                if (detailName) detailName.textContent = member.name;
                if (detailRole) detailRole.textContent = member.role;
                if (detailMajor) detailMajor.textContent = member.major;
                if (detailQuote) detailQuote.textContent = `"${member.quote}"`;
                if (detailIg) detailIg.href = member.instagram;

                if (member.photo) {
                    if (detailPhoto) {
                        // Use a placeholder icon while loading
                        detailPhoto.classList.add('hidden');
                        detailPhoto.src = '';
                        if (detailIcon) {
                            detailIcon.classList.remove('hidden');
                            detailIcon.className = "fa-solid fa-spinner fa-spin text-muted"; // Placeholder
                        }

                        const tempImg = new Image();
                        tempImg.onload = () => {
                            // Verify member hasn't changed during load
                            if (detailName && detailName.textContent === member.name) {
                                detailPhoto.src = member.photo;
                                detailPhoto.alt = member.name;
                                detailPhoto.classList.remove('hidden');
                                if (detailIcon) detailIcon.classList.add('hidden');
                            }
                        };
                        tempImg.onerror = () => {
                            if (detailName && detailName.textContent === member.name) {
                                if (detailIcon) {
                                    detailIcon.className = member.iconClass;
                                }
                            }
                        };
                        tempImg.src = member.photo;
                    }
                } else {
                    if (detailPhoto) {
                        detailPhoto.classList.add('hidden');
                        detailPhoto.src = '';
                    }
                    if (detailIcon) {
                        detailIcon.classList.remove('hidden');
                        detailIcon.className = member.iconClass;
                    }
                }

                // Trigger animation
                if (content) {
                    content.style.animation = 'none';
                    // Trigger reflow
                    void content.offsetWidth;
                    content.style.animation = 'detailFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }

                // Highlight card border temporary
                if (card) {
                    card.style.borderColor = 'var(--color-primary)';
                    setTimeout(() => {
                        card.style.borderColor = 'rgba(108, 8, 32, 0.04)';
                    }, 500);
                }
            });
        });
    }

    // --- 4b. Click Outside to Deselect Member ---
    document.addEventListener('click', (e) => {
        const photoWrapper = document.querySelector('.team-photo-wrapper');
        const detailCard = document.getElementById('team-detail-card');

        if (photoWrapper && detailCard) {
            // If click is outside the photo wrapper AND outside the detail card
            if (!photoWrapper.contains(e.target) && !detailCard.contains(e.target)) {
                // Remove selected class from all hotspots
                if (hotspots) hotspots.forEach(h => h.classList.remove('selected'));

                // Remove selected class from all highlight elements
                const allHighlights = document.querySelectorAll('.cutout-overlay, .person-highlight');
                allHighlights.forEach(c => c.classList.remove('selected'));

                // Undim base photo
                const basePhoto = document.getElementById('team-base-photo');
                if (basePhoto) basePhoto.classList.remove('dimmed');

                // Restore placeholder and hide details
                if (placeholder) placeholder.classList.remove('hidden');
                if (content) content.classList.add('hidden');
                if (detailPhoto) {
                    detailPhoto.classList.add('hidden');
                    detailPhoto.src = '';
                }
                if (detailIcon) {
                    detailIcon.classList.remove('hidden');
                }
            }
        }
    });

    // --- 5. Guestbook (Static - WhatsApp & Google Form) ---
    // Form diarahkan ke WhatsApp & Google Form langsung dari HTML (tidak ada form input).

    // Dynamic premium toast notification helper
    const showNotification = (message, type = "success") => {
        let toast = document.getElementById('custom-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'custom-toast';
            toast.style.position = 'fixed';
            toast.style.bottom = '30px';
            toast.style.right = '30px';
            toast.style.zIndex = '10000';
            toast.style.padding = '16px 28px';
            toast.style.borderRadius = '12px';
            toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
            toast.style.color = '#FFFFFF';
            toast.style.fontWeight = '600';
            toast.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.background = type === "success" ? "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)" : "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)";

        // Show
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 50);

        // Hide after 5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
        }, 5000);
    };

    // --- Details Modal & Image Slider Logic ---
    const detailsModal = document.getElementById('details-modal');
    const modalCategoryBadge = document.getElementById('modal-category-badge');
    const modalDate = document.getElementById('modal-date');
    const modalTitle = document.getElementById('modal-title');
    const modalMarkdownContent = document.getElementById('modal-markdown-content');
    const modalGallerySide = document.getElementById('modal-gallery-side');
    const carouselTrack = document.getElementById('carousel-track');
    const carouselDotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');

    let currentSlideIndex = 0;
    let activeImages = [];

    const openDetailsModal = (item, itemType) => {
        if (!detailsModal) return;

        // Reset slide index
        currentSlideIndex = 0;

        // Set title
        if (modalTitle) modalTitle.textContent = item.title;

        // Format and render description
        const rawContent = itemType === 'Proker' ? item.description_markdown : item.content_markdown;
        if (modalMarkdownContent) {
            modalMarkdownContent.innerHTML = typeof marked !== 'undefined' ? marked.parse(rawContent) : rawContent;
        }

        // Set badge and date
        if (modalCategoryBadge) {
            modalCategoryBadge.textContent = itemType === 'Proker' ? item.type : item.phase;
            modalCategoryBadge.className = 'badge'; // reset
            if (itemType === 'Proker') {
                modalCategoryBadge.classList.add(item.type === 'Proker Bersama' ? 'badge-success' : 'badge-info');
            } else {
                modalCategoryBadge.classList.add(item.phase === 'Pra-KKN' ? 'badge-warning' : 'badge-success');
            }
        }

        if (modalDate) {
            if (itemType === 'Logbook') {
                const dateObj = new Date(item.date);
                const formattedDate = isNaN(dateObj.getTime()) ? item.date : dateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                modalDate.textContent = formattedDate;
                modalDate.style.display = 'inline-block';
            } else {
                modalDate.textContent = `Status: ${item.status}`;
                modalDate.style.display = 'inline-block';
            }
        }

        // Handle Image Gallery
        activeImages = item.image_urls || [];
        if (activeImages.length === 0) {
            if (modalGallerySide) modalGallerySide.style.display = 'none';
        } else {
            if (modalGallerySide) modalGallerySide.style.display = 'block';

            // Build carousel slides
            if (carouselTrack) {
                carouselTrack.innerHTML = '';
                activeImages.forEach((imgUrl, idx) => {
                    const slide = document.createElement('div');
                    slide.className = 'carousel-slide';

                    const fullUrl = imgUrl;

                    slide.innerHTML = `<img src="${fullUrl}" alt="Slide ${idx + 1}" class="carousel-image">`;

                    // Click to Zoom
                    slide.querySelector('img').addEventListener('click', () => {
                        openLightbox(fullUrl);
                    });

                    carouselTrack.appendChild(slide);
                });
            }

            // Build dot indicators
            if (carouselDotsContainer) {
                carouselDotsContainer.innerHTML = '';
                activeImages.forEach((_, idx) => {
                    const dot = document.createElement('span');
                    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
                    dot.addEventListener('click', () => {
                        goToSlide(idx);
                    });
                    carouselDotsContainer.appendChild(dot);
                });
            }

            // Update slide positioning
            updateCarousel();
        }

        // Show modal with transition
        detailsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    };

    window.closeDetailsModal = () => {
        if (detailsModal) detailsModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore body scroll
        // Restore gallery side (may have been hidden by openBlogModal)
        const gallerySide = document.getElementById('modal-gallery-side');
        if (gallerySide) gallerySide.style.display = '';
    };

    // Carousel Navigation
    const updateCarousel = () => {
        if (!carouselTrack) return;
        const offset = -currentSlideIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;

        // Update dots
        if (carouselDotsContainer) {
            const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                if (idx === currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Show/hide arrows based on index / wrap-around
        if (prevBtn) prevBtn.style.display = activeImages.length <= 1 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = activeImages.length <= 1 ? 'none' : 'flex';
    };

    const goToSlide = (index) => {
        if (index < 0) {
            currentSlideIndex = activeImages.length - 1;
        } else if (index >= activeImages.length) {
            currentSlideIndex = 0;
        } else {
            currentSlideIndex = index;
        }
        updateCarousel();
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentSlideIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentSlideIndex + 1);
        });
    }

    // Touch support (swipe) for Carousel
    let touchStartX = 0;
    let touchEndX = 0;

    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    const handleSwipe = () => {
        const threshold = 50; // swipe minimum distance in pixels
        if (touchStartX - touchEndX > threshold) {
            // Swiped left, next slide
            goToSlide(currentSlideIndex + 1);
        } else if (touchEndX - touchStartX > threshold) {
            // Swiped right, prev slide
            goToSlide(currentSlideIndex - 1);
        }
    };

    // --- Lightbox Zoom Logic ---
    const openLightbox = (imgUrl) => {
        if (!lightboxOverlay || !lightboxImage) return;
        lightboxImage.src = imgUrl;
        lightboxOverlay.classList.remove('hidden');
    };
    window.openLightbox = openLightbox;

    window.closeLightbox = () => {
        if (lightboxOverlay) lightboxOverlay.classList.add('hidden');
    };

    // --- Dark Mode Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('kkn-theme');
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.removeAttribute('data-theme');
                localStorage.setItem('kkn-theme', 'light');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('kkn-theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
        });
    }

    // --- 6. Gallery (Static) ---
    const fetchGallery = () => {
        const galleryContainer = document.getElementById('masonry-gallery-container');
        if (!galleryContainer) return;

        // ================================================================
        // EDIT DATA GALERI DI SINI:
        // ================================================================
        const galleryItems = [
            { id: 1, title: "Posko KKN AB 84.095", description: "Suasana posko kami di Dusun Wungurejo.", image_url: "assets/images/Gunung kidul.jpg", date: "2026-07-01" },
            { id: 2, title: "Kunjungan UMKM Madu TBS", description: "Foto bersama Bapak Sutadi, pemilik UMKM Madu Klanceng TBS di Dusun Wungurejo.", image_url: "assets/GaleriUMKM/Fotobersamapaksutadimadutbs.jpeg", date: "2026-07-06" }
        ];

        galleryContainer.innerHTML = '';

        if (galleryItems.length === 0) {
            galleryContainer.innerHTML = `<div style="text-align: center; width: 100%; padding: 40px; color: var(--color-text-muted); grid-column: 1 / -1;">Belum ada foto galeri.</div>`;
            return;
        }

        galleryItems.forEach(item => {
            const fullUrl = item.image_url;
            const dateObj = new Date(item.date);
            const formattedDate = isNaN(dateObj.getTime()) ? item.date : dateObj.toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const html = `
                <div class="gallery-item" data-aos="zoom-in" onclick="openLightbox('${fullUrl}')">
                    <img src="${fullUrl}" alt="${escapeHTML(item.title)}" class="gallery-img" loading="lazy">
                    <div class="gallery-info">
                        <h4 class="gallery-title">${escapeHTML(item.title)}</h4>
                        <span class="gallery-date">${formattedDate}</span>
                        ${item.description ? `<p style="font-size: 0.8rem; margin-top: 5px; color: #eee;">${escapeHTML(item.description)}</p>` : ''}
                    </div>
                </div>
            `;
            galleryContainer.insertAdjacentHTML('beforeend', html);
        });
        if (typeof AOS !== 'undefined') AOS.refresh();
    };

    // --- 12. Blog (Static) ---
    const fetchBlogs = () => {
        const blogContainer = document.getElementById('blog-grid-container');
        if (!blogContainer) return;

        // ================================================================
        // EDIT DATA ARTIKEL/BLOG DI SINI:
        // ================================================================
        const blogs = [
            { id: 1, title: "Mengenal Dusun Wungurejo: Antara Tradisi dan Potensi", content_markdown: "Dusun Wungurejo, yang berarti 'bunga yang tumbuh subur di daerah makmur', menyimpan kekayaan budaya dan potensi alam yang luar biasa. Mulai dari kesenian Reog, madu klanceng, hingga kerajinan popor kayu yang mendunia.\n\nKKN AB 84.095 hadir untuk membantu mengoptimalkan semua potensi tersebut menjadi kekuatan ekonomi dan budaya yang berkelanjutan.", thumbnail_url: "assets/images/Gunung kidul.jpg", date: "2026-07-01" }
        ];

        window.blogData = blogs;
        renderBlogCards(blogs);
    };

    // Render blog cards Ã¢â‚¬â€ called on fetch and on language switch
    const renderBlogCards = (blogs) => {
        const blogContainer = document.getElementById('blog-grid-container');
        if (!blogContainer) return;

        // Read active language dictionary
        const lang = (window.currentLang && window.translations)
            ? window.translations[window.currentLang]
            : null;
        const t = (key, fallback) => (lang && lang[key]) ? lang[key] : fallback;

        blogContainer.innerHTML = '';

        if (!blogs || blogs.length === 0) {
            blogContainer.innerHTML = `<div style="text-align: center; width: 100%; padding: 40px; color: var(--color-text-muted); grid-column: 1 / -1;">${t('blog_empty', 'Belum ada artikel.')}</div>`;
            return;
        }

        blogs.forEach(item => {
            // Format date Ã¢â‚¬â€ respects locale of active language
            const locale = (window.currentLang === 'en') ? 'en-US' : 'id-ID';
            const dateObj = new Date(item.date);
            const formattedDate = isNaN(dateObj.getTime()) ? item.date : dateObj.toLocaleDateString(locale, {
                day: 'numeric', month: 'short', year: 'numeric'
            });

            // Generate excerpt from markdown
            let parsedHTML = item.content_markdown;
            if (typeof marked !== 'undefined') parsedHTML = marked.parse(item.content_markdown);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = parsedHTML;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';
            const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');

            const thumbnail = item.thumbnail_url
                ? item.thumbnail_url
                : 'assets/logo/LogoKKNBaru.png';

            const readMoreText = t('blog_read_more', 'Baca Selengkapnya');

            const html = `
                <div class="blog-card" data-aos="fade-up" onclick="openBlogModal(${item.id})">
                    <div class="blog-img-wrap">
                        <img src="${thumbnail}" alt="${escapeHTML(item.title)}" loading="lazy">
                        <div class="blog-date">${formattedDate}</div>
                    </div>
                    <div class="blog-content">
                        <h3>${escapeHTML(item.title)}</h3>
                        <p class="blog-excerpt">${excerpt}</p>
                        <div class="btn-read-more">${readMoreText} <i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                </div>
            `;
            blogContainer.insertAdjacentHTML('beforeend', html);
        });

        // Refresh AOS
        if (typeof AOS !== 'undefined') AOS.refresh();
    };

    // Re-render blog cards when language changes (UI labels only)
    document.addEventListener('langChanged', () => {
        if (window.blogData) renderBlogCards(window.blogData);
    });

    window.openBlogModal = (id) => {
        if (!window.blogData) return;
        const blog = window.blogData.find(b => b.id === id);
        if (!blog) return;

        const overlay = document.getElementById('blog-reader-modal');
        const heroImg = document.getElementById('blog-reader-hero-img');
        const heroPlaceholder = document.getElementById('blog-reader-hero-placeholder');
        const badge = document.getElementById('blog-reader-badge');
        const dateEl = document.getElementById('blog-reader-date');
        const titleEl = document.getElementById('blog-reader-title');
        const contentEl = document.getElementById('blog-reader-content');

        if (!overlay) return;

        // --- Hero image ---
        if (blog.thumbnail_url) {
            const fullUrl = blog.thumbnail_url;
            heroImg.src = fullUrl;
            heroImg.alt = escapeHTML(blog.title);
            heroImg.classList.remove('hidden');
            if (heroPlaceholder) heroPlaceholder.classList.add('hidden');
        } else {
            heroImg.classList.add('hidden');
            if (heroPlaceholder) heroPlaceholder.classList.remove('hidden');
        }

        // --- Badge & Date ---
        if (badge) badge.textContent = 'Artikel';
        if (dateEl) {
            const d = new Date(blog.date);
            dateEl.textContent = isNaN(d.getTime())
                ? blog.date
                : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        // --- Title & Content ---
        if (titleEl) titleEl.textContent = blog.title;

        let html = blog.content_markdown || '';
        if (typeof marked !== 'undefined') html = marked.parse(html);
        if (contentEl) contentEl.innerHTML = html;

        // --- Open ---
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeBlogReaderModal = (event) => {
        if (event && event.target !== document.getElementById('blog-reader-modal')) return;
        const overlay = document.getElementById('blog-reader-modal');
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = '';
    };


    // --- 11. WebGIS Initialization ---
    const initWebGIS = () => {
        const mapContainer = document.getElementById('webgis-map');
        if (!mapContainer || typeof L === 'undefined') return;

        // Koordinat area Dusun Wungurejo (Berdasarkan foto peta aktual)
        const wungurejoCoords = [-7.874, 110.605];

        const map = L.map('webgis-map').setView(wungurejoCoords, 15);

        // Tambahkan Tile Layer (OpenStreetMap - 100% Gratis)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Ã‚Â© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Buat Custom Icon untuk Marker
        const createCustomIcon = (color, iconClass) => {
            return L.divIcon({
                className: 'custom-leaflet-icon',
                html: `<div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;"><i class="${iconClass}"></i></div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 34],
                popupAnchor: [0, -34]
            });
        };

        // --- 1. GARIS BATAS WILAYAH DUSUN (POLYGON) ---
        // Koordinat batas wilayah presisi (Mengikuti kontur garis merah lengkap dari peta)
        const wungurejoBoundary = [
            [-7.8705, 110.6065], // Titik paling utara (Barat laut Griya Sehat)
            [-7.8705, 110.6085], // Timur laut
            [-7.8740, 110.6090], // Timur atas
            [-7.8770, 110.6105], // Timur tengah (tonjolan ke luar)
            [-7.8800, 110.6090], // Timur bawah
            [-7.8830, 110.6075], // Tenggara
            [-7.8840, 110.6060], // Ujung paling selatan
            [-7.8825, 110.6045], // Barat daya
            [-7.8790, 110.6040], // Barat bawah
            [-7.8750, 110.6045], // Barat tengah
            [-7.8720, 110.6055]  // Barat atas
        ];

        // Gambar area polygon di peta
        const desaPolygon = L.polygon(wungurejoBoundary, {
            color: '#6C0820',      // Warna garis tepi (Tema KKN)
            weight: 3,             // Ketebalan garis
            opacity: 0.8,
            fillColor: '#6C0820',  // Warna isian area
            fillOpacity: 0.1       // Sangat transparan agar jalan di bawahnya tetap terlihat
        }).addTo(map);

        // Pop-up saat area desa diklik (bukan di markernya)
        desaPolygon.bindPopup(`
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; text-align: center;">
                <h4 style="margin: 0; color: #6C0820; font-weight: 800;">Wilayah Dusun Wungurejo</h4>
                <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #666;">Estimasi Pemetaan Area KKN 84.095</p>
            </div>
        `);

        // --- 2. DATA TITIK LOKASI (MARKERS) DARI PETA ASLI ---
        const locations = [
            {
                name: "Posko KKN 84.095",
                coords: [-7.874000, 110.605389], // Presisi dari 7Ã‚Â°52'26.4"S 110Ã‚Â°36'19.4"E
                color: "#6C0820",
                icon: "fa-solid fa-house-user",
                desc: "Pusat koordinasi dan tempat tinggal mahasiswa KKN selama mengabdi.",
                type: "Posko Utama"
            },
            {
                name: "Balai Padukuhan Wungurejo",
                coords: [-7.873732597455154, 110.60495672624596], // Presisi dari user
                color: "#4A90E2",
                icon: "fa-solid fa-landmark",
                desc: "Pusat administrasi dusun dan lokasi berbagai sosialisasi proker.",
                type: "Fasilitas Umum"
            },
            {
                name: "Masjid Al Amin",
                coords: [-7.873480286219351, 110.60479159365966], // Dikoreksi oleh user
                color: "#9B59B6",
                icon: "fa-solid fa-mosque",
                desc: "Pusat kegiatan ibadah kemasyarakatan dan pendidikan keagamaan warga.",
                type: "Fasilitas Ibadah"
            },
            {
                name: "Pengrajin Popor",
                coords: [-7.874912049612724, 110.60471903789087], // Presisi dari user
                color: "#F5A623",
                icon: "fa-solid fa-hammer",
                desc: "Usaha kerajinan popor kayu, potensi UMKM unggulan Dusun Wungurejo.",
                type: "UMKM Lokal"
            },
            {
                name: "Toko Qutis",
                coords: [-7.873920390437767, 110.60660252927839], // Presisi dari user
                color: "#1ABC9C",
                icon: "fa-solid fa-store",
                desc: "Salah satu warung kelontong penggerak ekonomi mikro warga.",
                type: "UMKM Lokal"
            },
            {
                name: "Makam Punthuk",
                coords: [-7.875043496517649, 110.60667095892298], // Presisi dari user
                color: "#7F8C8D",
                icon: "fa-solid fa-cross",
                desc: "Situs pemakaman bersejarah yang menjadi bagian dari warisan budaya Dusun Wungurejo.",
                type: "Situs Budaya"
            },
            {
                name: "Peternak Ikan Sugino Wiryo",
                coords: [-7.879900709814317, 110.60831684355774],
                color: "#3498DB",
                icon: "fa-solid fa-fish",
                desc: "Usaha budidaya perikanan lokal, potensi UMKM peternakan ikan di Dusun Wungurejo.",
                type: "UMKM Lokal"
            },
            {
                name: "TPQ Tarbiyatul Muchcinin",
                coords: [-7.8765467110434555, 110.60488574061534],
                color: "#27AE60",
                icon: "fa-solid fa-book-quran",
                desc: "Pusat pendidikan agama dan taman bacaan Al-Quran bagi anak-anak dusun.",
                type: "Pendidikan & Agama"
            },
            {
                name: "Masjid Darussalam",
                coords: [-7.880814014201857, 110.607250621794], // Presisi dari user
                color: "#8E44AD",
                icon: "fa-solid fa-mosque",
                desc: "Masjid Darussalam, pusat ibadah dan kegiatan keagamaan warga Wungurejo.",
                type: "Fasilitas Ibadah"
            }
        ];

        // --- 3. RENDER MARKERS KE PETA ---
        locations.forEach((loc, index) => {
            const marker = L.marker(loc.coords, { icon: createCustomIcon(loc.color, loc.icon) }).addTo(map);

            const popupContent = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px; padding: 5px;">
                    <span data-lang-key="map_loc_${index}_type" style="display: inline-block; padding: 4px 8px; border-radius: 20px; background-color: ${loc.color}15; font-size: 0.7rem; font-weight: 800; color: ${loc.color}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">${loc.type}</span>
                    <h4 data-lang-key="map_loc_${index}_name" style="margin: 0 0 8px 0; font-size: 1.15rem; color: #2C3E50; font-weight: 800; line-height: 1.2;">${loc.name}</h4>
                    <p data-lang-key="map_loc_${index}_desc" style="margin: 0; font-size: 0.85rem; color: #666; line-height: 1.5;">${loc.desc}</p>
                </div>
            `;

            marker.bindPopup(popupContent);
        });

        // Apply language translation automatically when a popup opens
        map.on('popupopen', function () {
            if (typeof applyLanguage === 'function' && typeof currentLang !== 'undefined') {
                applyLanguage(currentLang);
            }
        });
    };

    // --- 11. SMART WEATHER DASHBOARD ---
    const initWeatherDashboard = async () => {
        const loader = document.getElementById('weather-loader');
        const content = document.getElementById('weather-content');
        if (!loader || !content) return;

        try {
            // Wungurejo coords approx: Lat -7.874, Lon 110.605
            const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.874&longitude=110.605&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code&timezone=Asia%2FJakarta');
            const data = await res.json();
            
            const current = data.current;
            const temp = Math.round(current.temperature_2m);
            const humidity = current.relative_humidity_2m;
            const precip = current.precipitation;
            const code = current.weather_code;
            const isDay = current.is_day === 1;

            // Map WMO Code to FontAwesome and Description
            let iconClass = 'fa-cloud';
            let desc = 'Berawan';
            let iconColor = '#A6ADC8';
            let advice = 'Cuaca normal. Waktu yang baik untuk aktivitas harian di kebun atau memeriksa kolam ikan.';

            if (code === 0) {
                desc = 'Cerah';
                iconClass = isDay ? 'fa-sun' : 'fa-moon';
                iconColor = isDay ? '#FFA500' : '#F1C40F';
                if (temp > 30) advice = 'Cuaca terik! Waktu yang tepat untuk mengeringkan hasil panen. Tunda penyemprotan Eco Enzyme cair ke daun tanaman agar tidak gosong.';
                else advice = 'Cuaca cerah yang mendukung! Bagus untuk menyiram tanaman dengan pupuk organik cair / Eco Enzyme pada pangkal batang.';
            } else if (code >= 1 && code <= 3) {
                desc = 'Cerah Berawan';
                iconClass = isDay ? 'fa-cloud-sun' : 'fa-cloud-moon';
                iconColor = '#F39C12';
                advice = 'Kondisi ideal untuk berbagai aktivitas pertanian, penanaman bibit baru, maupun penyiraman pestisida nabati.';
            } else if (code === 45 || code === 48) {
                desc = 'Berkabut';
                iconClass = 'fa-smog';
                advice = 'Kabut membatasi jarak pandang. Jaga kelembapan kandang ternak dan hindari pemupukan daun sementara waktu.';
            } else if (code >= 51 && code <= 55) {
                desc = 'Gerimis';
                iconClass = 'fa-cloud-rain';
                iconColor = '#3498DB';
                advice = 'Tanah sudah basah oleh gerimis. Kurangi volume penyiraman manual untuk menghemat persediaan air tanah.';
            } else if (code >= 61 && code <= 65) {
                desc = 'Hujan';
                iconClass = 'fa-cloud-showers-heavy';
                iconColor = '#2980B9';
                advice = 'Hujan turun! Segera siapkan wadah penampung air hujan (bisa dicampur sedikit Eco Enzyme untuk menjernihkan). Jangan menyemprot pupuk daun karena akan larut.';
            } else if (code >= 71 && code <= 75) {
                desc = 'Salju / Es';
                iconClass = 'fa-snowflake';
            } else if (code >= 95 && code <= 99) {
                desc = 'Badai Petir';
                iconClass = 'fa-cloud-bolt';
                iconColor = '#8E44AD';
                advice = 'Cuaca ekstrem! Hentikan aktivitas di lahan terbuka atau sawah. Pastikan saluran pembuangan air di kolam lele tidak mampet.';
            }

            // Update DOM
            document.getElementById('weather-temp').textContent = `${temp}°C`;
            document.getElementById('weather-desc').textContent = desc;
            document.getElementById('weather-humidity').textContent = `${humidity}%`;
            document.getElementById('weather-precip').textContent = `${precip} mm`;
            
            const iconBox = document.getElementById('weather-icon-box');
            iconBox.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
            iconBox.style.color = iconColor;
            
            document.getElementById('weather-advice').textContent = advice;

            // Show content
            loader.style.display = 'none';
            content.style.display = 'flex'; // Changed to flex to match CSS

        } catch (err) {
            console.warn('Failed to fetch real-time weather data. Using fallback static data.', err);
            
            // Fallback Static Data (Simulating a nice day in Wungurejo)
            const temp = 26;
            const humidity = 85;
            const precip = 0;
            const iconClass = 'fa-cloud-sun';
            const iconColor = '#F39C12';
            const desc = 'Cerah Berawan';
            const advice = '(Mode Offline) Kondisi ideal untuk berbagai aktivitas pertanian, penanaman bibit baru, maupun penyiraman pestisida nabati.';

            // Update DOM with Fallback Data
            document.getElementById('weather-temp').textContent = `${temp}°C`;
            document.getElementById('weather-desc').textContent = desc;
            document.getElementById('weather-humidity').textContent = `${humidity}%`;
            document.getElementById('weather-precip').textContent = `${precip} mm`;
            
            const iconBox = document.getElementById('weather-icon-box');
            iconBox.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
            iconBox.style.color = iconColor;
            
            document.getElementById('weather-advice').textContent = advice;

            // Change Live badge to indicate Offline mode gracefully
            const liveBadge = document.querySelector('.weather-status-live');
            if (liveBadge) {
                liveBadge.style.background = 'rgba(243, 156, 18, 0.1)';
                liveBadge.style.color = '#F39C12';
                liveBadge.innerHTML = '<i class="fa-solid fa-wifi-slash"></i> <span data-lang-key="weather_live">Data Statis</span>';
            }

            // Show content
            loader.style.display = 'none';
            content.style.display = 'flex';
        }
    };

    // --- 12. SCROLLYTELLING IMPACT REPORT ---
    const initScrollytelling = () => {
        const container = document.getElementById('gallery-scrolly-trigger');
        const texts = [
            document.getElementById('scroll-text-1'),
            document.getElementById('scroll-text-2'),
            document.getElementById('scroll-text-3'),
            document.getElementById('scroll-text-4')
        ];

        if (!container || texts.some(t => !t)) return;

        // Initialize all texts as hidden
        texts.forEach(t => {
            t.style.opacity = '0';
            t.style.transform = 'translate(-50%, -50%) scale(0.92)';
        });

        const updateScrolly = () => {
            const rect = container.getBoundingClientRect();
            const endScroll = container.offsetHeight - window.innerHeight;

            // Not yet in view — hide all
            if (rect.top > 0) {
                texts.forEach(t => {
                    t.style.opacity = '0';
                    t.style.transform = 'translate(-50%, -50%) scale(0.92)';
                });
                return;
            }

            const scrollProgress = Math.min(1, Math.max(0, Math.abs(rect.top) / endScroll));
            const totalTexts = texts.length;
            const segmentSize = 1 / totalTexts;
            const activeIndex = Math.min(totalTexts - 1, Math.floor(scrollProgress / segmentSize));

            texts.forEach((text, index) => {
                let opacity = 0;
                let scale = 0.92;

                if (index === activeIndex) {
                    const segStart = index * segmentSize;
                    const posInSeg = (scrollProgress - segStart) / segmentSize;

                    // Fade IN first 20%, hold 60%, fade OUT last 20%
                    if (posInSeg < 0.2) {
                        opacity = posInSeg / 0.2;
                    } else if (posInSeg > 0.8 && index < totalTexts - 1) {
                        opacity = (1 - posInSeg) / 0.2;
                    } else {
                        opacity = 1;
                    }
                    // Scale eases in with opacity for a satisfying pop
                    scale = 0.92 + (0.08 * Math.min(opacity * 1.5, 1));
                }

                text.style.opacity = opacity;
                text.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
            });

            // Update progress dots
            const dots = document.querySelectorAll('.scrolly-dot');
            dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
        };

        window.addEventListener('scroll', updateScrolly, { passive: true });
        updateScrolly(); // run once on load
    };

    // Load static data on startup
    renderProkers('all');
    renderLogbook('all');
    fetchGallery();
    fetchBlogs();
    initWeatherDashboard();
    initScrollytelling();

    // --- 13. DEMOGRAPHICS ANIMATION (CHART & COUNTER) ---
    const initDemographics = () => {
        // 1. Chart.js for Gender Ratio
        const ctx = document.getElementById('genderChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Laki-laki', 'Perempuan'],
                    datasets: [{
                        data: [230, 207],
                        backgroundColor: ['#4A90E2', '#FF6B9D'], // Blue & Pink
                        borderWidth: 0,
                        hoverOffset: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            padding: 10,
                            callbacks: {
                                label: function (context) {
                                    return ' ' + context.label + ': ' + context.raw + ' Jiwa';
                                }
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }

        // 2. Counter-Up Animation
        const counters = document.querySelectorAll('.counter-up');
        const speed = 100; // Lower is slower

        const animateCounters = () => {
            counters.forEach(counter => {
                counter.innerText = '0'; // Reset to 0
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    // Calculate increment based on target size to ensure they finish around the same time
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        };

        // Trigger animation when scrolled into view using IntersectionObserver
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    obs.disconnect(); // Run only once
                }
            });
        }, { threshold: 0.3 });

        const demoSection = document.querySelector('.demographics-container');
        if (demoSection) {
            observer.observe(demoSection);
        }
    };

    // Initialize after a slight delay to ensure DOM is fully ready
    setTimeout(initDemographics, 500);

    // Initialize WebGIS Map safely
    setTimeout(initWebGIS, 500);

    // --- 13. Kunang-Kunang Custom Canvas (Theme-Aware Firefly Engine) ---
    const initFireflies = () => {
        const canvas = document.getElementById('firefly-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const FIREFLY_COUNT = 35;
        const REPULSE_RADIUS = 110;
        const REPULSE_STRENGTH = 4;

        // Theme-aware config
        const getThemeConfig = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            return isDark ? {
                colors: ['#FFD700', '#FFF8A0', '#FFE066', '#FFFACD'],
                opacityMin: 0.15,
                opacityRange: 0.45,
                glowMin: 4,
                glowRange: 7,
                radiusMin: 0.8,
                radiusRange: 1.4,
                shadowBlur: 6,
                opacityDeltaBase: 0.004,
            } : {
                // Light mode: very subtle, warm amber dots Ã¢â‚¬â€ nearly invisible, elegant
                colors: ['#B8860B', '#DAA520', '#C8A000', '#A07800'],
                opacityMin: 0.04,
                opacityRange: 0.10,
                glowMin: 2,
                glowRange: 3,
                radiusMin: 0.5,
                radiusRange: 0.8,
                shadowBlur: 0,
                opacityDeltaBase: 0.002,
            };
        };

        let mouse = { x: -9999, y: -9999 };
        let fireflies = [];
        let animId;
        let currentConfig = getThemeConfig();

        // Resize canvas to match viewport
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Track mouse globally on window
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Click to spawn extra fireflies
        window.addEventListener('click', (e) => {
            const cfg = getThemeConfig();
            for (let i = 0; i < 5; i++) {
                fireflies.push(createFirefly(e.clientX, e.clientY, cfg));
            }
            if (fireflies.length > FIREFLY_COUNT + 30) {
                fireflies.splice(0, fireflies.length - FIREFLY_COUNT);
            }
        });

        // Re-apply theme when dark mode is toggled
        const themeObserver = new MutationObserver(() => {
            currentConfig = getThemeConfig();
            // Smoothly update existing fireflies to new theme config
            fireflies.forEach(f => {
                f.color = currentConfig.colors[Math.floor(Math.random() * currentConfig.colors.length)];
                f.opacityDelta = (Math.random() > 0.5 ? 1 : -1) * (currentConfig.opacityDeltaBase + Math.random() * 0.003);
                f.glowSize = currentConfig.glowMin + Math.random() * currentConfig.glowRange;
                f.radius = currentConfig.radiusMin + Math.random() * currentConfig.radiusRange;
                // Clamp opacity to new range
                f.opacity = Math.min(f.opacity, currentConfig.opacityMin + currentConfig.opacityRange);
            });
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        const createFirefly = (x, y, cfg) => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.25 + Math.random() * 0.7;
            cfg = cfg || getThemeConfig();
            return {
                x: x !== undefined ? x : Math.random() * canvas.width,
                y: y !== undefined ? y : Math.random() * canvas.height,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: cfg.radiusMin + Math.random() * cfg.radiusRange,
                color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
                opacity: cfg.opacityMin + Math.random() * cfg.opacityRange * 0.6,
                opacityDelta: (Math.random() > 0.5 ? 1 : -1) * (cfg.opacityDeltaBase + Math.random() * 0.003),
                glowSize: cfg.glowMin + Math.random() * cfg.glowRange,
                opacityMax: cfg.opacityMin + cfg.opacityRange,
                opacityFloor: cfg.opacityMin,
            };
        };

        // Init fireflies
        for (let i = 0; i < FIREFLY_COUNT; i++) {
            fireflies.push(createFirefly());
        }

        const animate = () => {
            const cfg = currentConfig;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            fireflies.forEach(f => {
                // Pulsing opacity (blink)
                f.opacity += f.opacityDelta;
                if (f.opacity >= f.opacityMax) { f.opacity = f.opacityMax; f.opacityDelta *= -1; }
                if (f.opacity <= f.opacityFloor) { f.opacity = f.opacityFloor; f.opacityDelta *= -1; }

                // Mouse repulse
                const dx = f.x - mouse.x;
                const dy = f.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < REPULSE_RADIUS && dist > 0) {
                    const force = (REPULSE_RADIUS - dist) / REPULSE_RADIUS;
                    f.vx += (dx / dist) * force * REPULSE_STRENGTH * 0.07;
                    f.vy += (dy / dist) * force * REPULSE_STRENGTH * 0.07;
                }

                // Dampen velocity
                f.vx *= 0.97;
                f.vy *= 0.97;

                // Keep minimum drift
                const spd = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
                if (spd < 0.18) {
                    const a = Math.atan2(f.vy, f.vx);
                    f.vx = Math.cos(a) * 0.25;
                    f.vy = Math.sin(a) * 0.25;
                }

                // Move
                f.x += f.vx;
                f.y += f.vy;

                // Wrap edges
                if (f.x < -10) f.x = canvas.width + 10;
                if (f.x > canvas.width + 10) f.x = -10;
                if (f.y < -10) f.y = canvas.height + 10;
                if (f.y > canvas.height + 10) f.y = -10;

                // Parse hex color
                const cr = parseInt(f.color.slice(1, 3), 16);
                const cg = parseInt(f.color.slice(3, 5), 16);
                const cb = parseInt(f.color.slice(5, 7), 16);

                // Draw glow halo (only if significant)
                if (f.glowSize > 2) {
                    const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glowSize);
                    glow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${f.opacity * 0.6})`);
                    glow.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.beginPath();
                    ctx.arc(f.x, f.y, f.glowSize, 0, Math.PI * 2);
                    ctx.fillStyle = glow;
                    ctx.fill();
                }

                // Draw core dot
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
                ctx.fillStyle = f.color;
                ctx.globalAlpha = f.opacity;
                if (cfg.shadowBlur > 0) {
                    ctx.shadowBlur = cfg.shadowBlur;
                    ctx.shadowColor = f.color;
                }
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            });

            animId = requestAnimationFrame(animate);
        };

        animate();
    };

    initFireflies();

    // Initialize Weather Dashboard
    initWeatherDashboard();



    // --- Pillar Card Hover Animation (JS-driven to bypass AOS lock) ---
    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach(card => {
        // Set base transition via JS so it always applies
        card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease, border-color 0.3s ease';

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(108, 8, 32, 0.12)';
            card.style.borderColor = 'rgba(108, 8, 32, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.borderColor = '';
        });

        card.addEventListener('mousedown', () => {
            card.style.transform = 'translateY(-2px) scale(0.97)';
            card.style.boxShadow = '0 6px 16px rgba(108, 8, 32, 0.06)';
        });

        card.addEventListener('mouseup', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(108, 8, 32, 0.12)';
        });
    });
});

