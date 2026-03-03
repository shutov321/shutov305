// Хранилище данных
let books = JSON.parse(localStorage.getItem('books')) || [];
let readers = JSON.parse(localStorage.getItem('readers')) || [];
let loans = JSON.parse(localStorage.getItem('loans')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;

// Инициализация тестовыми данными
function initializeData() {
    if (books.length === 0) {
        books = [
            { 
                id: 1, 
                title: 'Война и мир', 
                author: 'Лев Толстой', 
                genre: 'fiction', 
                year: 1869, 
                isbn: '978-5-17-123456-7',
                publisher: 'АСТ',
                pages: 1300,
                description: 'Роман-эпопея, описывающий русское общество в эпоху войн против Наполеона в 1805-1812 годах.',
                cover: 'https://example.com/cover1.jpg',
                available: true,
                reserved: false
            },
            { 
                id: 2, 
                title: 'Преступление и наказание', 
                author: 'Федор Достоевский', 
                genre: 'fiction', 
                year: 1866, 
                isbn: '978-5-04-123456-7',
                publisher: 'Эксмо',
                pages: 672,
                description: 'Социально-психологический роман, в котором автор исследует глубины человеческой души.',
                cover: 'https://example.com/cover2.jpg',
                available: true,
                reserved: false
            },
            { 
                id: 3, 
                title: 'Краткая история времени', 
                author: 'Стивен Хокинг', 
                genre: 'science', 
                year: 1988, 
                isbn: '978-5-17-123457-7',
                publisher: 'Амфора',
                pages: 256,
                description: 'Книга о происхождении Вселенной, черных дырах и природе времени.',
                cover: 'https://example.com/cover3.jpg',
                available: false,
                reserved: true
            },
            { 
                id: 4, 
                title: 'Гарри Поттер и философский камень', 
                author: 'Дж.К. Роулинг', 
                genre: 'fantasy', 
                year: 1997, 
                isbn: '978-5-389-12345-6',
                publisher: 'Росмэн',
                pages: 432,
                description: 'Первая книга о мальчике, который выжил.',
                cover: 'https://example.com/cover4.jpg',
                available: true,
                reserved: false
            },
            { 
                id: 5, 
                title: 'Убийство в Восточном экспрессе', 
                author: 'Агата Кристи', 
                genre: 'detective', 
                year: 1934, 
                isbn: '978-5-04-123458-7',
                publisher: 'Эксмо',
                pages: 288,
                description: 'Знаменитый детектив с Эркюлем Пуаро.',
                cover: 'https://example.com/cover5.jpg',
                available: true,
                reserved: false
            }
        ];
        saveBooks();
    }
    
    if (readers.length === 0) {
        readers = [
            { 
                id: 1, 
                cardNumber: 'LIB001', 
                name: 'Иван Петров',
                firstName: 'Иван',
                lastName: 'Петров',
                phone: '+7 (999) 123-45-67', 
                email: 'ivan.petrov@email.com',
                address: 'г. Москва, ул. Ленина, д. 1, кв. 101',
                birthDate: '1990-01-01',
                registeredDate: '2023-01-15',
                favoriteGenres: ['fiction', 'fantasy']
            },
            { 
                id: 2, 
                cardNumber: 'LIB002', 
                name: 'Мария Соколова',
                firstName: 'Мария',
                lastName: 'Соколова',
                phone: '+7 (999) 765-43-21', 
                email: 'maria.sokolova@email.com',
                address: 'г. Москва, ул. Пушкина, д. 10, кв. 5',
                birthDate: '1985-05-20',
                registeredDate: '2023-02-20',
                favoriteGenres: ['science', 'history']
            }
        ];
        saveReaders();
    }
    
    if (loans.length === 0) {
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(returnDate.getDate() + 14);
        
        loans = [
            {
                id: 1,
                bookId: 3,
                readerId: 1,
                loanDate: today.toISOString().split('T')[0],
                returnDate: returnDate.toISOString().split('T')[0],
                returned: false,
                extended: false
            }
        ];
        saveLoans();
    }
}

// Сохранение данных
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function saveReaders() {
    localStorage.setItem('readers', JSON.stringify(readers));
}

function saveLoans() {
    localStorage.setItem('loans', JSON.stringify(loans));
}

// Обработка входа
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // Простая проверка для демо
    if (userType === 'admin' && email === 'admin@library.ru' && password === 'admin123') {
        currentUser = {
            id: 999,
            name: 'Елена Соколова',
            email: email,
            type: 'admin',
            role: 'Главный библиотекарь'
        };
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'admin/dashboard.html';
    } else if (userType === 'user' && email === 'user@library.ru' && password === 'user123') {
        currentUser = readers[0];
        currentUser.type = 'user';
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'user/dashboard.html';
    } else {
        alert('Неверный email или пароль');
    }
}

// Загрузка панели пользователя
function loadUserDashboard() {
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('welcomeName').textContent = currentUser.firstName || 'Иван';
    
    // Подсчет статистики
    const userLoans = loans.filter(loan => loan.readerId === currentUser.id);
    const activeLoans = userLoans.filter(loan => !loan.returned);
    const soonToReturn = activeLoans.filter(loan => {
        const returnDate = new Date(loan.returnDate);
        const today = new Date();
        const diffDays = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0;
    });
    
    document.getElementById('booksOnHands').textContent = activeLoans.length;
    document.getElementById('soonToReturn').textContent = soonToReturn.length;
    document.getElementById('totalRead').textContent = userLoans.filter(loan => loan.returned).length;
    
    // Загрузка текущих выдач
    const currentLoansBody = document.getElementById('currentLoans');
    if (currentLoansBody) {
        if (activeLoans.length === 0) {
            currentLoansBody.innerHTML = '<tr><td colspan="5" class="no-results">Нет книг на руках</td></tr>';
        } else {
            currentLoansBody.innerHTML = activeLoans.map(loan => {
                const book = books.find(b => b.id === loan.bookId);
                const returnDate = new Date(loan.returnDate);
                const today = new Date();
                const diffDays = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));
                
                let status = 'В норме';
                let statusClass = 'success';
                
                if (diffDays < 0) {
                    status = 'Просрочена';
                    statusClass = 'danger';
                } else if (diffDays <= 3) {
                    status = 'Скоро сдать';
                    statusClass = 'warning';
                }
                
                return `
                    <tr>
                        <td>${book ? book.title : 'Неизвестно'}</td>
                        <td>${book ? book.author : 'Неизвестно'}</td>
                        <td>${formatDate(loan.loanDate)}</td>
                        <td>${formatDate(loan.returnDate)}</td>
                        <td><span class="badge-status ${statusClass}">${status}</span></td>
                    </tr>
                `;
            }).join('');
        }
    }
}

// Загрузка популярных книг
function loadPopularBooks() {
    const container = document.getElementById('popularBooks');
    if (!container) return;
    
    const popularBooks = books.filter(b => b.available).slice(0, 4);
    
    container.innerHTML = popularBooks.map(book => `
        <div class="mini-book-card" onclick="showBookDetails(${book.id})">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <span class="book-status status-available">В наличии</span>
        </div>
    `).join('');
}

// Загрузка каталога для пользователя
function loadUserCatalog() {
    filterBooks();
}

// Фильтрация книг
function filterBooks() {
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';
    const genre = genreFilter ? genreFilter.value : 'all';
    const availability = availabilityFilter ? availabilityFilter.value : 'all';
    const sort = sortFilter ? sortFilter.value : 'title';
    
    let filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchText) || 
                             book.author.toLowerCase().includes(searchText) ||
                             (book.description && book.description.toLowerCase().includes(searchText));
        const matchesGenre = genre === 'all' || book.genre === genre;
        const matchesAvailability = availability === 'all' || 
                                   (availability === 'available' && book.available);
        
        return matchesSearch && matchesGenre && matchesAvailability;
    });
    
    // Сортировка
    filtered.sort((a, b) => {
        switch(sort) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return a.author.localeCompare(b.author);
            case 'year_desc':
                return b.year - a.year;
            case 'year_asc':
                return a.year - b.year;
            default:
                return 0;
        }
    });
    
    displayBooks(filtered);
}

