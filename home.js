document.addEventListener('DOMContentLoaded', function() {
            // === PERUBAHAN 1: AUTENTIKASI ===
            // Ambil ID user dari localStorage
            let currentLoggedInUser = localStorage.getItem('clevrLoggedInUserId');

            // Jika tidak ada yang login (belum login),
            // paksa kembali ke halaman login.html
            if (!currentLoggedInUser) {
                window.location.href = 'login.html';
            return; // Hentikan eksekusi script ini
         }
            // Karena kita paksa login sbg 'student', kita tidak perlu cek tutor
            // === SELESAI PERUBAHAN 1 ===        
    
    
            // --- DUMMY DATA (For Simulation) ---
            let user = JSON.parse(localStorage.getItem('clevrUser')) || {
                clovers: 150
            };
            
            // Muat data 'bookedClasses' dari localStorage, atau gunakan array kosong
            let bookedClasses = JSON.parse(localStorage.getItem('clevrBookedClasses')) || [];
            
            let currentTutorIdForBooking = null;
            let hasNewBooking = false;
            let currentCloverPackage = null;
            // currentLoggedInUser sudah di atas

            // Muat data 'tutors' dari localStorage, atau gunakan default
            // PENTING: Ganti 'const tutors' menjadi 'let tutors'
            let tutors = JSON.parse(localStorage.getItem('clevrTutors')) || {
                '1': { id: '1', name: 'Dara Alifa M.', subject: 'Mathematics', education: 'Mathematics, Univ. of Indonesia', img: 'https://placehold.co/80x80/fde047/000000?text=DA', detailImg: 'https://placehold.co/128x128/fde047/000000?text=DA', bio: 'Dara is a passionate mathematician with 5 years of tutoring experience, specializing in helping students conquer algebra and calculus.', emoji: '👩‍🏫', bgColor: 'bg-yellow-200', textColor: 'text-yellow-600', dob: 'June 10, 1992', address: '123 Math Lane, Jakarta' },
                '2': { id: '2', name: 'M. Harven A. Lim', subject: 'Science', education: 'Science, Bandung Inst. of Tech.', img: 'https://placehold.co/80x80/a78bfa/FFFFFF?text=MH', detailImg: 'https://placehold.co/128x128/a78bfa/FFFFFF?text=MH', bio: 'Harven makes complex scientific concepts easy to understand. He is an expert in physics and chemistry for high school students.', emoji: '👨‍🔬', bgColor: 'bg-purple-200', textColor: 'text-purple-600', dob: 'March 15, 1989', address: '456 Science Rd, Bandung' },
                '3': { id: '3', name: 'Gita Aulia N.', subject: 'Art & Design', education: 'Fine Arts, Jakarta Inst. of Arts', img: 'https://placehold.co/80x80/facc15/000000?text=GA', detailImg: 'https://placehold.co/128x128/facc15/000000?text=GA', bio: 'Gita believes everyone has a creative side. She specializes in digital illustration and traditional painting techniques.', emoji: '👩‍🎨', bgColor: 'bg-yellow-200', textColor: 'text-yellow-600', dob: 'December 1, 1995', address: '789 Art Blvd, Jakarta' },
                'budi': { id: 'budi', name: 'Budi Santoso', subject: 'Social Studies', education: 'Sociology, Gadjah Mada Univ.', img: 'https://placehold.co/80x80/4ade80/FFFFFF?text=BS', detailImg: 'https://placehold.co/128x128/4ade80/FFFFFF?text=BS', bio: 'Budi brings social studies to life by connecting historical theories with current events.', dob: 'July 22, 1991', address: '101 Society St, Yogyakarta' },
                'citra': { id: 'citra', name: 'Citra Lestari', subject: 'History', education: 'History, Padjadjaran Univ.', img: 'https://placehold.co/80x80/fca5a5/000000?text=CL', detailImg: 'https://placehold.co/128x128/fca5a5/000000?text=CL', bio: 'Citra is a storyteller who makes history engaging and memorable for all her students.', dob: 'November 5, 1993', address: '212 History Ave, Bandung' },
                'ahmad': { id: 'ahmad', name: 'Ahmad Dahlan', subject: 'Indonesian', education: 'Indonesian Lit., Univ. of Indonesia', img: 'https://placehold.co/80x80/93c5fd/000000?text=AD', detailImg: 'https://placehold.co/128x128/93c5fd/000000?text=AD', bio: 'Ahmad helps students appreciate the beauty of the Indonesian language through literature and effective writing.', dob: 'January 30, 1988', address: '333 Language Ln, Depok' },
                'jane': { id: 'jane', name: 'Jane Doe', subject: 'English', education: 'English Literature, Oxford', img: 'https://placehold.co/80x80/c4b5fd/FFFFFF?text=JD', detailImg: 'https://placehold.co/128x128/c4b5fd/FFFFFF?text=JD', bio: 'A native speaker with a passion for literature, Jane excels at improving conversational and academic English.', dob: 'October 11, 1994', address: '444 Cambridge Rd, London' },
                '4': { id: '4', name: 'M. Athalladithya', subject: 'Programming', education: 'Programming, Binus University', img: 'https://placehold.co/80x80/d8b4fe/FFFFFF?text=AT', detailImg: 'https://placehold.co/128x128/d8b4fe/FFFFFF?text=AT', bio: 'Athalladithya is a software engineer who enjoys teaching programming fundamentals and logic to beginners.', emoji: '👨‍💻', bgColor: 'bg-purple-200', textColor: 'text-purple-600', dob: 'February 2, 1998', address: '555 Code Cres, Jakarta' },
                'sari': { id: 'sari', name: 'Sari Dewi', subject: 'Science', education: 'Biology, Airlangga University', img: 'https://placehold.co/80x80/fb923c/FFFFFF?text=SD', detailImg: 'https://placehold.co/128x128/fb923c/FFFFFF?text=SD', bio: 'Sari is an enthusiastic biologist who loves exploring the wonders of the natural world with her students.', dob: 'September 9, 1996', address: '666 Biology Bvld, Surabaya' },
                'ria': { id: 'ria', name: 'Ria Cantika', subject: 'Art & Design', education: 'Graphic Design, Binus University', img: 'https://placehold.co/80x80/f472b6/FFFFFF?text=RC', detailImg: 'https://placehold.co/128x128/f472b6/FFFFFF?text=RC', bio: 'Ria is a professional graphic designer who teaches the fundamentals of modern design and branding.', dob: 'April 4, 1997', address: '777 Design Dr, Jakarta' }
            };

            // Muat data 'studentProfile' dari localStorage, atau gunakan default
            // Ganti 'const studentProfile' menjadi 'let studentProfile'
            let studentProfile = JSON.parse(localStorage.getItem('clevrStudentProfile')) || {
                 name: 'Bima Satria', role: 'Student', dob: 'August 17, 2005', education: 'Grade 11, SMA Cendekia', address: '123 Learning St, Knowledge City', img: 'https://placehold.co/128x128/f87171/FFFFFF?text=BS'
            };


             const studentConsultations = {
                '1': [
                    { name: 'Bima Satria', grade: 'Grade 11', img: 'https://placehold.co/80x80/f87171/FFFFFF?text=BS' },
                    { name: 'Cantika Putri', grade: 'Grade 12', img: 'https://placehold.co/80x80/60a5fa/FFFFFF?text=CP' }
                ],
                '2': [
                    { name: 'Eka Wijaya', grade: 'Grade 10', img: 'https://placehold.co/80x80/34d399/FFFFFF?text=EW' }
                ],
                '3': [],
                '4': [
                    { name: 'Dewi Lestari', grade: 'Grade 12', img: 'https://placehold.co/80x80/f472b6/FFFFFF?text=DL' }
                ]
            };


            const courses = [
                { id: 'math', name: 'Mathematics', desc: 'Understand concepts of algebra, geometry, and calculus.', price: 50, img: 'https://placehold.co/600x300/6366F1/FFFFFF?text=Math', tutorIds: ['1', '4'] },
                { id: 'sci', name: 'Science', desc: 'Explore the world of physics, chemistry, and biology.', price: 60, img: 'https://placehold.co/600x300/22C55E/FFFFFF?text=Science', tutorIds: ['2', 'sari'] },
                { id: 'art', name: 'Art & Design', desc: 'Develop your creativity through visual arts.', price: 40, img: 'https://placehold.co/600x300/F43F5E/FFFFFF?text=Art', tutorIds: ['3', 'ria'] },
                { id: 'soc', name: 'Social Studies', desc: 'Learn about social interaction and societal structures.', price: 45, img: 'https://placehold.co/600x300/F97316/FFFFFF?text=Social', tutorIds: ['budi', 'citra'] },
                { id: 'hist', name: 'History', desc: 'Uncover past events and their impact on the present.', price: 45, img: 'https://placehold.co/600x300/78716C/FFFFFF?text=History', tutorIds: ['citra', 'ahmad'] },
                { id: 'indo', name: 'Indonesian', desc: 'Master Indonesian grammar and literature.', price: 35, img: 'https://placehold.co/600x300/EC4899/FFFFFF?text=Indonesian', tutorIds: ['ahmad', '1'] },
                { id: 'eng', name: 'English', desc: 'Improve your global communication skills.', price: 55, img: 'https://placehold.co/600x300/06B6D4/FFFFFF?text=English', tutorIds: ['jane', '2'] },
            ];

            const cloverPackages = [
                { clovers: 50, price: 'Rp 10.000' },
                { clovers: 100, price: 'Rp 20.000' },
                { clovers: 250, price: 'Rp 50.000' },
                { clovers: 500, price: 'Rp 95.000' }
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

            // --- DOM Elements ---
            // Variabel loginPage, loginForm, signupForm, showSignupLink, showLoginLink dihapus
            const homePage = document.getElementById('homePage');
            const tutorHomePage = document.getElementById('tutorHomePage');
            const myClassesPage = document.getElementById('myClassesPage');
            const profilePage = document.getElementById('profilePage');
            const studentChatListPage = document.getElementById('studentChatListPage');
            const chatInterfacePage = document.getElementById('chatInterfacePage');

            const cloverBalanceEls = document.querySelectorAll('.clover-balance');
            const classGridEl = document.getElementById('class-grid');
            const onlineClassGridEl = document.getElementById('online-class-grid');
            const popularTutorsGrid = document.getElementById('popular-tutors-grid');
            
            // Modals
            const classModal = document.getElementById('classModal');
            const closeModalBtn = document.getElementById('closeModalBtn');
            const notificationModal = document.getElementById('notificationModal');
            const notificationContent = document.getElementById('notification-content');
            const notificationIcon = document.getElementById('notification-icon');
            const notificationMessage = document.getElementById('notification-message');
            const notificationCloseBtn = document.getElementById('notification-close-btn');
            const buyCloverModal = document.getElementById('buyCloverModal');
            const closeCloverModalBtn = document.getElementById('closeCloverModalBtn');
            const cloverPackagesContainer = document.getElementById('clover-packages-container');
            const openCloverModalBtns = document.querySelectorAll('.openCloverModalBtn');
            const tutorModal = document.getElementById('tutorModal');
            const closeTutorModalBtn = document.getElementById('closeTutorModalBtn');
            const modalTutorList = document.getElementById('modal-tutor-list');
           
            function saveData() {
                localStorage.setItem('clevrUser', JSON.stringify(user));
                localStorage.setItem('clevrBookedClasses', JSON.stringify(bookedClasses));
                localStorage.setItem('clevrStudentProfile', JSON.stringify(studentProfile));
                localStorage.setItem('clevrTutors', JSON.stringify(tutors));
                console.log('Data saved to localStorage!');
            }

            // --- FUNCTIONS ---
             const updateNotificationDot = (dotType) => {
                let indicatorSelector;
                let shouldShow = false;

                if (dotType === 'class') {
                    indicatorSelector = '.new-class-indicator';
                    shouldShow = hasNewBooking;
                } else if (dotType === 'chat') {
                    indicatorSelector = '.floating-chat-indicator';
                    shouldShow = hasNewBooking; // Use the same flag for now
                }

                const indicators = document.querySelectorAll(indicatorSelector);
                indicators.forEach(indicator => {
                    if (shouldShow) {
                        indicator.classList.remove('d-none');
                    } else {
                        indicator.classList.add('d-none');
                    }
                });
            };

            // Update Clover Display
            const updateCloverDisplay = () => {
                cloverBalanceEls.forEach(el => el.textContent = user.clovers);
            };

            // Show Notification
            const showNotification = (message, isSuccess, showButton = true) => {
                const successIcon = `<svg class="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
                const failureIcon = `<svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
                const loadingIcon = `<svg class="animate-spin h-16 w-16 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
                
                notificationMessage.textContent = message;

                if (isSuccess === null) { // Loading state
                    notificationIcon.innerHTML = loadingIcon;
                } else {
                     notificationIcon.innerHTML = isSuccess ? successIcon : failureIcon;
                }
                
                notificationCloseBtn.style.display = showButton ? 'inline-block' : 'none';
                notificationModal.classList.remove('d-none');
                document.body.classList.add('overflow-hidden');
                setTimeout(() => { notificationContent.classList.add('show'); }, 10);
            };

            const hideNotification = () => {
                notificationContent.classList.remove('show');
                setTimeout(() => {
                    notificationModal.classList.add('d-none');
                    if(classModal.classList.contains('d-none') && buyCloverModal.classList.contains('d-none')) {
                       document.body.classList.remove('overflow-hidden');
                    }
                }, 300);
            };

            // Render Class Cards
            const renderClassCards = (courseList, containerEl) => {
                if (!containerEl) return;
                containerEl.innerHTML = '';
                 if (courseList.length === 0) {
                     containerEl.innerHTML = `<p class="col-span-full text-center text-gray-500">No classes found.</p>`;
                     return;
                 }
                courseList.forEach(course => {
                    const colors = courseColors[course.id] || { bg: 'bg-purple-200', text: 'text-purple-700' };
                    const card = document.createElement('div');
                    card.className = 'bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer transition transform hover:scale-105 hover:shadow-xl';
                    card.dataset.courseId = course.id;
                    card.innerHTML = `
                        <div class="w-24 h-24 rounded-full ${colors.bg} mb-4 flex items-center justify-center text-3xl font-bold ${colors.text}">${course.name.substring(0, 2).toUpperCase()}</div>
                        <h3 class="font-semibold text-xl mb-1">${course.name}</h3>
                        <p class="text-sm text-gray-500">${course.desc}</p>
                    `;
                    containerEl.appendChild(card);
                });
            };

             // Render Tutor Cards
            const renderTutorCards = (tutorIdList) => {
                popularTutorsGrid.innerHTML = '';
                if (tutorIdList.length === 0) {
                    popularTutorsGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No tutors found.</p>`;
                    return;
                }
                tutorIdList.forEach(tutorId => {
                    const tutor = tutors[tutorId];
                    if (tutor) {
                        const card = document.createElement('div');
                        card.dataset.tutorId = tutorId;
                        card.className = 'bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer transition transform hover:scale-105 hover:shadow-xl';
                        
                        const imageDiv = tutor.emoji ? 
                            `<div class="w-24 h-24 rounded-full ${tutor.bgColor} mb-4 flex items-center justify-center">
                                <span class="text-4xl ${tutor.textColor}">${tutor.emoji}</span>
                            </div>` :
                            `<div class="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                               <img src="${tutor.img.replace('80x80','96x96')}" class="rounded-full">
                            </div>`;

                        card.innerHTML = `
                            ${imageDiv}
                            <h3 class="font-semibold text-xl mb-1">${tutor.name}</h3>
                            <p class="text-sm text-gray-500 mb-2">${tutor.subject}</p>
                            <span class="bg-yellow-400 text-yellow-800 font-bold text-xs px-3 py-1 rounded-full">5.0 ⭐</span>
                        `;
                        popularTutorsGrid.appendChild(card);
                    }
                });
            };

            // Render Clover Packages
            const renderCloverPackages = () => {
                cloverPackagesContainer.innerHTML = '';
                cloverPackages.forEach(pkg => {
                    const pkgEl = document.createElement('div');
                    pkgEl.className = 'flex justify-between items-center bg-gray-100 p-4 rounded-lg';
                    pkgEl.innerHTML = `
                        <div>
                            <p class="font-bold text-lg text-green-600">${pkg.clovers} Clovers</p>
                            <p class="text-gray-600">${pkg.price}</p>
                        </div>
                        <button data-clovers="${pkg.clovers}" class="buy-clover-btn bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition-colors">Buy</button>
                    `;
                    cloverPackagesContainer.appendChild(pkgEl);
                });
            };

            // Show Class Detail Modal
            const showClassModal = (course, isOnlineClass) => {
                document.getElementById('modal-class-image').src = course.img;
                document.getElementById('modal-class-title').textContent = course.name;
                document.getElementById('modal-class-desc').textContent = course.desc;
                
                const tutorList = document.getElementById('modal-tutor-list');
                const tutorsTitle = document.getElementById('tutors-for-class-title');
                const onlineBookingFooter = document.getElementById('online-class-booking-footer');
                
                tutorList.innerHTML = ''; // Clear previous content

                if (isOnlineClass) {
                    tutorsTitle.classList.add('d-none');
                    tutorList.classList.add('d-none');
                    onlineBookingFooter.classList.remove('d-none');
                    document.getElementById('online-class-price').textContent = course.price;
                    document.getElementById('book-online-class-btn').dataset.courseId = course.id;

                } else {
                    tutorsTitle.classList.remove('d-none');
                    tutorList.classList.remove('d-none');
                    onlineBookingFooter.classList.add('d-none');

                    // Render multiple tutors for private tutoring
                    course.tutorIds.forEach(tutorId => {
                        const tutor = tutors[tutorId];
                        if (tutor) {
                            const tutorCard = document.createElement('div');
                            tutorCard.className = 'flex items-center space-x-4 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors';
                            tutorCard.dataset.tutorId = tutorId;
                            tutorCard.innerHTML = `
                                <img src="${tutor.img}" alt="${tutor.name}" class="w-12 h-12 rounded-full flex-shrink-0">
                                <div>
                                    <p class="font-bold text-gray-800">${tutor.name}</p>
                                    <p class="text-sm text-gray-500">${tutor.education}</p>
                                </div>
                            `;
                            tutorList.appendChild(tutorCard);
                        }
                    });
                }
                
                classModal.classList.remove('d-none');
                document.body.classList.add('overflow-hidden');
            };

            // Show Tutor Detail Modal
            const showTutorModal = (tutorId) => {
                currentTutorIdForBooking = tutorId;
                const tutor = tutors[tutorId];
                if (!tutor) return;
                
                document.getElementById('modal-tutor-detail-image').src = tutor.detailImg;
                document.getElementById('modal-tutor-detail-name').textContent = tutor.name;
                document.getElementById('modal-tutor-detail-education').textContent = tutor.education;
                document.getElementById('modal-tutor-detail-bio').textContent = tutor.bio;

                // Find and render classes taught by this tutor
                const classListContainer = document.getElementById('modal-tutor-classes-list');
                const tutorClassesSection = document.getElementById('tutor-classes-section');
                classListContainer.innerHTML = '';
                const classesTaught = courses.filter(course => course.tutorIds.includes(tutorId));
                
                if (classesTaught.length > 0) {
                    tutorClassesSection.classList.remove('d-none');
                    classesTaught.forEach(course => {
                        const colors = courseColors[course.id] || { bg: 'bg-purple-200', text: 'text-purple-700' };
                        const classCard = document.createElement('div');
                        classCard.className = 'flex items-center space-x-4 p-3 bg-gray-100 rounded-lg';
                        classCard.innerHTML = `
                            <div class="w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center text-xl font-bold ${colors.text} flex-shrink-0">${course.name.substring(0, 2).toUpperCase()}</div>
                            <div class="flex-grow">
                                <p class="font-bold text-gray-800">${course.name}</p>
                                <p class="text-sm text-gray-500">${course.desc.substring(0, 35)}...</p>
                            </div>
                            <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                                <div class="flex items-center space-x-1 font-bold text-green-600 text-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M15.42 4.58a7.5 7.5 0 1 0 0 10.84 7.5 7.5 0 0 0 0-10.84zM10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M10 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 14a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zM4.93 4.93a1 1 0 0 1 1.41 0l1.42 1.42a1 1 0 0 1-1.42 1.41L4.93 6.34a1 1 0 0 1 0-1.41zm10.6 10.6a1 1 0 0 1 1.41 0l1.42 1.42a1 1 0 0 1-1.42 1.41l-1.41-1.42a1 1 0 0 1 0-1.41zM2 10a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm14 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zm-2.12-5.07a1 1 0 0 1 1.41 0l1.42-1.42a1 1 0 1 1 1.41 1.42l-1.41 1.41a1 1 0 0 1-1.41-1.41zM4.93 15.07a1 1 0 0 1 1.41 0l-1.42 1.42a1 1 0 0 1-1.41-1.42l1.41-1.41z"/></svg>
                                    <span>${course.price}</span>
                                </div>
                                <button data-price="${course.price}" data-course-id="${course.id}" data-booking-type="private" class="book-from-tutor-btn bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-colors text-sm w-full sm:w-auto">Book this Tutor</button>
                            </div>
                        `;
                        classListContainer.appendChild(classCard);
                    });
                } else {
                    tutorClassesSection.classList.add('d-none');
                }

                tutorModal.classList.remove('d-none');
            };
            
            // Render My Classes Page
            const renderMyClassesPage = () => {
                const counter = document.getElementById('booked-classes-counter');
                const onlineGrid = document.getElementById('booked-online-classes-grid');
                const tutorGrid = document.getElementById('booked-tutors-grid');
                
                onlineGrid.innerHTML = '';
                tutorGrid.innerHTML = '';
                
                const onlineBookings = bookedClasses.filter(b => b.type === 'online');
                const privateBookings = bookedClasses.filter(b => b.type === 'private');

                counter.textContent = `You have ${bookedClasses.length} booked class${bookedClasses.length !== 1 ? 'es' : ''}.`;
                
                // Render Online Classes
                if (onlineBookings.length === 0) {
                    onlineGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No online classes booked yet.</p>`;
                } else {
                    onlineBookings.forEach(booking => {
                        const course = booking.course;
                        const tutor = tutors[booking.tutorId];
                        const colors = courseColors[course.id] || { bg: 'bg-purple-200', text: 'text-purple-700' };
                        const card = document.createElement('div');
                        card.className = 'bg-white rounded-lg shadow-md flex flex-col text-center overflow-hidden';
                        card.innerHTML = `
                            <div class="p-6 pb-4">
                                <div class="w-24 h-24 rounded-full ${colors.bg} mb-4 flex items-center justify-center text-3xl font-bold ${colors.text} mx-auto">${course.name.substring(0, 2).toUpperCase()}</div>
                                <h3 class="font-semibold text-xl mb-1">${course.name}</h3>
                                <p class="text-sm text-gray-500">${course.desc}</p>
                            </div>
                            <div class="mt-auto bg-gray-50 p-4 border-t border-gray-200">
                                 <p class="text-xs text-gray-500 mb-2">Your Tutor</p>
                                 <div class="flex items-center justify-center space-x-3">
                                    <img src="${tutor.img}" alt="${tutor.name}" class="w-10 h-10 rounded-full">
                                    <div class="text-left">
                                        <p class="font-semibold text-sm text-gray-800">${tutor.name}</p>
                                        <p class="text-xs text-gray-500">${tutor.subject}</p>
                                    </div>
                                 </div>
                            </div>
                        `;
                        onlineGrid.appendChild(card);
                    });
                }

                // Render Private Tutors
                if (privateBookings.length === 0) {
                    tutorGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No private tutors booked yet.</p>`;
                } else {
                    privateBookings.forEach(booking => {
                        const course = booking.course;
                        const tutor = tutors[booking.tutorId];
                        const card = document.createElement('div');
                        card.className = 'bg-white rounded-lg shadow-md flex flex-col text-center overflow-hidden';
                        card.innerHTML = `
                             <div class="p-6 pb-4">
                                 <img src="${tutor.img}" alt="${tutor.name}" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-200">
                                 <h3 class="font-semibold text-xl mb-1">${tutor.name}</h3>
                                 <p class="text-sm text-gray-500">Booked for: <strong>${course.name}</strong></p>
                             </div>
                             <div class="mt-auto bg-gray-50 p-4 border-t border-gray-200">
                                <button data-tutor-id="${tutor.id}" class="my-classes-chat-btn bg-purple-600 text-white font-bold py-2 px-6 rounded-full w-full hover:bg-purple-700 transition-colors">Chat with Tutor</button>
                             </div>
                        `;
                        tutorGrid.appendChild(card);
                    });
                }
            };
            
            const renderTutorHomePage = (tutorId) => {
                const tutor = tutors[tutorId];
                if (!tutor) return;

                document.getElementById('tutor-welcome-name').textContent = tutor.name.split(' ')[0];

                // Render consultations
                const consultationGrid = document.getElementById('consultation-grid');
                consultationGrid.innerHTML = '';
                const consultations = studentConsultations[tutorId] || [];
                if(consultations.length > 0) {
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

                // Render taught classes
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
            };

            const renderStudentChatListPage = () => {
                const container = document.getElementById('student-chat-list-container');
                container.innerHTML = '';

                const privateBookings = bookedClasses.filter(b => b.type === 'private' || b.type === undefined);
                const uniqueTutorIds = [...new Set(privateBookings.map(b => b.tutorId))];

                if (uniqueTutorIds.length === 0) {
                    container.innerHTML = `<p class="text-center text-gray-500">You haven't booked any tutors for private tutoring yet. Book a tutor to start chatting!</p>`;
                    return;
                }

                const list = document.createElement('div');
                list.className = 'space-y-4';
                
                uniqueTutorIds.forEach(tutorId => {
                    const tutor = tutors[tutorId];
                    if (tutor) {
                        const chatItem = document.createElement('div');
                        chatItem.className = 'bg-white rounded-lg shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50';
                        chatItem.dataset.tutorId = tutor.id;
                        
                        chatItem.innerHTML = `
                            <div class="flex items-center space-x-4">
                                <img src="${tutor.img}" alt="${tutor.name}" class="w-12 h-12 rounded-full">
                                <div>
                                    <p class="font-bold text-gray-800">${tutor.name}</p>
                                    <p class="text-sm text-gray-500">Click to see conversation</p>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        `;
                        list.appendChild(chatItem);
                    }
                });
                container.appendChild(list);
            };
            
             const renderProfilePage = (editMode = false) => {
                let userProfile;
                if (currentLoggedInUser === 'student') {
                    userProfile = studentProfile;
                } else if (tutors[currentLoggedInUser]) {
                    userProfile = tutors[currentLoggedInUser];
                } else { return; }

                // Adjust header visibility
                const profileNav = document.getElementById('profile-nav');
                const wallet = profileNav.querySelector('.clover-wallet');
                const myClasses = profileNav.querySelector('.nav-my-classes');
                if (currentLoggedInUser === 'student') {
                    wallet.classList.remove('d-none');
                    myClasses.classList.remove('d-none');
                } else {
                    wallet.classList.add('d-none');
                    myClasses.classList.add('d-none');
                }

                const headerContent = document.getElementById('profile-header-content');
                const detailsContent = document.getElementById('profile-details-content');
                const roleText = currentLoggedInUser === 'student' ? 'Student' : 'Clevr Tutor';

                if (editMode) {
                    headerContent.innerHTML = `
                        <div class="flex-grow">
                           <input id="edit-profile-name" class="text-3xl font-bold w-full border-b-2" value="${userProfile.name}">
                           <p class="text-lg text-purple-600 font-semibold">${roleText}</p>
                           <button id="save-profile-btn" class="mt-4 bg-green-500 text-white font-bold py-2 px-6 rounded-full inline-block shadow-md hover:bg-green-600 transition-colors">Save Changes</button>
                        </div>`;
                    detailsContent.innerHTML = `
                         <div class="space-y-4">
                            <div>
                                <h3 class="font-semibold text-gray-500 text-sm">Date of Birth</h3>
                                <input id="edit-profile-dob" class="text-gray-800 w-full border-b" value="${userProfile.dob}">
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-500 text-sm">Education</h3>
                                <input id="edit-profile-education" class="text-gray-800 w-full border-b" value="${userProfile.education}">
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-500 text-sm">Address</h3>
                                <input id="edit-profile-address" class="text-gray-800 w-full border-b" value="${userProfile.address}">
                            </div>
                        </div>`;
                } else {
                    headerContent.innerHTML = `
                        <div class="flex-grow">
                            <h1 id="profile-page-name" class="text-3xl font-bold">${userProfile.name}</h1>
                            <p id="profile-page-role" class="text-lg text-purple-600 font-semibold">${roleText}</p>
                            <div class="mt-4 space-x-2">
                                <button id="edit-profile-btn" class="bg-purple-600 text-white font-bold py-2 px-6 rounded-full inline-block shadow-md hover:bg-purple-700 transition-colors">Edit Profile</button>
                                <button id="logout-btn" class="bg-red-500 text-white font-bold py-2 px-6 rounded-full inline-block shadow-md hover:bg-red-600 transition-colors">Log Out</button>
                            </div>
                        </div>`;
                    detailsContent.innerHTML = `
                        <div class="space-y-4">
                            <div>
                                <h3 class="font-semibold text-gray-500 text-sm">Date of Birth</h3>
                                <p id="profile-page-dob" class="text-gray-800">${userProfile.dob}</p>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-500 text-sm">Education</h3>
                                <p id="profile-page-education" class="text-gray-800">${userProfile.education}</p>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-500 text-sm">Address</h3>
                                <p id="profile-page-address" class="text-gray-800">${userProfile.address}</p>
                            </div>
                        </div>`;
                }
                document.getElementById('profile-page-image').src = userProfile.detailImg || userProfile.img || 'https://placehold.co/128x128';
            };


            // Hide Modals
            const hideClassModal = () => {
                classModal.classList.add('d-none');
                if(tutorModal.classList.contains('d-none') && buyCloverModal.classList.contains('d-none')) {
                    document.body.classList.remove('overflow-hidden');
                }
            };
            const hideCloverModal = () => {
                buyCloverModal.classList.add('d-none');
                 if(classModal.classList.contains('d-none') && tutorModal.classList.contains('d-none')) {
                    document.body.classList.remove('overflow-hidden');
                }
            };
             const hideTutorModal = () => {
                tutorModal.classList.add('d-none');
                 if(classModal.classList.contains('d-none') && buyCloverModal.classList.contains('d-none')) {
                    document.body.classList.remove('overflow-hidden');
                }
            };


            // --- PAGE LOGIC ---
            
            // Hapus semua logika login/signup

            // Langsung jalankan setup untuk student
            currentLoggedInUser = 'student';
            // homePage.classList.remove('d-none'); // Ini sudah diatur di HTML
            
            // Initial renders on page load
            updateCloverDisplay();
            renderClassCards(courses, classGridEl);
            renderClassCards(courses, onlineClassGridEl);
            renderTutorCards(['1', '2', '3', '4']);
            renderCloverPackages();


            // --- EVENT LISTENERS on ALL PAGES ---
            
            // Navigation
            document.querySelectorAll('.nav-my-classes').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    homePage.classList.add('d-none');
                    tutorHomePage.classList.add('d-none');
                    profilePage.classList.add('d-none');
                    studentChatListPage.classList.add('d-none');
                    chatInterfacePage.classList.add('d-none');
                    myClassesPage.classList.remove('d-none');
                    hasNewBooking = false;
                    updateNotificationDot('class');
                    renderMyClassesPage();
                });
            });

            document.querySelectorAll('.nav-logo').forEach(logo => {
                logo.addEventListener('click', (e) => {
                    e.preventDefault();
                    myClassesPage.classList.add('d-none');
                    profilePage.classList.add('d-none');
                    studentChatListPage.classList.add('d-none');
                    chatInterfacePage.classList.add('d-none');

                    if (currentLoggedInUser === 'student') {
                        tutorHomePage.classList.add('d-none');
                        homePage.classList.remove('d-none');
                    } else {
                        homePage.classList.add('d-none');
                        tutorHomePage.classList.remove('d-none');
                    }
                });
            });

             document.querySelectorAll('.nav-profile').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    homePage.classList.add('d-none');
                    myClassesPage.classList.add('d-none');
                    tutorHomePage.classList.add('d-none');
                    studentChatListPage.classList.add('d-none');
                    chatInterfacePage.classList.add('d-none');
                    profilePage.classList.remove('d-none');
                    renderProfilePage(false); // Render in view mode
                });
            });
            
            const mainContentContainer = homePage.querySelector('main');
            mainContentContainer.addEventListener('click', e => {
                const privateClassCard = e.target.closest('#class-grid [data-course-id]');
                const onlineClassCard = e.target.closest('#online-class-grid [data-course-id]');
                const tutorCard = e.target.closest('[data-tutor-id]');

                if (privateClassCard) {
                     const courseId = privateClassCard.dataset.courseId;
                    const selectedCourse = courses.find(c => c.id === courseId);
                    if (selectedCourse) showClassModal(selectedCourse, false);
                } else if (onlineClassCard) {
                    const courseId = onlineClassCard.dataset.courseId;
                    const selectedCourse = courses.find(c => c.id === courseId);
                    if (selectedCourse) showClassModal(selectedCourse, true);
                } else if (tutorCard) {
                    const tutorId = tutorCard.dataset.tutorId;
                    showTutorModal(tutorId);
                }
            });


            // Tutor Card Click (inside class modal)
            modalTutorList.addEventListener('click', (e) => {
                const card = e.target.closest('[data-tutor-id]');
                if (card) {
                    const tutorId = card.dataset.tutorId;
                    showTutorModal(tutorId);
                }
            });
            
            // Open Buy Clover Modal
            openCloverModalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    buyCloverModal.classList.remove('d-none');
                    document.body.classList.add('overflow-hidden');
                });
            });


            // Clover Payment Flow
            const paymentModalTitle = document.getElementById('payment-modal-title');
            const packagesContainer = document.getElementById('clover-packages-container');
            const methodsContainer = document.getElementById('payment-methods-container');
            const instructionsContainer = document.getElementById('payment-instructions-container');

            packagesContainer.addEventListener('click', (e) => {
                if(e.target.classList.contains('buy-clover-btn')) {
                    const clovers = e.target.dataset.clovers;
                    const price = cloverPackages.find(p => p.clovers == clovers).price;
                    currentCloverPackage = { clovers: parseInt(clovers), price: price };
                    
                    paymentModalTitle.textContent = `Pay ${price}`;
                    packagesContainer.classList.add('d-none');
                    methodsContainer.classList.remove('d-none');
                }
            });

            methodsContainer.addEventListener('click', (e) => {
                const target = e.target.closest('.payment-method-btn');
                if (target) {
                    const method = target.dataset.method;
                    document.getElementById('payment-instruction-title').textContent = `Instructions for ${method}`;
                    document.getElementById('payment-instruction-steps').innerHTML = `
                        <p>1. Open your ${method} application.</p>
                        <p>2. Transfer to account number <strong>123-456-7890</strong> under the name <strong>CLEVR Edu</strong>.</p>
                        <p>3. Ensure the amount is exactly <strong>${currentCloverPackage.price}</strong>.</p>
                        <p>4. Click the button below once you have completed the transfer.</p>
                    `;
                    methodsContainer.classList.add('d-none');
                    instructionsContainer.classList.remove('d-none');
                } else if (e.target.closest('.payment-back-btn')) {
                    paymentModalTitle.textContent = 'Buy Clovers';
                    methodsContainer.classList.add('d-none');
                    packagesContainer.classList.remove('d-none');
                }
            });

            instructionsContainer.addEventListener('click', (e) => {
                if (e.target.id === 'confirm-transfer-btn') {
                    hideCloverModal();
                    showNotification("Admin is checking your payment, Clovers will be added soon.", null, false);
                    
                    setTimeout(() => {
                        hideNotification();
                        setTimeout(() => {
                        user.clovers += currentCloverPackage.clovers;
                         saveData(); // <-- TAMBAHKAN DI SINI
                        updateCloverDisplay();
                          showNotification(`${currentCloverPackage.clovers} Clovers added successfully!`, true);
                        }, 400);
                    }, 2500);
                } else if (e.target.closest('.payment-back-btn')) {
                    paymentModalTitle.textContent = `Pay ${currentCloverPackage.price}`;
                    instructionsContainer.classList.add('d-none');
                    methodsContainer.classList.remove('d-none');
                }
            });


            // Modal Close Buttons
            closeModalBtn.addEventListener('click', hideClassModal);
            closeCloverModalBtn.addEventListener('click', () => {
                // Reset payment modal to initial state
                paymentModalTitle.textContent = 'Buy Clovers';
                instructionsContainer.classList.add('d-none');
                methodsContainer.classList.add('d-none');
                packagesContainer.classList.remove('d-none');
                hideCloverModal();
            });
            closeTutorModalBtn.addEventListener('click', hideTutorModal);
            notificationCloseBtn.addEventListener('click', hideNotification);
            
            // Event Listener for Tutor Modal (handles booking and overlay click)
            tutorModal.addEventListener('click', (e) => {
                // Handle booking from within the tutor profile
                if (e.target.classList.contains('book-from-tutor-btn')) {
                    const price = parseInt(e.target.dataset.price);
                    const courseId = e.target.dataset.courseId;
                    
                    hideTutorModal();
                    if (!classModal.classList.contains('d-none')) {
                        hideClassModal();
                    }

                    if (user.clovers >= price) {
                        const isAlreadyBooked = bookedClasses.some(booking => 
                            booking.course.id === courseId && booking.tutorId === currentTutorIdForBooking
                        );

                        if (isAlreadyBooked) {
                             showNotification("You have already booked this class with this tutor!", false);
                             return;
                        }

                        user.clovers -= price;
                        updateCloverDisplay();
                        const courseToBook = courses.find(c => c.id === courseId);
                        
                        if (courseToBook && currentTutorIdForBooking) {
                            bookedClasses.push({ 
                            course: courseToBook, 
                            tutorId: currentTutorIdForBooking,
                                type: 'private' // Menandai ini sebagai booking tutor privat
                            });
                            saveData(); // <-- TAMBAHKAN DI SINI
                            hasNewBooking = true;
                            updateNotificationDot('class');
                        }
                        showNotification("Class successfully booked, happy learning!", true);
                    } else {
                        showNotification("Insufficient Clovers! Please buy more.", false);
                    }
                }
                
                // Handle overlay click to close
                if(e.target === tutorModal) {
                    hideTutorModal();
                }
            });


            // Close Modal on Overlay Click (for other modals)
            classModal.addEventListener('click', (e) => { 
                if(e.target === classModal) hideClassModal(); 
                
                // Handle online class booking
                if(e.target.id === 'book-online-class-btn') {
                    const courseId = e.target.dataset.courseId;
                    const course = courses.find(c => c.id === courseId);
                    const price = course.price;

                    hideClassModal();
                    
                    if(user.clovers >= price) {
                        // Check if already booked
                        const isAlreadyBooked = bookedClasses.some(b => b.course.id === courseId && b.type === 'online');
                        if (isAlreadyBooked) {
                            showNotification("You have already booked this online class!", false);
                            return;
                        }

                        user.clovers -= price;
                        updateCloverDisplay();
                        bookedClasses.push({
                            course: course,
                            tutorId: course.tutorIds[0], // Assign first available tutor for online class
                            type: 'online'
                        });
                        saveData();
                        hasNewBooking = true;
                        updateNotificationDot('class');
                        showNotification("Online class successfully booked!", true);
                    } else {
                        showNotification("Insufficient Clovers! Please buy more.", false);
                    }
                }
            });
            buyCloverModal.addEventListener('click', (e) => { if(e.target === buyCloverModal) closeCloverModalBtn.click(); });
            notificationModal.addEventListener('click', (e) => { if(e.target === notificationModal) hideNotification(); });

             // Tutor Home Page: Open Chat
            document.getElementById('consultation-grid').addEventListener('click', (e) => {
                const chatBtn = e.target.closest('.open-chat-btn');
                if (chatBtn) {
                    const studentName = chatBtn.dataset.studentName;
                    tutorHomePage.classList.add('d-none');
                    chatInterfacePage.classList.remove('d-none');
                    document.getElementById('chat-with-name').textContent = studentName;
                    document.getElementById('chat-back-btn').dataset.returnPage = 'tutorHomePage';
                    document.getElementById('chat-messages-container').innerHTML = `<p class="text-center text-sm text-gray-400">This is the beginning of your conversation with ${studentName}.</p>`;
                }
            });
            
            // My Classes Page: Open Chat
            myClassesPage.addEventListener('click', e => {
                const chatBtn = e.target.closest('.my-classes-chat-btn');
                if (chatBtn) {
                    const tutorId = chatBtn.dataset.tutorId;
                    const tutor = tutors[tutorId];
                    if(tutor) {
                        myClassesPage.classList.add('d-none');
                        chatInterfacePage.classList.remove('d-none');
                        document.getElementById('chat-with-name').textContent = tutor.name;
                        document.getElementById('chat-back-btn').dataset.returnPage = 'myClassesPage';
                        document.getElementById('chat-messages-container').innerHTML = `<p class="text-center text-sm text-gray-400">This is the beginning of your conversation with ${tutor.name}.</p>`;
                    }
                }
            });

            // Student Chat List Page: Open Chat
            studentChatListPage.addEventListener('click', (e) => {
                const chatItem = e.target.closest('[data-tutor-id]');
                if (chatItem) {
                    const tutorId = chatItem.dataset.tutorId;
                    const tutor = tutors[tutorId];
                    if (tutor) {
                        studentChatListPage.classList.add('d-none');
                        chatInterfacePage.classList.remove('d-none');
                        document.getElementById('chat-with-name').textContent = tutor.name;
                        document.getElementById('chat-back-btn').dataset.returnPage = 'studentChatListPage';
                        document.getElementById('chat-messages-container').innerHTML = `<p class="text-center text-sm text-gray-400">This is the beginning of your conversation with ${tutor.name}.</p>`;
                    }
                }
            });


            // Floating Chat Button
            const floatingChatBtn = document.getElementById('floating-chat-btn');
            floatingChatBtn.addEventListener('click', () => {
                homePage.classList.add('d-none');
                myClassesPage.classList.add('d-none');
                profilePage.classList.add('d-none');
                tutorHomePage.classList.add('d-none');
                studentChatListPage.classList.remove('d-none');
                renderStudentChatListPage();
            });

            // Chat Page: Back button & Send message
            document.getElementById('chat-back-btn').addEventListener('click', () => {
                const returnPageId = document.getElementById('chat-back-btn').dataset.returnPage;
                const returnPage = document.getElementById(returnPageId);
                
                chatInterfacePage.classList.add('d-none');
                if (returnPage) {
                    returnPage.classList.remove('d-none');
                } else {
                    // Fallback to home page if return page is not found
                    homePage.classList.remove('d-none');
                }
            });

            document.getElementById('chat-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const input = document.getElementById('chat-input');
                const message = input.value.trim();
                if (message) {
                    const messageContainer = document.getElementById('chat-messages-container');
                    const messageEl = document.createElement('div');
                    messageEl.className = 'flex justify-end';
                    messageEl.innerHTML = `<div class="bg-purple-600 text-white rounded-lg py-2 px-4 max-w-sm">${message}</div>`;
                    messageContainer.appendChild(messageEl);
                    input.value = '';
                    messageContainer.scrollTop = messageContainer.scrollHeight;
                }
            });
            
             // Profile Page: Edit/Save logic
            document.getElementById('profilePage').addEventListener('click', (e) => {
                if (e.target.id === 'edit-profile-btn') {
                    renderProfilePage(true);
                } else if (e.target.id === 'save-profile-btn') {
                    // Get new values
                    const newName = document.getElementById('edit-profile-name').value;
                    const newDob = document.getElementById('edit-profile-dob').value;
                    const newEducation = document.getElementById('edit-profile-education').value;
                    const newAddress = document.getElementById('edit-profile-address').value;

                    // Update data object
                    if (currentLoggedInUser === 'student') {
                        studentProfile.name = newName;
                        studentProfile.dob = newDob;
                        studentProfile.education = newEducation;
                        studentProfile.address = newAddress;
                    } else if (tutors[currentLoggedInUser]) {
                        tutors[currentLoggedInUser].name = newName;
                        tutors[currentLoggedInUser].dob = newDob;
                        tutors[currentLoggedInUser].education = newEducation;
                        tutors[currentLoggedInUser].address = newAddress;
                    }
                    saveData(); // <-- TAMBAHKAN DI SINI
                    renderProfilePage(false); // Switch back to view mode
                }
                else if (e.target.id === 'logout-btn') {
                    // Hapus data login dari localStorage
                    localStorage.removeItem('clevrLoggedInUserId');
                    // (Opsional: hapus semua data)
                    // localStorage.clear(); 
                    
                    // Kembali ke halaman login
                    window.location.href = 'login.html';
                }
                // === SELESAI ===
            });


            // --- Carousel Logic ---
            const sliderTrack = document.getElementById('slider-track');
            const slides = document.querySelectorAll('.carousel-slide');
            const prevBtn = document.getElementById('prev-slide');
            const nextBtn = document.getElementById('next-slide');
            const dots = document.querySelectorAll('#slider-dots button');

            if (sliderTrack && slides.length > 0) {
                let currentIndex = 0;
                const totalSlides = slides.length;
                const updateDots = () => { dots.forEach((dot, index) => { dot.classList.toggle('bg-purple-600', index === currentIndex); dot.classList.toggle('bg-gray-300', index !== currentIndex); dot.setAttribute('aria-current', index === currentIndex); }); };
                const updateSlider = () => { if (slides[0]) { const slideWidth = slides[0].clientWidth; sliderTrack.style.transform = `translateX(${-currentIndex * slideWidth}px)`; updateDots(); }};
                if(nextBtn){ nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % totalSlides; updateSlider(); }); }
                if(prevBtn){ prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; updateSlider(); }); }
                dots.forEach((dot, index) => { dot.addEventListener('click', () => { currentIndex = index; updateSlider(); }); });
                window.addEventListener('resize', updateSlider);
                updateSlider();
            }

            // --- Search Logic ---
            const searchInput = document.getElementById('searchInput');
            const mobileSearchInput = document.getElementById('mobileSearchInput');
            const searchResultsDesktop = document.getElementById('searchResultsDesktop');
            const searchResultsMobile = document.getElementById('searchResultsMobile');

            const populateSearchResults = (query, container) => {
                container.innerHTML = '';
                if (!query) {
                    container.classList.add('d-none');
                    return;
                }

                const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(query));
                const filteredTutors = Object.entries(tutors).filter(([id, tutor]) => tutor.name.toLowerCase().includes(query));

                if (filteredCourses.length === 0 && filteredTutors.length === 0) {
                    container.innerHTML = `<div class="p-4 text-gray-500">No results found.</div>`;
                    container.classList.remove('d-none');
                    return;
                }

                if (filteredTutors.length > 0) {
                    container.innerHTML += `<h3 class="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase">Tutors</h3>`;
                    filteredTutors.forEach(([id, tutor]) => {
                        const item = document.createElement('a');
                        item.href = '#';
                        item.className = 'flex items-center p-3 hover:bg-gray-100 transition-colors search-result-item';
                        item.dataset.tutorId = id;
                        item.innerHTML = `
                            <img src="${tutor.img}" class="w-10 h-10 rounded-full mr-3">
                            <div>
                                <p class="font-semibold text-gray-800">${tutor.name}</p>
                                <p class="text-sm text-gray-500">${tutor.education}</p>
                            </div>
                        `;
                        container.appendChild(item);
                    });
                }

                if (filteredCourses.length > 0) {
                    container.innerHTML += `<h3 class="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase">Classes</h3>`;
                    filteredCourses.forEach(course => {
                        const colors = courseColors[course.id] || { bg: 'bg-purple-200', text: 'text-purple-700' };
                        const item = document.createElement('a');
                        item.href = '#';
                        item.className = 'flex items-center p-3 hover:bg-gray-100 transition-colors search-result-item';
                        item.dataset.courseId = course.id;
                        item.innerHTML = `
                            <div class="w-10 h-10 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center font-bold text-lg mr-3 flex-shrink-0">${course.name.substring(0, 2).toUpperCase()}</div>
                            <div>
                                <p class="font-semibold text-gray-800">${course.name}</p>
                                <p class="text-sm text-gray-500">${course.desc.substring(0, 40)}...</p>
                            </div>
                        `;
                        container.appendChild(item);
                    });
                }

                container.classList.remove('d-none');
            };
            
            const hideAllSearchResults = () => {
                searchResultsDesktop.classList.add('d-none');
                searchResultsMobile.classList.add('d-none');
            };

            const handleSearchInput = (e) => {
                const query = e.target.value.toLowerCase().trim();
                const isDesktop = e.target.id === 'searchInput';
                
                if (isDesktop) {
                    mobileSearchInput.value = e.target.value;
                    populateSearchResults(query, searchResultsDesktop);
                } else {
                    searchInput.value = e.target.value;
                    populateSearchResults(query, searchResultsMobile);
                }
            };
            
            const handleResultClick = (e) => {
                e.preventDefault();
                const item = e.target.closest('.search-result-item');
                if (!item) return;

                const courseId = item.dataset.courseId;
                const tutorId = item.dataset.tutorId;

                if (courseId) {
                    const selectedCourse = courses.find(c => c.id === courseId);
                    if (selectedCourse) showClassModal(selectedCourse);
                } else if (tutorId) {
                    showTutorModal(tutorId);
                }
                
                hideAllSearchResults();
                searchInput.value = '';
                mobileSearchInput.value = '';
            };

            searchInput.addEventListener('input', handleSearchInput);
            mobileSearchInput.addEventListener('input', handleSearchInput);

            searchResultsDesktop.addEventListener('click', handleResultClick);
            searchResultsMobile.addEventListener('click', handleResultClick);

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.relative')) {
                    hideAllSearchResults();
                }
            });
            });