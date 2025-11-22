const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rePasswordInput = document.getElementById('rePassword');
        const continueButton = document.getElementById('continueButton');
        const btnStudent = document.getElementById('btn-student');
        const btnTutor = document.getElementById('btn-tutor');
        const body = document.body;

        // --- VALIDASI FORM SIGN UP ---
        function validateForm() {
            const isEmailFilled = emailInput.value.trim() !== '';
            const isPasswordFilled = passwordInput.value.trim() !== '';
            const isRePasswordFilled = rePasswordInput.value.trim() !== '';
            
            // Cek apakah password dan re-password cocok
            const isPasswordMatch = passwordInput.value === rePasswordInput.value;

            // Tombol hanya aktif jika semua terisi DAN password cocok
            if (isEmailFilled && isPasswordFilled && isRePasswordFilled && isPasswordMatch) {
                continueButton.disabled = false; 
            } else {
                continueButton.disabled = true; 
            }
        }

        emailInput.addEventListener('input', validateForm);
        passwordInput.addEventListener('input', validateForm);
        rePasswordInput.addEventListener('input', validateForm);

        
        const signupForm = document.getElementById('signupForm');

        signupForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            if (!continueButton.disabled) {
                // Di sini bisa ditambahkan logika pengiriman data sign up
                console.log('Sign up berhasil, navigasi ke login.html...');
                window.location.href = 'login.html';
            }
        });

        // --- LOGIKA SLIDING BACKGROUND (SAMA DENGAN LOGIN) ---
        
        btnStudent.addEventListener('click', () => {
            btnStudent.classList.add('active');
            btnTutor.classList.remove('active');
            
            // Balik ke Ungu
            body.classList.remove('tutor-mode');
        });

        btnTutor.addEventListener('click', () => {
            btnTutor.classList.add('active');
            btnStudent.classList.remove('active');
            
            // Geser ke Oranye
            body.classList.add('tutor-mode');
        });