// Отображение книг
function displayBooks(booksToShow) {
    const container = document.getElementById('booksContainer');
    if (!container) return;
    
    if (booksToShow.length === 0) {
        container.innerHTML = '<div class="no-results">Книги не найдены</div>';
        return;
    }
    
    container.innerHTML = booksToShow.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-meta">
                    <span class="book-year">${book.year} г.</span>
                    <span class="book-status ${book.available ? 'status-available' : 'status-issued'}">
                        ${book.available ? 'В наличии' : 'Выдана'}
                    </span>
                </div>
                <p class="book-description">${book.description ? book.description.substring(0, 100) + '...' : ''}</p>
            </div>
        </div>
    `).join('');
}

// Переключение вида отображения
function setView(viewType) {
    const container = document.getElementById('booksContainer');
    const gridBtn = document.querySelector('.view-btn:first-child');
    const listBtn = document.querySelector('.view-btn:last-child');
    
    if (viewType === 'grid') {
        container.classList.remove('list-view');
        container.classList.add('grid-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        container.classList.remove('grid-view');
        container.classList.add('list-view');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    }
}

// Показать детали книги
function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const modal = document.getElementById('bookDetailsModal');
    const content = document.getElementById('bookDetailsContent');
    
    content.innerHTML = `
        <div class="book-details-grid">
            <div class="book-details-cover">
                <i class="fas fa-book" style="font-size: 8rem;"></i>
            </div>
            <div class="book-details-info">
                <h2>${book.title}</h2>
                <p class="book-details-author">${book.author}</p>
                
                <div class="book-details-meta">
                    <p><strong>Год издания:</strong> ${book.year}</p>
                    <p><strong>Издательство:</strong> ${book.publisher || 'Не указано'}</p>
                    <p><strong>Страниц:</strong> ${book.pages || 'Не указано'}</p>
                    <p><strong>ISBN:</strong> ${book.isbn}</p>
                </div>
                
                <div class="book-details-description">
                    <h3>Описание</h3>
                    <p>${book.description || 'Описание отсутствует'}</p>
                </div>
                
                <div class="book-details-status">
                    <span class="book-status ${book.available ? 'status-available' : 'status-issued'}">
                        ${book.available ? 'Доступна для выдачи' : 'Выдана'}
                    </span>
                </div>
                
                ${book.available ? 
                    `<button class="btn-primary" onclick="reserveBook(${book.id})">
                        <i class="fas fa-bookmark"></i> Забронировать
                    </button>` : 
                    `<button class="btn-secondary" disabled>Недоступна</button>`
                }
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Закрыть детали книги
function closeBookDetails() {
    document.getElementById('bookDetailsModal').style.display = 'none';
}

// Забронировать книгу
function reserveBook(bookId) {
    if (!currentUser) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = '../index.html';
        return;
    }
    
    const book = books.find(b => b.id === bookId);
    if (book && book.available) {
        book.reserved = true;
        saveBooks();
        alert('Книга забронирована! Вы можете получить её в библиотеке.');
        closeBookDetails();
        filterBooks();
    }
}

// Загрузка профиля пользователя
function loadUserProfile() {
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('firstName').value = currentUser.firstName || '';
    document.getElementById('lastName').value = currentUser.lastName || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('address').value = currentUser.address || '';
    document.getElementById('birthDate').value = currentUser.birthDate || '';
    
    const userLoans = loans.filter(loan => loan.readerId === currentUser.id);
    const activeLoans = userLoans.filter(loan => !loan.returned);
    
    document.getElementById('totalBooksRead').textContent = userLoans.length;
    document.getElementById('currentlyReading').textContent = activeLoans.length;
}

// Режим редактирования профиля
function enableEditMode() {
    const inputs = document.querySelectorAll('#profileForm input');
    inputs.forEach(input => input.disabled = false);
    document.getElementById('formActions').style.display = 'flex';
    document.querySelector('.edit-profile-btn').style.display = 'none';
}

// Отмена редактирования
function cancelEdit() {
    const inputs = document.querySelectorAll('#profileForm input');
    inputs.forEach(input => input.disabled = true);
    document.getElementById('formActions').style.display = 'none';
    document.querySelector('.edit-profile-btn').style.display = 'flex';
    loadUserProfile(); // Перезагружаем данные
}

// Сохранение профиля
function saveProfile() {
    const updatedReader = {
        ...currentUser,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        birthDate: document.getElementById('birthDate').value
    };
    
    // Обновляем в массиве читателей
    const index = readers.findIndex(r => r.id === currentUser.id);
    if (index !== -1) {
        readers[index] = updatedReader;
        saveReaders();
    }
    
    currentUser = updatedReader;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    cancelEdit();
    alert('Профиль успешно обновлен');
}

