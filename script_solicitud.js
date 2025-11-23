// Validación del formulario
document.getElementById('solicitudForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar campos requeridos
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
            
            // Agregar animación de shake
            field.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                field.style.animation = '';
            }, 500);
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    
    if (isValid) {
        // Simular envío del formulario
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simular envío
        setTimeout(() => {
            submitBtn.textContent = 'Enviado Exitosamente';
            submitBtn.style.backgroundColor = '#28a745';
            
            // Mostrar mensaje de éxito
            alert('¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.');
            
            // Resetear formulario después de 2 segundos
            setTimeout(() => {
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 2000);
        }, 2000);
    } else {
        alert('Por favor, complete todos los campos requeridos.');
    }
});

// Animación para campos con error
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Mejorar experiencia de usuario con archivos
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Validar tamaño (5MB máximo)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('El archivo es demasiado grande. Máximo 5MB permitido.');
                this.value = '';
                return;
            }
            
            // Cambiar estilo cuando se selecciona un archivo
            this.style.borderColor = '#28a745';
            this.style.backgroundColor = '#f0fff4';
        }
    });
});

// Animación para secciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observar todas las secciones del formulario
document.querySelectorAll('.form-section').forEach(section => {
    observer.observe(section);
});

// Mejorar experiencia en campos de fecha
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
});

// Efecto hover mejorado para botones de radio
document.querySelectorAll('.radio-option').forEach(option => {
    option.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
    });
    
    option.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});