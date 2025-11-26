// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // File upload display
    setupFileUpload('photoUpload', 'photo', 'photoFileName');
    setupFileUpload('musicUpload', 'music', 'musicFileName');

    // Scroll animations
    setupScrollAnimations();

    // Load dynamic content
    loadCategories();
    loadGallery();
    loadTestimonials();
});

// File upload functionality
function setupFileUpload(uploadElementId, fileInputId, fileNameElementId) {
    const uploadElement = document.getElementById(uploadElementId);
    const fileInput = document.getElementById(fileInputId);
    const fileNameElement = document.getElementById(fileNameElementId);

    if (uploadElement && fileInput && fileNameElement) {
        uploadElement.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileNameElement.textContent = this.files[0].name;
            } else {
                fileNameElement.textContent = 'Файл не выбран';
            }
        });
    }
}

// Scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });
}

// Load categories from "database"
function loadCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (!categoriesContainer) return;

    // Simulate database data
    const categories = [
        { id: 1, name: 'Лейтилс', description: 'Покажите свое мастерство в дефиле и презентации моделей' },
        { id: 2, name: 'Фотоконкурс', description: 'Представьте свои лучшие фотографии в различных номинациях' },
        { id: 3, name: 'Фотоиониум', description: 'Экспериментальная категория для творческих фотографов' }
    ];

    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-card fade-in-up';
        categoryElement.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        `;
        categoriesContainer.appendChild(categoryElement);
    });

    // Also populate contests in registration form
    const contestsContainer = document.getElementById('contestsContainer');
    if (contestsContainer) {
        categories.forEach(category => {
            const contestElement = document.createElement('div');
            contestElement.className = 'checkbox-item';
            contestElement.innerHTML = `
                <input type="checkbox" id="contest${category.id}" name="contests" value="${category.id}">
                <label for="contest${category.id}">${category.name}</label>
            `;
            contestsContainer.appendChild(contestElement);
        });
    }
}

// Load gallery from "database"
function loadGallery() {
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) return;

    // Simulate gallery data
    const galleryItems = [
        { id: 1, image: 'images/gallery1.jpg', title: 'Фото 1' },
        { id: 2, image: 'images/gallery2.jpg', title: 'Фото 2' },
        { id: 3, image: 'images/gallery3.jpg', title: 'Фото 3' },
        { id: 4, image: 'images/gallery4.jpg', title: 'Фото 4' },
        { id: 5, image: 'images/gallery5.jpg', title: 'Фото 5' },
        { id: 6, image: 'images/gallery6.jpg', title: 'Фото 6' }
    ];

    galleryItems.forEach(item => {
        const galleryElement = document.createElement('div');
        galleryElement.className = 'gallery-item fade-in-up';
        galleryElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Фото+конкурса'">
        `;
        galleryContainer.appendChild(galleryElement);
    });
}

// Load testimonials from "database"
function loadTestimonials() {
    const testimonialsContainer = document.querySelector('.testimonials-slider');
    if (!testimonialsContainer) return;

    // Simulate testimonials data
    const testimonials = [
        {
            id: 1,
            text: "Организация конкурса прошла на высшем уровне! Все было продумано до мелочей.",
            author: "Алексей Иванов",
            role: "Участник конкурса"
        },
        {
            id: 2,
            text: "Большое спасибо за профессионализм и отзывчивых людей! Получил бесценный опыт.",
            author: "Мария Смирнова",
            role: "Победитель в номинации"
        },
        {
            id: 3,
            text: "Незабываемые эмоции и яркие впечатления! Команда Конкурса Прожектор - настоящие профессионалы своего дела.",
            author: "Екатерина Петрова",
            role: "Участник конкурса"
        }
    ];

    // Clear existing testimonials except the first one (template)
    while (testimonialsContainer.children.length > 1) {
        testimonialsContainer.removeChild(testimonialsContainer.lastChild);
    }

    // Add testimonials (skip first one as it's the template)
    testimonials.forEach((testimonial, index) => {
        if (index > 0) { // Skip first one as it's already in HTML
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial-card';
            testimonialElement.innerHTML = `
                <p class="testimonial-text">"${testimonial.text}"</p>
                <p class="testimonial-author">${testimonial.author}</p>
                <p class="testimonial-role">${testimonial.role}</p>
            `;
            testimonialsContainer.appendChild(testimonialElement);
        }
    });
}