// Форматирование даты
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Административные функции
function loadAdminDashboard() {
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = '../index.html';
        return;
    }
    
    document.getElementById('adminName').textContent = currentUser.name;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('totalBooks').textContent = books.length;
    document.getElementById('activeReaders').textContent = readers.length;
    
    const today = new Date().toDateString();
    const todayLoans = loans.filter(loan => new Date(loan.loanDate).toDateString() === today).length;
    document.getElementById('todayLoans').textContent = todayLoans;
    
    const overdueLoans = loans.filter(loan => {
        if (loan.returned) return false;
        const returnDate = new Date(loan.returnDate);
        const today = new Date();
        return returnDate < today;
    }).length;
    document.getElementById('overdueLoans').textContent = overdueLoans;
    
    // Загрузка последних выдач
    const recentLoansBody = document.getElementById('recentLoans');
    if (recentLoansBody) {
        const recent = loans.slice(-5).reverse();
        recentLoansBody.innerHTML = recent.map(loan => {
            const book = books.find(b => b.id === loan.bookId);
            const reader = readers.find(r => r.id === loan.readerId);
            return `
                <tr>
                    <td>${book ? book.title : 'Неизвестно'}</td>
                    <td>${reader ? reader.name : 'Неизвестно'}</td>
                    <td>${formatDate(loan.loanDate)}</td>
                    <td>
                        <span class="badge-status ${loan.returned ? 'success' : 'warning'}">
                            ${loan.returned ? 'Возвращена' : 'Выдана'}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    // Загрузка должников
    const debtorsList = document.getElementById('debtorsList');
    if (debtorsList) {
        const overdueLoansList = loans.filter(loan => {
            if (loan.returned) return false;
            const returnDate = new Date(loan.returnDate);
            const today = new Date();
            return returnDate < today;
        });
        
        if (overdueLoansList.length === 0) {
            debtorsList.innerHTML = '<p class="no-results">Нет должников</p>';
        } else {
            debtorsList.innerHTML = overdueLoansList.map(loan => {
                const reader = readers.find(r => r.id === loan.readerId);
                const book = books.find(b => b.id === loan.bookId);
                const daysOverdue = Math.ceil((new Date() - new Date(loan.returnDate)) / (1000 * 60 * 60 * 24));
                
                return `
                    <div class="debtor-item">
                        <div class="debtor-info">
                            <strong>${reader ? reader.name : 'Неизвестно'}</strong>
                            <p>Книга: ${book ? book.title : 'Неизвестно'}</p>
                            <p>Просрочка: ${daysOverdue} дн.</p>
                        </div>
                        <button class="btn-small" onclick="sendReminder(${loan.id})">
                            <i class="fas fa-bell"></i>
                        </button>
                    </div>
                `;
            }).join('');
        }
    }
}

// Инициализация графиков
function initCharts() {
    const loansCtx = document.getElementById('loansChart')?.getContext('2d');
    const genresCtx = document.getElementById('genresChart')?.getContext('2d');
    
    if (loansCtx) {
        new Chart(loansCtx, {
            type: 'line',
            data: {
                labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                datasets: [{
                    label: 'Выдачи',
                    data: [12, 19, 15, 17, 24, 30, 28],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    if (genresCtx) {
        new Chart(genresCtx, {
            type: 'doughnut',
            data: {
                labels: ['Художественная', 'Научная', 'Фэнтези', 'Детектив', 'История'],
                datasets: [{
                    data: [45, 20, 15, 12, 8],
                    backgroundColor: [
                        '#4361ee',
                        '#2ecc71',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Загрузка книг для админа
function loadAdminBooks() {
    adminFilterBooks();
}

// Фильтрация книг для админа
function adminFilterBooks() {
    const searchInput = document.getElementById('searchBook');
    const genreFilter = document.getElementById('genreFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';
    const genre = genreFilter ? genreFilter.value : 'all';
    const status = statusFilter ? statusFilter.value : 'all';
    
    const filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchText) || 
                             book.author.toLowerCase().includes(searchText) ||
                             book.isbn.toLowerCase().includes(searchText);
        const matchesGenre = genre === 'all' || book.genre === genre;
        const matchesStatus = status === 'all' || 
                             (status === 'available' && book.available) ||
                             (status === 'issued' && !book.available) ||
                             (status === 'reserved' && book.reserved);
        
        return matchesSearch && matchesGenre && matchesStatus;
    });
    
    displayAdminBooks(filtered);
}

// Отображение книг для админа
function displayAdminBooks(booksToShow) {
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;
    
    if (booksToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-results">Книги не найдены</td></tr>';
        return;
    }
    
    tbody.innerHTML = booksToShow.map(book => {
        let statusText = 'В наличии';
        let statusClass = 'status-available';
        
        if (!book.available) {
            statusText = 'Выдана';
            statusClass = 'status-issued';
        } else if (book.reserved) {
            statusText = 'Забронирована';
            statusClass = 'status-reserved';
        }
        
        return `
            <tr>
                <td>${book.id}</td>
                <td>
                    <div class="table-cover">
                        <i class="fas fa-book"></i>
                    </div>
                </td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${getGenreName(book.genre)}</td>
                <td>${book.year}</td>
                <td>${book.isbn}</td>
                <td><span class="book-status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn-icon" onclick="editBook(${book.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteBook(${book.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Получение названия жанра
function getGenreName(genreCode) {
    const genres = {
        'fiction': 'Художественная',
        'science': 'Научная',
        'fantasy': 'Фэнтези',
        'detective': 'Детектив',
        'history': 'История'
    };
    return genres[genreCode] || genreCode;
}

// Показать модальное окно добавления книги
function showAddBookModal() {
    document.getElementById('bookModalTitle').textContent = 'Добавить книгу';
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    document.getElementById('bookModal').style.display = 'block';
}

// Редактирование книги
function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('bookModalTitle').textContent = 'Редактировать книгу';
    document.getElementById('bookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookYear').value = book.year;
    document.getElementById('bookGenre').value = book.genre;
    document.getElementById('bookIsbn').value = book.isbn;
    document.getElementById('bookPublisher').value = book.publisher || '';
    document.getElementById('bookPages').value = book.pages || '';
    document.getElementById('bookDescription').value = book.description || '';
    document.getElementById('bookCover').value = book.cover || '';
    
    document.getElementById('bookModal').style.display = 'block';
}

// Закрыть модальное окно книги
function closeBookModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Сохранение книги
function saveBook(event) {
    event.preventDefault();
    
    const bookId = document.getElementById('bookId').value;
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        year: parseInt(document.getElementById('bookYear').value),
        genre: document.getElementById('bookGenre').value,
        isbn: document.getElementById('bookIsbn').value,
        publisher: document.getElementById('bookPublisher').value,
        pages: document.getElementById('bookPages').value ? parseInt(document.getElementById('bookPages').value) : null,
        description: document.getElementById('bookDescription').value,
        cover: document.getElementById('bookCover').value
    };
    
    if (bookId) {
        // Редактирование
        const index = books.findIndex(b => b.id === parseInt(bookId));
        if (index !== -1) {
            books[index] = { ...books[index], ...bookData };
        }
    } else {
        // Добавление
        const newBook = {
            id: Date.now(),
            ...bookData,
            available: true,
            reserved: false
        };
        books.push(newBook);
    }
    
    saveBooks();
    closeBookModal();
    adminFilterBooks();
}

// Удаление книги
function deleteBook(bookId) {
    if (confirm('Вы уверены, что хотите удалить эту книгу?')) {
        // Проверяем, есть ли активные выдачи
        const activeLoans = loans.filter(loan => loan.bookId === bookId && !loan.returned);
        if (activeLoans.length > 0) {
            alert('Нельзя удалить книгу, которая находится на руках');
            return;
        }
        
        books = books.filter(book => book.id !== bookId);
        saveBooks();
        adminFilterBooks();
    }
}

// Экспорт книг в CSV
function exportBooks() {
    const headers = ['ID', 'Название', 'Автор', 'Жанр', 'Год', 'ISBN', 'Статус'];
    const csvData = books.map(book => [
        book.id,
        book.title,
        book.author,
        getGenreName(book.genre),
        book.year,
        book.isbn,
        book.available ? 'В наличии' : 'Выдана'
    ]);
    
    const csv = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'books_export.csv';
    link.click();
}

// Отправка напоминания должнику
function sendReminder(loanId) {
    alert('Напоминание отправлено читателю');
}

// Инициализация
document.addEventListener('DOMContentLoaded', initializeData);

// Закрытие модальных окон при клике вне их
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// ================ УПРАВЛЕНИЕ ЧИТАТЕЛЯМИ (АДМИН) ================

// Загрузка списка читателей для админа
function loadAdminReaders() {
    updateReadersStats();
    filterReaders();
}

// Обновление статистики читателей
function updateReadersStats() {
    document.getElementById('totalReaders').textContent = readers.length;
    
    const activeReaders = readers.filter(reader => {
        const readerLoans = loans.filter(loan => loan.readerId === reader.id && !loan.returned);
        return readerLoans.length > 0;
    }).length;
    document.getElementById('activeReaders').textContent = activeReaders;
    
    const debtors = readers.filter(reader => {
        const readerLoans = loans.filter(loan => {
            if (loan.returned || loan.readerId !== reader.id) return false;
            const returnDate = new Date(loan.returnDate);
            const today = new Date();
            return returnDate < today;
        });
        return readerLoans.length > 0;
    }).length;
    document.getElementById('debtorReaders').textContent = debtors;
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const newReaders = readers.filter(reader => {
        const regDate = new Date(reader.registeredDate || Date.now());
        return regDate > oneMonthAgo;
    }).length;
    document.getElementById('newReaders').textContent = newReaders;
}

// Фильтрация читателей
function filterReaders() {
    const searchText = document.getElementById('searchReader')?.value.toLowerCase() || '';
    const status = document.getElementById('statusFilter')?.value || 'all';
    const sort = document.getElementById('sortFilter')?.value || 'name';
    
    let filtered = readers.filter(reader => {
        const matchesSearch = reader.name.toLowerCase().includes(searchText) || 
                             reader.email.toLowerCase().includes(searchText) ||
                             reader.cardNumber.toLowerCase().includes(searchText);
        
        let matchesStatus = true;
        if (status !== 'all') {
            const readerLoans = loans.filter(loan => loan.readerId === reader.id && !loan.returned);
            const hasDebt = readerLoans.some(loan => new Date(loan.returnDate) < new Date());
            
            if (status === 'active') {
                matchesStatus = readerLoans.length > 0;
            } else if (status === 'inactive') {
                matchesStatus = readerLoans.length === 0;
            } else if (status === 'debtors') {
                matchesStatus = hasDebt;
            }
        }
        
        return matchesSearch && matchesStatus;
    });
    
    // Сортировка
    filtered.sort((a, b) => {
        switch(sort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'date_desc':
                return new Date(b.registeredDate || 0) - new Date(a.registeredDate || 0);
            case 'date_asc':
                return new Date(a.registeredDate || 0) - new Date(b.registeredDate || 0);
            case 'books_desc':
                const aLoans = loans.filter(l => l.readerId === a.id && !l.returned).length;
                const bLoans = loans.filter(l => l.readerId === b.id && !l.returned).length;
                return bLoans - aLoans;
            default:
                return 0;
        }
    });
    
    displayReaders(filtered);
}

// Отображение читателей
function displayReaders(readersToShow) {
    const tbody = document.getElementById('readersTableBody');
    if (!tbody) return;
    
    if (readersToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-results">Читатели не найдены</td></tr>';
        return;
    }
    
    tbody.innerHTML = readersToShow.map(reader => {
        const readerLoans = loans.filter(loan => loan.readerId === reader.id && !loan.returned);
        const hasDebt = readerLoans.some(loan => new Date(loan.returnDate) < new Date());
        
        let statusText = 'Активен';
        let statusClass = 'status-available';
        
        if (hasDebt) {
            statusText = 'Должник';
            statusClass = 'status-issued';
        } else if (readerLoans.length === 0) {
            statusText = 'Неактивен';
            statusClass = 'status-reserved';
        }
        
        return `
            <tr onclick="showReaderDetails(${reader.id})">
                <td>${reader.cardNumber}</td>
                <td>
                    <div class="table-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                </td>
                <td>
                    <strong>${reader.name}</strong><br>
                    <small>ID: ${reader.id}</small>
                </td>
                <td>
                    <div>${reader.email}</div>
                    <small>${reader.phone}</small>
                </td>
                <td>${reader.registeredDate ? formatDate(reader.registeredDate) : 'Н/Д'}</td>
                <td>${readerLoans.length}</td>
                <td><span class="book-status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn-icon" onclick="editReader(${reader.id}); event.stopPropagation();" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteReader(${reader.id}); event.stopPropagation();" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Показать детали читателя
function showReaderDetails(readerId) {
    const reader = readers.find(r => r.id === readerId);
    if (!reader) return;
    
    const readerLoans = loans.filter(loan => loan.readerId === readerId);
    const activeLoans = readerLoans.filter(loan => !loan.returned);
    const returnedLoans = readerLoans.filter(loan => loan.returned);
    const overdueLoans = activeLoans.filter(loan => new Date(loan.returnDate) < new Date());
    
    const modal = document.getElementById('readerDetailsModal');
    const content = document.getElementById('readerDetailsContent');
    
    content.innerHTML = `
        <div class="reader-details-header">
            <div class="reader-avatar-large">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="reader-info">
                <h2>${reader.name}</h2>
                <p>Читательский билет: ${reader.cardNumber}</p>
                <p>Зарегистрирован: ${reader.registeredDate ? formatDate(reader.registeredDate) : 'Н/Д'}</p>
            </div>
        </div>
        
        <div class="reader-details-stats">
            <div class="stat-item">
                <span class="stat-value">${activeLoans.length}</span>
                <span class="stat-label">Книг на руках</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${returnedLoans.length}</span>
                <span class="stat-label">Прочитано</span>
            </div>
            <div class="stat-item ${overdueLoans.length > 0 ? 'warning' : ''}">
                <span class="stat-value">${overdueLoans.length}</span>
                <span class="stat-label">Просрочено</span>
            </div>
        </div>
        
        <div class="reader-contact-info">
            <h3>Контактная информация</h3>
            <p><i class="fas fa-envelope"></i> ${reader.email}</p>
            <p><i class="fas fa-phone"></i> ${reader.phone}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${reader.address || 'Не указан'}</p>
        </div>
        
        <div class="reader-active-loans">
            <h3>Текущие выдачи</h3>
            ${activeLoans.length === 0 ? 
                '<p class="no-data">Нет активных выдач</p>' : 
                `<table class="compact-table">
                    <thead>
                        <tr>
                            <th>Книга</th>
                            <th>Дата выдачи</th>
                            <th>Срок возврата</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activeLoans.map(loan => {
                            const book = books.find(b => b.id === loan.bookId);
                            const isOverdue = new Date(loan.returnDate) < new Date();
                            return `
                                <tr>
                                    <td>${book ? book.title : 'Неизвестно'}</td>
                                    <td>${formatDate(loan.loanDate)}</td>
                                    <td>${formatDate(loan.returnDate)}</td>
                                    <td><span class="badge-status ${isOverdue ? 'danger' : 'success'}">
                                        ${isOverdue ? 'Просрочена' : 'В норме'}
                                    </span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>`
            }
        </div>
    `;
    
    modal.style.display = 'block';
}

// Закрыть детали читателя
function closeReaderDetails() {
    document.getElementById('readerDetailsModal').style.display = 'none';
}

// Показать модальное окно добавления читателя
function showAddReaderModal() {
    document.getElementById('readerModalTitle').textContent = 'Добавить читателя';
    document.getElementById('readerForm').reset();
    document.getElementById('readerId').value = '';
    document.getElementById('readerModal').style.display = 'block';
}

// Редактирование читателя
function editReader(readerId) {
    const reader = readers.find(r => r.id === readerId);
    if (!reader) return;
    
    document.getElementById('readerModalTitle').textContent = 'Редактировать читателя';
    document.getElementById('readerId').value = reader.id;
    document.getElementById('readerFirstName').value = reader.firstName || '';
    document.getElementById('readerLastName').value = reader.lastName || '';
    document.getElementById('readerEmail').value = reader.email || '';
    document.getElementById('readerPhone').value = reader.phone || '';
    document.getElementById('readerBirthDate').value = reader.birthDate || '';
    document.getElementById('readerAddress').value = reader.address || '';
    document.getElementById('readerPassport').value = reader.passport || '';
    
    document.getElementById('readerModal').style.display = 'block';
}

// Закрыть модальное окно читателя
function closeReaderModal() {
    document.getElementById('readerModal').style.display = 'none';
}

// Сохранение читателя
function saveReader(event) {
    event.preventDefault();
    
    const readerId = document.getElementById('readerId').value;
    const firstName = document.getElementById('readerFirstName').value;
    const lastName = document.getElementById('readerLastName').value;
    
    const readerData = {
        name: firstName + ' ' + lastName,
        firstName: firstName,
        lastName: lastName,
        email: document.getElementById('readerEmail').value,
        phone: document.getElementById('readerPhone').value,
        birthDate: document.getElementById('readerBirthDate').value,
        address: document.getElementById('readerAddress').value,
        passport: document.getElementById('readerPassport').value
    };
    
    if (readerId) {
        // Редактирование
        const index = readers.findIndex(r => r.id === parseInt(readerId));
        if (index !== -1) {
            readers[index] = { ...readers[index], ...readerData };
        }
    } else {
        // Добавление
        const newReader = {
            id: Date.now(),
            cardNumber: 'LIB' + String(readers.length + 1).padStart(3, '0'),
            registeredDate: new Date().toISOString().split('T')[0],
            ...readerData
        };
        readers.push(newReader);
    }
    
    saveReaders();
    closeReaderModal();
    filterReaders();
    updateReadersStats();
}

// Удаление читателя
function deleteReader(readerId) {
    if (confirm('Вы уверены, что хотите удалить этого читателя?')) {
        // Проверяем, есть ли активные выдачи
        const activeLoans = loans.filter(loan => loan.readerId === readerId && !loan.returned);
        if (activeLoans.length > 0) {
            alert('Нельзя удалить читателя с активными выдачами');
            return;
        }
        
        readers = readers.filter(reader => reader.id !== readerId);
        saveReaders();
        filterReaders();
        updateReadersStats();
    }
}

// Экспорт читателей
function exportReaders() {
    const headers = ['№ билета', 'ФИО', 'Email', 'Телефон', 'Дата регистрации', 'Книг на руках'];
    const csvData = readers.map(reader => {
        const activeLoans = loans.filter(loan => loan.readerId === reader.id && !loan.returned).length;
        return [
            reader.cardNumber,
            reader.name,
            reader.email,
            reader.phone,
            reader.registeredDate || 'Н/Д',
            activeLoans
        ];
    });
    
    const csv = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'readers_export.csv';
    link.click();
}

// ================ УПРАВЛЕНИЕ ВЫДАЧАМИ (АДМИН) ================

// Загрузка выдач для админа
function loadAdminLoans() {
    updateLoansStats();
    showLoansTab('active');
}

// Обновление статистики выдач
function updateLoansStats() {
    const today = new Date();
    const activeLoans = loans.filter(loan => !loan.returned);
    const overdueLoans = activeLoans.filter(loan => new Date(loan.returnDate) < today);
    const returnedLoans = loans.filter(loan => loan.returned);
    
    document.getElementById('activeLoansCount').textContent = activeLoans.length;
    document.getElementById('overdueLoansCount').textContent = overdueLoans.length;
    document.getElementById('returnedLoansCount').textContent = returnedLoans.length;
    
    // Средний срок выдачи
    if (returnedLoans.length > 0) {
        const totalDays = returnedLoans.reduce((sum, loan) => {
            const start = new Date(loan.loanDate);
            const end = new Date(loan.returnDate || loan.actualReturnDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);
        const avgDays = Math.round(totalDays / returnedLoans.length);
        document.getElementById('avgLoanDays').textContent = avgDays;
    }
}

// Переключение вкладок выдач
function showLoansTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    
    const activeTab = Array.from(tabs).find(t => 
        t.textContent.toLowerCase().includes(tab === 'active' ? 'активн' :
                                          tab === 'overdue' ? 'просроч' :
                                          tab === 'today' ? 'сегодня' :
                                          tab === 'history' ? 'истор' : 'все')
    );
    if (activeTab) activeTab.classList.add('active');
    
    filterLoans(tab);
}

// Фильтрация выдач
function filterLoans(tab = 'active') {
    const searchText = document.getElementById('searchLoan')?.value.toLowerCase() || '';
    const dateFilter = document.getElementById('dateFilter')?.value || 'all';
    const dateFrom = document.getElementById('dateFrom')?.value;
    const dateTo = document.getElementById('dateTo')?.value;
    
    // Показываем/скрываем кастомный диапазон дат
    const customRange = document.getElementById('customDateRange');
    if (customRange) {
        customRange.style.display = dateFilter === 'custom' ? 'flex' : 'none';
    }
    
    let filtered = loans.filter(loan => {
        // Поиск
        const book = books.find(b => b.id === loan.bookId);
        const reader = readers.find(r => r.id === loan.readerId);
        const matchesSearch = (book?.title || '').toLowerCase().includes(searchText) || 
                              (reader?.name || '').toLowerCase().includes(searchText);
        
        // Фильтр по вкладке
        let matchesTab = true;
        if (tab === 'active') {
            matchesTab = !loan.returned;
        } else if (tab === 'overdue') {
            matchesTab = !loan.returned && new Date(loan.returnDate) < new Date();
        } else if (tab === 'today') {
            const today = new Date().toDateString();
            matchesTab = new Date(loan.loanDate).toDateString() === today;
        } else if (tab === 'history') {
            matchesTab = loan.returned;
        }
        
        // Фильтр по дате
        let matchesDate = true;
        const loanDate = new Date(loan.loanDate);
        const today = new Date();
        
        if (dateFilter === 'today') {
            matchesDate = loanDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = loanDate >= weekAgo;
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDate = loanDate >= monthAgo;
        } else if (dateFilter === 'custom' && dateFrom && dateTo) {
            matchesDate = loanDate >= new Date(dateFrom) && loanDate <= new Date(dateTo);
        }
        
        return matchesSearch && matchesTab && matchesDate;
    });
    
    // Сортировка по дате (сначала новые)
    filtered.sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate));
    
    displayLoans(filtered);
}

// Отображение выдач
function displayLoans(loansToShow) {
    const tbody = document.getElementById('loansTableBody');
    if (!tbody) return;
    
    if (loansToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-results">Выдачи не найдены</td></tr>';
        return;
    }
    
    tbody.innerHTML = loansToShow.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const reader = readers.find(r => r.id === loan.readerId);
        
        const today = new Date();
        const returnDate = new Date(loan.returnDate);
        const isOverdue = !loan.returned && returnDate < today;
        const daysOverdue = isOverdue ? Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24)) : 0;
        
        let statusText = loan.returned ? 'Возвращена' : 'Активна';
        let statusClass = loan.returned ? 'status-available' : 'status-reserved';
        
        if (isOverdue) {
            statusText = 'Просрочена';
            statusClass = 'status-issued';
        }
        
        return `
            <tr>
                <td>${loan.id}</td>
                <td><strong>${book ? book.title : 'Неизвестно'}</strong><br><small>${book ? book.author : ''}</small></td>
                <td>${reader ? reader.name : 'Неизвестно'}</td>
                <td>${formatDate(loan.loanDate)}</td>
                <td>${formatDate(loan.returnDate)}</td>
                <td><span class="book-status ${statusClass}">${statusText}</span></td>
                <td>${isOverdue ? daysOverdue + ' дн.' : '-'}</td>
                <td>
                    ${!loan.returned ? 
                        `<button class="btn-icon" onclick="returnLoan(${loan.id})" title="Вернуть">
                            <i class="fas fa-check-circle"></i>
                        </button>
                        <button class="btn-icon" onclick="showExtendModal(${loan.id})" title="Продлить">
                            <i class="fas fa-clock"></i>
                        </button>` : 
                        `<button class="btn-icon" onclick="viewLoanDetails(${loan.id})" title="Детали">
                            <i class="fas fa-info-circle"></i>
                        </button>`
                    }
                </td>
            </tr>
        `;
    }).join('');
}

