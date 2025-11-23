// Crear partículas de fondo
function crearParticulas() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamaño aleatorio
        const size = Math.random() * 60 + 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posición aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Opacidad aleatoria
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        // Animación delay aleatorio
        particle.style.animationDelay = `${Math.random() * 6}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Efectos para los botones
document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas de fondo
    crearParticulas();
    
    const btnVerServicios = document.getElementById('btnVerServicios');
    const btnSolicitarServicio = document.getElementById('btnSolicitarServicio');
    
    // Efecto de pulso en los botones al cargar
    setTimeout(() => {
        btnVerServicios.style.animation = 'pulse 2s ease-in-out';
        btnSolicitarServicio.style.animation = 'pulse 2s ease-in-out 0.5s';
        
        setTimeout(() => {
            btnVerServicios.style.animation = '';
            btnSolicitarServicio.style.animation = '';
        }, 2500);
    }, 1000);
    
    // Efectos al hacer hover en los botones
    btnVerServicios.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    btnVerServicios.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    btnSolicitarServicio.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    btnSolicitarServicio.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Funcionalidad de los botones
    btnVerServicios.addEventListener('click', function() {
        // Efecto de clic
        this.style.transform = 'scale(0.95)';
        
        // Simular redirección o acción
        setTimeout(() => {
            window.location.href = 'servicios.html';
        }, 300);
    });
    
    btnSolicitarServicio.addEventListener('click', function() {
        // Efecto de clic
        this.style.transform = 'scale(0.95)';
        
        // Simular redirección o acción
        setTimeout(() => {
            window.location.href = 'solicitud.html';
        }, 300);
    });
    
    // Efecto de tecleo en el título de bienvenida
    const welcomeText = document.querySelector('.welcome-text');
    const originalText = welcomeText.textContent;
    welcomeText.textContent = '';
    
    let i = 0;
    const typeWriter = setInterval(() => {
        if (i < originalText.length) {
            welcomeText.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typeWriter);
        }
    }, 50);
});