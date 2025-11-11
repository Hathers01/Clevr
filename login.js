// Logika untuk mengaktifkan tombol "Continue"
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const continueButton = document.getElementById('continueButton');

        function validateForm() {
            const isUsernameFilled = usernameInput.value.trim() !== '';
            const isPasswordFilled = passwordInput.value.trim() !== '';

            if (isUsernameFilled && isPasswordFilled) {
                continueButton.disabled = false; 
            } else {
                continueButton.disabled = true; 
            }
        }

        usernameInput.addEventListener('input', validateForm);
        passwordInput.addEventListener('input', validateForm);

        
        // BARU: Logika untuk navigasi saat form disubmit
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (event) => {
    // 1. Mencegah form mengirim (reload halaman)
    event.preventDefault(); 

    // ...
    if (!continueButton.disabled) {
        
        // === PERUBAHAN DIMULAI DI SINI ===
        
        // Ambil username yang diinput
        const username = usernameInput.value.trim();
        const userRole = btnStudent.classList.contains('active') ? 'student' : 'tutor';

        // Simulasikan login
        // Jika username adalah 'budi' atau 'citra' (dari data tutor Anda) DAN role-nya "tutor",
        // kita simpan ID-nya. Selain itu, kita anggap "student".
        
        let loginId = 'student'; // Default
        
        if (userRole === 'tutor' && (username === 'budi' || username === 'citra' || username === '1' || username === '2' || username === '3' || username === '4')) {
            loginId = username; // Login sebagai tutor dengan ID 'budi', 'citra', '1', dll.
        }
        
        // Simpan ID user yang login ke localStorage
        localStorage.setItem('clevrLoggedInUserId', 'student');

        // === PERUBAHAN SELESAI ===

        // 3. Arahkan pengguna ke 'home.html'
        console.log('Navigasi ke home.html sebagai: student');
        window.location.href = 'home_user.html';
    }
    });

        // Logika toggle
        const btnStudent = document.getElementById('btn-student');
        const btnTutor = document.getElementById('btn-tutor');

        btnStudent.addEventListener('click', () => {
            btnStudent.classList.add('active');
            btnTutor.classList.remove('active');
        });

        btnTutor.addEventListener('click', () => {
            btnTutor.classList.add('active');
            btnStudent.classList.remove('active');
        });