// Загрузка книг для селекта
function loadBooksForSelect() {
    const select = document.getElementById('loanBook');
    if (!select) return;
    
    const availableBooks = books.filter(book => book.available);
    select.innerHTML = '<option value="">Выберите книгу</option>' +
        availableBooks.map(book => `<option value="${book.id}" data-available="${book.available}">${book.title} (${book.author})</option>`).join('');
}

// Загрузка читателей для селекта
function loadReadersForSelect() {
    const select = document.getElementById('loanReader');
    if (!select) return;
    
    select.innerHTML = '<option value="">Выберите читателя</option>' +
        readers.map(reader => `<option value="${reader.id}">${reader.name} (${reader.cardNumber})</option>`).join('');
}

// Установка дат по умолчанию
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const loanDate = document.getElementById('loanDate');
    if (loanDate) {
        loanDate.value = today;
        loanDate.min = today;
    }
    
    calculateReturnDate();
}

// Расчет даты возврата
function calculateReturnDate() {
    const loanDate = document.getElementById('loanDate')?.value;
    const period = parseInt(document.getElementById('loanPeriod')?.value || '14');
    
    if (loanDate && period) {
        const returnDate = new Date(loanDate);
        returnDate.setDate(returnDate.getDate() + period);
        document.getElementById('returnDate').value = returnDate.toISOString().split('T')[0];
    }
}

