// Form handling functionality
document.addEventListener('DOMContentLoaded', function() {
    // Registration form handling
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }

    // Testimonial form handling
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', handleTestimonialSubmit);
    }
});

// Handle registration form submission
async function handleRegistrationSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Basic validation
    if (!validateRegistrationForm(formData)) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
        // Simulate API call - in real implementation, this would be a fetch to your backend
        await simulateApiCall(formData);
        
        showMessage('success', 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        form.reset();
        
        // Reset file names
        document.getElementById('photoFileName').textContent = 'Файл не выбран';
        document.getElementById('musicFileName').textContent = 'Файл не выбран';
        
    } catch (error) {
        showMessage('error', 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle testimonial form submission
async function handleTestimonialSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Basic validation
    if (!validateTestimonialForm(formData)) {
        return;
    }

    const submitBtn = form.querySelector('.btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await simulateApiCall(formData, 'testimonial');
        
        showMessage('success', 'Спасибо за ваш отзыв! Он будет опубликован после модерации.');
        form.reset();
        
    } catch (error) {
        showMessage('error', 'Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте еще раз.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Form validation
function validateRegistrationForm(formData) {
    const fullName = formData.get('fullName');
    const phone = formData.get('phone');
    const age = formData.get('age');
    const contests = formData.getAll('contests');
    const photo = formData.get('photo');

    if (!fullName || fullName.trim().length < 2) {
        showMessage('error', 'Пожалуйста, введите корректное ФИО');
        return false;
    }

    if (!phone || phone.trim().length < 5) {
        showMessage('error', 'Пожалуйста, введите корректный номер телефона');
        return false;
    }

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 16 || ageNum > 60) {
        showMessage('error', 'Возраст должен быть от 16 до 60 лет');
        return false;
    }

    if (contests.length === 0) {
        showMessage('error', 'Пожалуйста, выберите хотя бы один конкурс для участия');
        return false;
    }

    if (!photo || photo.size === 0) {
        showMessage('error', 'Пожалуйста, загрузите фотографию');
        return false;
    }

    return true;
}

function validateTestimonialForm(formData) {
    const authorName = formData.get('authorName');
    const testimonialText = formData.get('testimonialText');
    const rating = formData.get('rating');

    if (!authorName || authorName.trim().length < 2) {
        showMessage('error', 'Пожалуйста, введите ваше имя');
        return false;
    }

    if (!testimonialText || testimonialText.trim().length < 10) {
        showMessage('error', 'Отзыв должен содержать не менее 10 символов');
        return false;
    }

    if (!rating) {
        showMessage('error', 'Пожалуйста, выберите оценку');
        return false;
    }

    return true;
}

// Utility functions
function showMessage(type, text) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const message = document.createElement('div');
    message.className = type === 'success' ? 'success-message' : 'error-message';
    message.textContent = text;
    message.style.display = 'block';

    // Insert at the top of the form container
    const formContainer = document.querySelector('.form-container') || document.querySelector('.add-testimonial');
    if (formContainer) {
        formContainer.insertBefore(message, formContainer.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Simulate API call (replace with actual fetch in production)
function simulateApiCall(formData, type = 'registration') {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success (90% success rate)
            if (Math.random() > 0.1) {
                console.log(`${type} form data:`, Object.fromEntries(formData));
                resolve();
            } else {
                reject(new Error('Server error'));
            }
        }, 1500);
    });
}