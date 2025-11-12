document.addEventListener('DOMContentLoaded', () => {

    // --- Ambil Elemen DOM ---
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const continueButton = document.getElementById('continueButton');
    const loginForm = document.getElementById('loginForm');
    const btnStudent = document.getElementById('btn-student');
    const btnTutor = document.getElementById('btn-tutor');
    
    // Elemen Peringatan Baru
    const loginWarning = document.getElementById('loginWarning');

    // --- Daftar Username Tutor yang Valid ---
    // (Daftar ini HARUS SAMA dengan ID tutor di data Anda)
    const validTutorUsernames = [
        '1', '2', '3', '4'
    ];

    // --- Fungsi Validasi Form (Aktifkan Tombol) ---
    function validateForm() {
        const isUsernameFilled = usernameInput.value.trim() !== '';
        const isPasswordFilled = passwordInput.value.trim() !== '';

        if (isUsernameFilled && isPasswordFilled) {
            continueButton.disabled = false; 
        } else {
            continueButton.disabled = true; 
        }
        
        // Sembunyikan peringatan jika pengguna mulai mengetik lagi
        if (loginWarning) { // Cek dulu apakah elemennya ada
            loginWarning.classList.remove('show');
        }
    }

    usernameInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    
    // --- Logika Submit Form (Dengan Validasi Tutor) ---
    loginForm.addEventListener('submit', (event) => {
        // 1. Mencegah form mengirim (reload halaman)
        event.preventDefault(); 
        
        // 2. Sembunyikan peringatan lama (jika ada)
        if (loginWarning) {
            loginWarning.classList.remove('show');
        }

        // 3. Periksa sekali lagi
        if (!continueButton.disabled) {
            
            const username = usernameInput.value.trim();
            const userRole = btnStudent.classList.contains('active') ? 'student' : 'tutor';

            // === 4. LOGIKA VALIDASI TUTOR BARU ===
            if (userRole === 'tutor' && !validTutorUsernames.includes(username)) {
                // Jika dia Tutor TAPI username-nya TIDAK ADA di daftar
                
                if (loginWarning) {
                    // Tampilkan pesan error
                    loginWarning.textContent = 'Username tutor tidak ditemukan.';
                    loginWarning.classList.add('show');
                }
                
                // Hentikan proses login
                return; 
            }
            // === SELESAI VALIDASI ===

            
            // --- 5. Logika Lanjutan (Jika validasi lolos) ---
            
            let loginId = 'student'; // Default
            
            if (userRole === 'tutor') {
                // Kita sudah yakin username-nya valid dari cek di atas
                loginId = username; 
            }
            
            // Simpan ID user yang login ke localStorage
            localStorage.setItem('clevrLoggedInUserId', loginId);

            console.log(`Navigasi sebagai: ${loginId}`);

            // === INI BAGIAN PENTING YANG DIPERBAIKI ===
            // Arahkan ke halaman yang benar
            if (loginId === 'student') {
                window.location.href = 'home_user.html';
            } else {
                // Arahkan tutor ke home_tutor.html
                window.location.href = 'home_tutor.html'; 
            }
            // === SELESAI PERBAIKAN ===
        }
    });

    // --- Logika toggle (Sudah benar) ---
    btnStudent.addEventListener('click', () => {
        btnStudent.classList.add('active');
        btnTutor.classList.remove('active');
        if (loginWarning) {
            loginWarning.classList.remove('show'); // Sembunyikan error saat ganti role
        }
    });

    btnTutor.addEventListener('click', () => {
        btnTutor.classList.add('active');
        btnStudent.classList.remove('active');
        if (loginWarning) {
            loginWarning.classList.remove('show'); // Sembunyikan error saat ganti role
        }
    });

});