// Проверка доступности книги
function checkBookAvailability() {
    const bookId = document.getElementById('loanBook')?.value;
    const availabilityHint = document.getElementById('bookAvailability');
    
    if (bookId) {
        const book = books.find(b => b.id === parseInt(bookId));
        if (book) {
            if (book.available) {
                availabilityHint.innerHTML = '<span class="success-text"><i class="fas fa-check"></i> Книга доступна</span>';
            } else {
                availabilityHint.innerHTML = '<span class="danger-text"><i class="fas fa-times"></i> Книга недоступна</span>';
            }
        }
    } else {
        availabilityHint.innerHTML = '';
    }
}

// Проверка статуса читателя
function checkReaderStatus() {
    const readerId = document.getElementById('loanReader')?.value;
    const statusDiv = document.getElementById('readerStatus');
    
    if (readerId) {
        const reader = readers.find(r => r.id === parseInt(readerId));
        const readerLoans = loans.filter(loan => loan.readerId === parseInt(readerId) && !loan.returned);
        const overdueLoans = readerLoans.filter(loan => new Date(loan.returnDate) < new Date());
        
        if (overdueLoans.length > 0) {
            statusDiv.innerHTML = '<span class="warning-text"><i class="fas fa-exclamation-triangle"></i> Есть просроченные книги</span>';
        } else if (readerLoans.length >= 5) {
            statusDiv.innerHTML = '<span class="warning-text"><i class="fas fa-info-circle"></i> Достигнут лимит выдач</span>';
        } else {
            statusDiv.innerHTML = '<span class="success-text"><i class="fas fa-check"></i> Можно выдавать</span>';
        }
    } else {
        statusDiv.innerHTML = '';
    }
}

