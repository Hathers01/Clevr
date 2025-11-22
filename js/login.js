const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const continueButton = document.getElementById('continueButton');
        const btnStudent = document.getElementById('btn-student');
        const btnTutor = document.getElementById('btn-tutor');
        const body = document.body;

        // --- LOGIKA SLIDING BACKGROUND ---
        
        btnStudent.addEventListener('click', () => {
            btnStudent.classList.add('active');
            btnTutor.classList.remove('active');
            
            // Mode student (Hapus class tutor-mode)
            body.classList.remove('tutor-mode');
        });

        btnTutor.addEventListener('click', () => {
            btnTutor.classList.add('active');
            btnStudent.classList.remove('active');
            
            // Mode tutor (Tambah class tutor-mode)
            body.classList.add('tutor-mode');
        });

        // --- LOGIKA VALIDASI ---

        function validateForm() {
            // DIUBAH: Cek isUsernameFilled
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

        const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            if (!continueButton.disabled) {
                // --- PERUBAHAN LOGIKA DI SINI ---
                
                // Cek apakah mode Tutor sedang aktif (tombol tutor punya class 'active')
                if (btnTutor.classList.contains('active')) {
                    console.log('Mode Tutor: Navigasi ke home_tutor.html...');
                    window.location.href = 'home_tutor.html'; // Masuk ke laman Tutor
                } else {
                    console.log('Mode Student: Navigasi ke home_user.html...');
                    window.location.href = 'home_user.html'; // Masuk ke laman Student
                }
            }
        });