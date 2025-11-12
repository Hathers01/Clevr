document.addEventListener('DOMContentLoaded', function() {
        
        // --- 1. OTENTIKASI: Siapa yang login? ---
        const currentLoggedInUser = localStorage.getItem('clevrLoggedInUserId');

        // Jika tidak ada yang login, tendang ke index.html
        if (!currentLoggedInUser) {
            window.location.href = 'index.html';
            return;
        }

        // Jika yang login student, tendang ke home_user.html
        if (currentLoggedInUser === 'student') {
            window.location.href = 'home_user.html';
            return;
        }


        // --- 2. DATA: Muat semua data dari localStorage (atau pakai default) ---
        const tutors = JSON.parse(localStorage.getItem('clevrTutors')) || {
            '1': { id: '1', name: 'Dara Alifa M.', subject: 'Mathematics'},
            '2': { id: '2', name: 'M. Harven A. Lim', subject: 'Science'},
            '3': { id: '3', name: 'Gita Aulia N.', subject: 'Art & Design'},
            '4': { id: '4', name: 'M. Athalladithya', subject: 'Programming'}
        };

        const studentConsultations = {
            '1': [
                { name: 'Bima Satria', grade: 'Grade 11', img: 'https://placehold.co/80x80/f87171/FFFFFF?text=BS' },
                { name: 'Cantika Putri', grade: 'Grade 12', img: 'https://placehold.co/80x80/60a5fa/FFFFFF?text=CP' }
            ],
            '2': [
                { name: 'Eka Wijaya', grade: 'Grade 10', img: 'https://placehold.co/80x80/34d399/FFFFFF?text=EW' }
            ],
            'budi': [
                 { name: 'Fajar Nugroho', grade: 'Grade 11', img: 'https://placehold.co/80x80/facc15/000000?text=FN' }
            ],
            'citra': [], // Citra tidak punya konsultasi
            '4': [
                { name: 'Dewi Lestari', grade: 'Grade 12', img: 'https://placehold.co/80x80/f472b6/FFFFFF?text=DL' }
            ]
        };

        const courses = [
            { id: 'math', name: 'Mathematics', desc: 'Understand concepts of algebra, geometry, and calculus.', price: 50, img: '...', tutorIds: ['1', '4'] },
            { id: 'sci', name: 'Science', desc: 'Explore the world of physics, chemistry, and biology.', price: 60, img: '...', tutorIds: ['2', 'sari'] },
            { id: 'art', name: 'Art & Design', desc: 'Develop your creativity through visual arts.', price: 40, img: '...', tutorIds: ['3', 'ria'] },
            { id: 'soc', name: 'Social Studies', desc: 'Learn about social interaction and societal structures.', price: 45, img: '...', tutorIds: ['budi', 'citra'] },
            { id: 'hist', name: 'History', desc: 'Uncover past events and their impact on the present.', price: 45, img: '...', tutorIds: ['citra', 'ahmad'] },
            { id: 'indo', name: 'Indonesian', desc: 'Master Indonesian grammar and literature.', price: 35, img: '...', tutorIds: ['ahmad', '1'] },
            { id: 'eng', name: 'English', desc: 'Improve your global communication skills.', price: 55, img: '...', tutorIds: ['jane', '2'] },
        ];
        
        const courseColors = {
            'math': { bg: 'bg-blue-200', text: 'text-blue-700' },
            'sci': { bg: 'bg-green-200', text: 'text-green-700' },
            'art': { bg: 'bg-red-200', text: 'text-red-700' },
            'soc': { bg: 'bg-orange-200', text: 'text-orange-700' },
            'hist': { bg: 'bg-amber-200', text: 'text-amber-700' }, 
            'indo': { bg: 'bg-pink-200', text: 'text-pink-700' },
            'eng': { bg: 'bg-sky-200', text: 'text-sky-700' }
        };
        
        
        // --- 2.5 ELEMEN DOM ---
        // Kita perlu mendefinisikan halaman-halaman ini
        const tutorHomePage = document.getElementById('tutorHomePage');
        const chatInterfacePage = document.getElementById('chatInterfacePage');

        
        // --- 3. FUNGSI RENDER: Untuk menggambar halaman ---
        
        function renderTutorHomePage(tutorId) {
            // (Fungsi ini sudah benar, tidak perlu diubah)
            const tutor = tutors[tutorId];
            if (!tutor) {
                console.error('Data tutor tidak ditemukan untuk ID:', tutorId);
                localStorage.removeItem('clevrLoggedInUserId');
                window.location.href = 'index.html';
                return;
            }

            const welcomeNameEl = document.getElementById('tutor-welcome-name');
            if (welcomeNameEl) {
                welcomeNameEl.textContent = tutor.name.split(' ')[0];
            }

            const consultationGrid = document.getElementById('consultation-grid');
            consultationGrid.innerHTML = '';
            const consultations = studentConsultations[tutorId] || [];
            
            if (consultations.length > 0) {
                consultations.forEach(student => {
                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-lg shadow p-4 text-center';
                    card.innerHTML = `
                        <img src="${student.img}" class="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-purple-200">
                        <p class="font-bold">${student.name}</p>
                        <p class="text-sm text-gray-500">${student.grade}</p>
                        <button data-student-name="${student.name}" class="open-chat-btn mt-3 bg-purple-100 text-purple-700 p-2 rounded-full hover:bg-purple-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </button>
                    `;
                    consultationGrid.appendChild(card);
                });
            } else {
                 consultationGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No pending consultations.</p>`;
            }

            const taughtClassesList = document.getElementById('tutor-classes-list-page');
            taughtClassesList.innerHTML = '';
            const classesTaught = courses.filter(course => course.tutorIds.includes(tutorId));
             
            if (classesTaught.length > 0) {
                  classesTaught.forEach(course => {
                       const colors = courseColors[course.id] || { bg: 'bg-purple-200', text: 'text-purple-700' };
                      const card = document.createElement('div');
                      card.className = 'bg-white rounded-lg shadow p-4 flex items-center space-x-4';
                      card.innerHTML = `
                           <div class="w-16 h-16 rounded-lg ${colors.bg} flex items-center justify-center text-2xl font-bold ${colors.text} flex-shrink-0">${course.name.substring(0, 2).toUpperCase()}</div>
                           <div class="flex-grow">
                               <h3 class="font-bold text-lg">${course.name}</h3>
                               <p class="text-sm text-gray-500">${course.desc}</p>
                           </div>
                      `;
                      taughtClassesList.appendChild(card);
                   });
             } else {
                  taughtClassesList.innerHTML = `<p class="text-center text-gray-500">You are not assigned to any classes yet.</p>`;
             }
        }
        
        // --- 4. EKSEKUSI: Panggil fungsi render! ---
        renderTutorHomePage(currentLoggedInUser);
        
        
        // --- 5. NAVIGASI & LOGIKA CHAT ---
        
        // Arahkan tombol profil ke profile.html
        document.querySelectorAll('.nav-profile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'profile.html';
            });
        });
        
        
        // === LOGIKA CHAT BARU DITAMBAHKAN DI SINI ===

        // 1. Tutor Home Page: Buka Chat saat klik kartu konsultasi
        document.getElementById('consultation-grid').addEventListener('click', (e) => {
            const chatBtn = e.target.closest('.open-chat-btn');
            if (chatBtn) {
                const studentName = chatBtn.dataset.studentName;
                
                // Sembunyikan halaman home tutor, tampilkan halaman chat
                tutorHomePage.classList.add('d-none');
                chatInterfacePage.classList.remove('d-none');
                
                // Atur nama di header chat
                document.getElementById('chat-with-name').textContent = studentName;
                // Atur tombol kembali agar tahu harus kembali ke mana
                document.getElementById('chat-back-btn').dataset.returnPage = 'tutorHomePage';
                // Reset isi chat (simulasi)
                document.getElementById('chat-messages-container').innerHTML = `<p class="text-center text-sm text-gray-400">This is the beginning of your conversation with ${studentName}.</p>`;
            }
        });

        // 2. Chat Page: Logika Tombol Kembali
        document.getElementById('chat-back-btn').addEventListener('click', () => {
            const returnPageId = document.getElementById('chat-back-btn').dataset.returnPage;
            const returnPage = document.getElementById(returnPageId);
            
            chatInterfacePage.classList.add('d-none');
            
            if (returnPage) {
                returnPage.classList.remove('d-none');
            } else {
                // Fallback jika terjadi error
                tutorHomePage.classList.remove('d-none');
            }
        });

        // 3. Chat Page: Logika Kirim Pesan
        document.getElementById('chat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            if (message) {
                const messageContainer = document.getElementById('chat-messages-container');
                const messageEl = document.createElement('div');
                // Pesan tutor selalu di kanan (sebagai "pengirim")
                messageEl.className = 'flex justify-end';
                messageEl.innerHTML = `<div class="bg-purple-600 text-white rounded-lg py-2 px-4 max-w-sm">${message}</div>`;
                messageContainer.appendChild(messageEl);
                input.value = '';
                messageContainer.scrollTop = messageContainer.scrollHeight;
            }
        });

});