// Показать модальное окно выдачи
function showLoanModal() {
    document.getElementById('loanModal').style.display = 'block';
    setDefaultDates();
    loadBooksForSelect();
    loadReadersForSelect();
}

// Закрыть модальное окно выдачи
function closeLoanModal() {
    document.getElementById('loanModal').style.display = 'none';
}

// Создание выдачи
function createLoan(event) {
    event.preventDefault();
    
    const bookId = parseInt(document.getElementById('loanBook').value);
    const readerId = parseInt(document.getElementById('loanReader').value);
    const loanDate = document.getElementById('loanDate').value;
    const period = parseInt(document.getElementById('loanPeriod').value);
    const comment = document.getElementById('loanComment').value;
    
    // Проверка лимита читателя
    const readerLoans = loans.filter(loan => loan.readerId === readerId && !loan.returned);
    if (readerLoans.length >= 5) {
        alert('Читатель достиг лимита выдач (максимум 5 книг)');
        return;
    }
    
    // Проверка на просрочки
    const overdueLoans = readerLoans.filter(loan => new Date(loan.returnDate) < new Date());
    if (overdueLoans.length > 0) {
        if (!confirm('У читателя есть просроченные книги. Продолжить выдачу?')) {
            return;
        }
    }
    
    // Расчет даты возврата
    const returnDate = new Date(loanDate);
    returnDate.setDate(returnDate.getDate() + period);
    
    const newLoan = {
        id: Date.now(),
        bookId: bookId,
        readerId: readerId,
        loanDate: loanDate,
        returnDate: returnDate.toISOString().split('T')[0],
        actualReturnDate: null,
        returned: false,
        extended: false,
        comment: comment,
        createdBy: currentUser?.id || null
    };
    
    // Обновление статуса книги
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.available = false;
        saveBooks();
    }
    
    loans.push(newLoan);
    saveLoans();
    
    closeLoanModal();
    showLoansTab('active');
    updateLoansStats();
}

// Возврат книги
function returnLoan(loanId) {
    if (confirm('Подтвердите возврат книги')) {
        const loan = loans.find(l => l.id === loanId);
        if (loan) {
            loan.returned = true;
            loan.actualReturnDate = new Date().toISOString().split('T')[0];
            
            // Обновление статуса книги
            const book = books.find(b => b.id === loan.bookId);
            if (book) {
                book.available = true;
                book.reserved = false;
                saveBooks();
            }
            
            saveLoans();
            filterLoans();
            updateLoansStats();
        }
    }
}

// Показать модальное окно продления
function showExtendModal(loanId) {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    const book = books.find(b => b.id === loan.bookId);
    const reader = readers.find(r => r.id === loan.readerId);
    
    document.getElementById('extendLoanId').value = loanId;
    
    const minDate = new Date().toISOString().split('T')[0];
    const maxDate = new Date(loan.returnDate);
    maxDate.setDate(maxDate.getDate() + 30);
    
    const newReturnDate = document.getElementById('newReturnDate');
    newReturnDate.min = minDate;
    newReturnDate.max = maxDate.toISOString().split('T')[0];
    newReturnDate.value = loan.returnDate;
    
    document.getElementById('extendLoanModal').style.display = 'block';
}

// Закрыть модальное окно продления
function closeExtendModal() {
    document.getElementById('extendLoanModal').style.display = 'none';
}

// Продление срока
function extendLoan(event) {
    event.preventDefault();
    
    const loanId = parseInt(document.getElementById('extendLoanId').value);
    const newDate = document.getElementById('newReturnDate').value;
    const reason = document.getElementById('extendReason').value;
    
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
        loan.returnDate = newDate;
        loan.extended = true;
        loan.extendReason = reason;
        loan.extendDate = new Date().toISOString().split('T')[0];
        
        saveLoans();
        closeExtendModal();
        filterLoans();
    }
}

// Экспорт выдач
function exportLoans() {
    const headers = ['ID', 'Книга', 'Читатель', 'Дата выдачи', 'Срок возврата', 'Статус'];
    const csvData = loans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const reader = readers.find(r => r.id === loan.readerId);
        return [
            loan.id,
            book ? book.title : 'Неизвестно',
            reader ? reader.name : 'Неизвестно',
            loan.loanDate,
            loan.returnDate,
            loan.returned ? 'Возвращена' : 'Активна'
        ];
    });
    
    const csv = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'loans_export.csv';
    link.click();
}

// ================ ОТЧЕТЫ ================

// Загрузка данных для отчетов
function loadReportsData() {
    loadOverviewReport();
    loadPopularBooksReport();
    loadReadersActivityReport();
    loadDebtorsReport();
    loadInventoryReport();
}

// Загрузка обзорного отчета
function loadOverviewReport() {
    const period = document.getElementById('overviewPeriod')?.value || 'month';
    
    // Показываем кастомный диапазон
    const customRange = document.getElementById('overviewCustomRange');
    if (customRange) {
        customRange.style.display = period === 'custom' ? 'flex' : 'none';
    }
    
    // Здесь должна быть загрузка данных с сервера
    // Пока используем тестовые данные
    
    document.getElementById('totalLoansMetric').textContent = '156';
    document.getElementById('returnedLoansMetric').textContent = '142';
    document.getElementById('newReadersMetric').textContent = '23';
    document.getElementById('overdueLoansMetric').textContent = '12';
    
    // Заполнение сводной таблицы
    const summaryBody = document.getElementById('summaryTable');
    if (summaryBody) {
        summaryBody.innerHTML = `
            <tr>
                <td>Выдачи книг</td>
                <td>156</td>
                <td>142</td>
                <td class="positive">+9.9%</td>
            </tr>
            <tr>
                <td>Новые читатели</td>
                <td>23</td>
                <td>18</td>
                <td class="positive">+27.8%</td>
            </tr>
            <tr>
                <td>Возвраты</td>
                <td>142</td>
                <td>138</td>
                <td class="positive">+2.9%</td>
            </tr>
            <tr>
                <td>Просрочки</td>
                <td>12</td>
                <td>15</td>
                <td class="positive">-20%</td>
            </tr>
        `;
    }
}

// Загрузка отчета по популярным книгам
function loadPopularBooksReport() {
    const tbody = document.getElementById('popularBooksTable');
    if (!tbody) return;
    
    // Тестовые данные
    const popularBooks = [
        { title: 'Война и мир', author: 'Лев Толстой', genre: 'fiction', loans: 45, days: 320, popularity: 95 },
        { title: 'Преступление и наказание', author: 'Ф. Достоевский', genre: 'fiction', loans: 38, days: 280, popularity: 88 },
        { title: 'Гарри Поттер', author: 'Дж. Роулинг', genre: 'fantasy', loans: 35, days: 290, popularity: 85 },
        { title: 'Мастер и Маргарита', author: 'М. Булгаков', genre: 'fiction', loans: 32, days: 240, popularity: 82 },
        { title: 'Убийство в Восточном экспрессе', author: 'А. Кристи', genre: 'detective', loans: 28, days: 210, popularity: 78 }
    ];
    
    tbody.innerHTML = popularBooks.map((book, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${getGenreName(book.genre)}</td>
            <td>${book.loans}</td>
            <td>${book.days}</td>
            <td>
                <div class="popularity-bar">
                    <div class="progress-bar" style="width: ${book.popularity}%"></div>
                    <span>${book.popularity}%</span>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Топ авторов
    const authorsList = document.getElementById('topAuthorsList');
    if (authorsList) {
        authorsList.innerHTML = `
            <div class="top-list-item">
                <span class="rank">1</span>
                <span class="name">Лев Толстой</span>
                <span class="count">45 выдач</span>
            </div>
            <div class="top-list-item">
                <span class="rank">2</span>
                <span class="name">Федор Достоевский</span>
                <span class="count">38 выдач</span>
            </div>
            <div class="top-list-item">
                <span class="rank">3</span>
                <span class="name">Джоан Роулинг</span>
                <span class="count">35 выдач</span>
            </div>
        `;
    }
}

// Загрузка отчета по активности читателей
function loadReadersActivityReport() {
    document.getElementById('newReadersCount').textContent = '23';
    document.getElementById('activeReadersCount').textContent = '156';
    document.getElementById('inactiveReadersCount').textContent = '45';
    document.getElementById('debtorsCount').textContent = '12';
    
    const topReadersTable = document.getElementById('topReadersTable');
    if (topReadersTable) {
        topReadersTable.innerHTML = `
            <tr><td>1</td><td>Иван Петров</td><td>15</td><td>320</td></tr>
            <tr><td>2</td><td>Мария Иванова</td><td>12</td><td>280</td></tr>
            <tr><td>3</td><td>Алексей Сидоров</td><td>10</td><td>240</td></tr>
        `;
    }
}

// Загрузка отчета по должникам
function loadDebtorsReport() {
    const today = new Date();
    const debtors = loans.filter(loan => {
        if (loan.returned) return false;
        const returnDate = new Date(loan.returnDate);
        return returnDate < today;
    });
    
    document.getElementById('totalDebtors').textContent = [...new Set(debtors.map(d => d.readerId))].length;
    document.getElementById('overdueBooks').textContent = debtors.length;
    
    const totalFines = debtors.reduce((sum, loan) => {
        const days = Math.ceil((today - new Date(loan.returnDate)) / (1000 * 60 * 60 * 24));
        return sum + (days * 10); // 10 руб в день
    }, 0);
    document.getElementById('totalFines').textContent = totalFines + ' ₽';
    
    const tbody = document.getElementById('debtorsTable');
    if (tbody) {
        tbody.innerHTML = debtors.map(loan => {
            const reader = readers.find(r => r.id === loan.readerId);
            const book = books.find(b => b.id === loan.bookId);
            const days = Math.ceil((today - new Date(loan.returnDate)) / (1000 * 60 * 60 * 24));
            const fine = days * 10;
            
            return `
                <tr>
                    <td>${reader ? reader.name : 'Неизвестно'}</td>
                    <td>${book ? book.title : 'Неизвестно'}</td>
                    <td>${formatDate(loan.loanDate)}</td>
                    <td>${formatDate(loan.returnDate)}</td>
                    <td>${days}</td>
                    <td>${fine} ₽</td>
                    <td><span class="badge-status danger">Просрочена</span></td>
                    <td>
                        <button class="btn-small" onclick="sendReminder(${loan.id})">Напомнить</button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Загрузка отчета по инвентаризации
function loadInventoryReport() {
    document.getElementById('totalInventoryBooks').textContent = books.length;
    document.getElementById('availableInventoryBooks').textContent = books.filter(b => b.available).length;
    document.getElementById('issuedInventoryBooks').textContent = books.filter(b => !b.available).length;
    
    // Распределение по жанрам
    const genreStats = {};
    books.forEach(book => {
        genreStats[book.genre] = (genreStats[book.genre] || 0) + 1;
    });
    
    const genreDiv = document.getElementById('inventoryByGenre');
    if (genreDiv) {
        genreDiv.innerHTML = Object.entries(genreStats).map(([genre, count]) => `
            <div class="genre-stat">
                <span>${getGenreName(genre)}</span>
                <div class="progress-bar" style="width: ${(count / books.length * 100)}%"></div>
                <span>${count}</span>
            </div>
        `).join('');
    }
}

// Отправка напоминаний должникам
function sendDebtReminders() {
    alert('Напоминания отправлены всем должникам');
}

// Начало инвентаризации
function startInventory() {
    if (confirm('Начать инвентаризацию фонда?')) {
        alert('Инвентаризация начата. Следуйте инструкциям на экране.');
    }
}

// Экспорт отчета
function exportReport(type) {
    alert(`Отчет "${type}" экспортирован`);
}

// Инициализация графиков отчетов
function initReportCharts() {
    // Дневная динамика
    const dailyCtx = document.getElementById('dailyChart')?.getContext('2d');
    if (dailyCtx) {
        new Chart(dailyCtx, {
            type: 'bar',
            data: {
                labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                datasets: [{
                    label: 'Выдачи',
                    data: [12, 19, 15, 17, 24, 30, 28],
                    backgroundColor: '#4361ee'
                }, {
                    label: 'Возвраты',
                    data: [10, 15, 12, 14, 20, 25, 22],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Жанры
    const genresCtx = document.getElementById('genresPieChart')?.getContext('2d');
    if (genresCtx) {
        new Chart(genresCtx, {
            type: 'doughnut',
            data: {
                labels: ['Художественная', 'Научная', 'Фэнтези', 'Детектив', 'История'],
                datasets: [{
                    data: [45, 20, 15, 12, 8],
                    backgroundColor: ['#4361ee', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Часовая активность
    const hourlyCtx = document.getElementById('hourlyChart')?.getContext('2d');
    if (hourlyCtx) {
        new Chart(hourlyCtx, {
            type: 'line',
            data: {
                labels: ['9-11', '11-13', '13-15', '15-17', '17-19', '19-21'],
                datasets: [{
                    data: [8, 15, 20, 18, 12, 5],
                    borderColor: '#4361ee',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// ================ МОИ КНИГИ (ПОЛЬЗОВАТЕЛЬ) ================

// Загрузка моих книг
function loadMyBooks() {
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    showMyBooksTab('current');
}

// Переключение вкладок моих книг
function showMyBooksTab(tab) {
    const tabs = document.querySelectorAll('.my-books-tab');
    tabs.forEach(t => t.classList.remove('active'));
    
    const tabBtns = document.querySelectorAll('.my-books-tabs .tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeTab = document.getElementById(tab + 'Tab');
    if (activeTab) {
        activeTab.classList.add('active');
        
        const activeBtn = Array.from(tabBtns).find(btn => 
            btn.textContent.toLowerCase().includes(tab === 'current' ? 'текущ' :
                                                tab === 'history' ? 'истор' :
                                                tab === 'reserved' ? 'бронир' : 'избран')
        );
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    switch(tab) {
        case 'current':
            loadCurrentBooks();
            break;
        case 'history':
            loadHistoryBooks();
            break;
        case 'reserved':
            loadReservedBooks();
            break;
        case 'favorites':
            loadFavoritesBooks();
            break;
    }
}

// Загрузка текущих книг
function loadCurrentBooks() {
    const container = document.getElementById('currentBooksContainer');
    if (!container) return;
    
    const userLoans = loans.filter(loan => loan.readerId === currentUser.id && !loan.returned);
    document.getElementById('currentBooksCount').textContent = userLoans.length;
    
    if (userLoans.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-book-open"></i><p>У вас нет книг на руках</p><a href="catalog.html" class="btn-primary">Перейти в каталог</a></div>';
        return;
    }
    
    // Находим ближайший срок сдачи
    const today = new Date();
    const nearestLoan = userLoans.reduce((nearest, loan) => {
        const returnDate = new Date(loan.returnDate);
        if (!nearest || returnDate < new Date(nearest.returnDate)) {
            return loan;
        }
        return nearest;
    }, null);
    
    if (nearestLoan) {
        const returnDate = new Date(nearestLoan.returnDate);
        const diffDays = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));
        
        let message = '';
        if (diffDays < 0) {
            message = `Просрочка на ${Math.abs(diffDays)} дн.`;
        } else if (diffDays === 0) {
            message = 'Сегодня последний день';
        } else if (diffDays === 1) {
            message = 'Завтра последний день';
        } else {
            message = `${diffDays} дн. до сдачи`;
        }
        
        document.getElementById('nearestReturn').textContent = message;
    }
    
    container.innerHTML = userLoans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const returnDate = new Date(loan.returnDate);
        const diffDays = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));
        
        let statusClass = 'success';
        let statusText = 'В норме';
        
        if (diffDays < 0) {
            statusClass = 'danger';
            statusText = 'Просрочена';
        } else if (diffDays <= 3) {
            statusClass = 'warning';
            statusText = 'Скоро сдавать';
        }
        
        return `
            <div class="book-shelf-card">
                <div class="book-cover-small">
                    <i class="fas fa-book"></i>
                </div>
                <div class="book-info">
                    <h3>${book ? book.title : 'Неизвестно'}</h3>
                    <p class="book-author">${book ? book.author : 'Неизвестно'}</p>
                    <div class="loan-dates">
                        <p><i class="fas fa-calendar-plus"></i> Взята: ${formatDate(loan.loanDate)}</p>
                        <p><i class="fas fa-calendar-check"></i> Вернуть: ${formatDate(loan.returnDate)}</p>
                    </div>
                    <div class="book-status ${statusClass}">${statusText}</div>
                    <div class="book-actions">
                        <button class="btn-small" onclick="showBookDetails(${book.id})">
                            <i class="fas fa-info-circle"></i> Подробнее
                        </button>
                        <button class="btn-small" onclick="showExtendRequest(${loan.id})">
                            <i class="fas fa-clock"></i> Продлить
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Загрузка истории чтения
function loadHistoryBooks() {
    const container = document.getElementById('historyBooksContainer');
    if (!container) return;
    
    const userLoans = loans.filter(loan => loan.readerId === currentUser.id && loan.returned);
    document.getElementById('historyBooksCount').textContent = userLoans.length;
    
    // Подсчет статистики
    const totalDays = userLoans.reduce((sum, loan) => {
        const start = new Date(loan.loanDate);
        const end = new Date(loan.actualReturnDate || loan.returnDate);
        return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }, 0);
    
    const totalPages = userLoans.reduce((sum, loan) => {
        const book = books.find(b => b.id === loan.bookId);
        return sum + (book?.pages || 300); // Примерно 300 страниц в среднем
    }, 0);
    
    document.getElementById('totalReadTime').textContent = totalDays;
    document.getElementById('avgReadTime').textContent = userLoans.length > 0 ? 
        Math.round(totalDays / userLoans.length) : 0;
    document.getElementById('totalPages').textContent = totalPages;
    
    // Группировка по месяцам
    const historyByMonth = {};
    userLoans.forEach(loan => {
        const date = new Date(loan.loanDate);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!historyByMonth[key]) {
            historyByMonth[key] = [];
        }
        historyByMonth[key].push(loan);
    });
    
    container.innerHTML = Object.entries(historyByMonth)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([month, monthLoans]) => {
            const [year, monthNum] = month.split('-');
            const monthName = new Date(year, monthNum - 1).toLocaleString('ru', { month: 'long' });
            
            return `
                <div class="timeline-month">
                    <h4>${monthName} ${year}</h4>
                    <div class="month-books">
                        ${monthLoans.map(loan => {
                            const book = books.find(b => b.id === loan.bookId);
                            return `
                                <div class="history-book-item" onclick="showBookDetails(${book.id})">
                                    <div class="book-mini-cover">
                                        <i class="fas fa-book"></i>
                                    </div>
                                    <div class="book-mini-info">
                                        <strong>${book ? book.title : 'Неизвестно'}</strong>
                                        <p>${book ? book.author : 'Неизвестно'}</p>
                                        <small>Взята: ${formatDate(loan.loanDate)} • ${Math.ceil((new Date(loan.actualReturnDate || loan.returnDate) - new Date(loan.loanDate)) / (1000 * 60 * 60 * 24))} дн.</small>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
}

// Загрузка забронированных книг
function loadReservedBooks() {
    const container = document.getElementById('reservedBooksContainer');
    if (!container) return;
    
    const reservedBooks = books.filter(book => book.reserved);
    document.getElementById('reservedBooksCount').textContent = reservedBooks.length;
    
    if (reservedBooks.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-bookmark"></i><p>У вас нет забронированных книг</p><a href="catalog.html" class="btn-primary">Забронировать книгу</a></div>';
        return;
    }
    
    container.innerHTML = reservedBooks.map(book => `
        <div class="book-shelf-card">
            <div class="book-cover-small">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="reserved-info">
                    <p><i class="fas fa-hourglass-half"></i> Хранится до: ${getExpiryDate()}</p>
                </div>
                <div class="book-actions">
                    <button class="btn-small" onclick="showBookDetails(${book.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                    <button class="btn-small btn-danger" onclick="cancelReservation(${book.id})">
                        <i class="fas fa-times"></i> Отменить
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Загрузка избранного
function loadFavoritesBooks() {
    const container = document.getElementById('favoritesBooksContainer');
    if (!container) return;
    
    // Для демо показываем случайные книги
    const favorites = books.slice(0, 3);
    document.getElementById('favoritesBooksCount').textContent = favorites.length;
    
    container.innerHTML = favorites.map(book => `
        <div class="book-shelf-card">
            <div class="book-cover-small">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="favorite-note">
                    <p><i class="fas fa-sticky-note"></i> ${getRandomNote()}</p>
                </div>
                <div class="book-actions">
                    <button class="btn-small" onclick="showBookDetails(${book.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                    <button class="btn-small" onclick="removeFromFavorites(${book.id})">
                        <i class="fas fa-heart-broken"></i> Удалить
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Показать запрос на продление
function showExtendRequest(loanId) {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    const book = books.find(b => b.id === loan.bookId);
    
    document.getElementById('extendBookId').value = loanId;
    document.getElementById('extendBookTitle').value = book ? book.title : '';
    document.getElementById('currentReturnDate').value = formatDate(loan.returnDate);
    
    const minDate = new Date().toISOString().split('T')[0];
    const maxDate = new Date(loan.returnDate);
    maxDate.setDate(maxDate.getDate() + 30);
    
    const desiredDate = document.getElementById('desiredReturnDate');
    desiredDate.min = minDate;
    desiredDate.max = maxDate.toISOString().split('T')[0];
    desiredDate.value = loan.returnDate;
    
    document.getElementById('extendRequestModal').style.display = 'block';
}

// Закрыть запрос на продление
function closeExtendRequest() {
    document.getElementById('extendRequestModal').style.display = 'none';
}

// Отправить запрос на продление
function submitExtendRequest(event) {
    event.preventDefault();
    
    const loanId = document.getElementById('extendBookId').value;
    const desiredDate = document.getElementById('desiredReturnDate').value;
    const reason = document.getElementById('extendReason').value;
    
    // Здесь должен быть запрос к серверу
    alert('Запрос на продление отправлен. Ожидайте подтверждения библиотекаря.');
    closeExtendRequest();
}

// Отмена бронирования
function cancelReservation(bookId) {
    if (confirm('Отменить бронирование книги?')) {
        const book = books.find(b => b.id === bookId);
        if (book) {
            book.reserved = false;
            saveBooks();
            loadReservedBooks();
        }
    }
}

// Добавление в избранное
function addToFavorites(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('favoriteBookId').value = bookId;
    document.getElementById('favoriteBookTitle').value = book.title;
    document.getElementById('addToFavoritesModal').style.display = 'block';
}

// Сохранение в избранное
function saveToFavorites(event) {
    event.preventDefault();
    
    const bookId = document.getElementById('favoriteBookId').value;
    const folder = document.getElementById('favoriteFolder').value;
    const note = document.getElementById('favoriteNote').value;
    
    // Здесь должно быть сохранение
    alert('Книга добавлена в избранное');
    closeFavoritesModal();
}

// Закрыть модальное окно избранного
function closeFavoritesModal() {
    document.getElementById('addToFavoritesModal').style.display = 'none';
}

// Удаление из избранного
function removeFromFavorites(bookId) {
    if (confirm('Удалить из избранного?')) {
        loadFavoritesBooks();
    }
}

// Экспорт избранного
function exportFavorites() {
    alert('Список избранного экспортирован');
}

// Поделиться избранным
function shareFavorites() {
    alert('Ссылка на список избранного скопирована');
}

// Вспомогательные функции
function getExpiryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return formatDate(date.toISOString().split('T')[0]);
}

function getRandomNote() {
    const notes = [
        'Обязательно перечитать',
        'Рекомендую друзьям',
        'Шедевр!',
        'Интересно, но сложно',
        'Быстро читается'
    ];
    return notes[Math.floor(Math.random() * notes.length)];
}

// Фильтрация моих книг
function filterMyBooks() {
    const searchText = document.getElementById('searchMyBooks')?.value.toLowerCase() || '';
    const activeTab = document.querySelector('.my-books-tab.active');
    
    if (activeTab) {
        const cards = activeTab.querySelectorAll('.book-shelf-card');
        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const author = card.querySelector('.book-author')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchText) || author.includes(searchText)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
}