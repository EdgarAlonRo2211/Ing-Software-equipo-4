// Datos de servicios
const servicios = [
    { numero: "001", nombre: "Servicio 12093746 Casa", direccion: "Av. Principal 123, Ciudad" },
    { numero: "002", nombre: "Servicio 09488823 Casa 2", direccion: "Calle Secundaria 456, Centro" },
    { numero: "003", nombre: "Servicio 00012932 Trabajo", direccion: "Plaza Comercial 789, Zona Norte" },
    { numero: "004", nombre: "Servicio 12121211 Empresa", direccion: "Boulevard Industrial 321, Polígono" },
    { numero: "005", nombre: "Servicio 93948275 Tienda", direccion: "FES Acatlan, Naucalpan" }
];


function generarServicios() {
    const listaServicios = document.getElementById('listaServicios');
    
    servicios.forEach(servicio => {
        const divServicio = document.createElement('div');
        divServicio.className = 'servicio';
        divServicio.onclick = () => mostrarResultados(servicio);
        
        divServicio.innerHTML = `
            <span class="numero-servicio">#${servicio.numero}</span>
            <div class="info-servicio">
                <div class="nombre-servicio">${servicio.nombre}</div>
                <div class="direccion-servicio">${servicio.direccion}</div>
            </div>
        `;
        
        listaServicios.appendChild(divServicio);
    });
}


function toggleServicios() {
    const lista = document.getElementById('listaServicios');
    const boton = document.querySelector('.boton-servicios');
    
    lista.classList.toggle('mostrar');
    boton.classList.toggle('activo');
}


function mostrarResultados(servicio) {
    const modal = document.getElementById('modalResultados');
    modal.style.display = 'block';
    
    
    iniciarContador(servicio);
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modalResultados');
    modal.style.display = 'none';
}


function iniciarContador(servicio) {
    const contador = document.getElementById('contador');
    const barraProgreso = document.getElementById('barraProgreso');
    const numeroFinal = Math.floor(Math.random() * 901) + 100; 
    
    let contadorActual = 0;
    const duracion = 2000; 
    const incremento = numeroFinal / (duracion / 50); 
    
    const intervalo = setInterval(() => {
        contadorActual += incremento;
        
        if (contadorActual >= numeroFinal) {
            contadorActual = numeroFinal;
            clearInterval(intervalo);
            
            
            actualizarValores(numeroFinal);
        }
        
        contador.textContent = Math.floor(contadorActual);
        
        
        const porcentaje = (contadorActual / 1000) * 100;
        barraProgreso.style.width = Math.min(porcentaje, 100) + '%';
        
    }, 50);
}


function actualizarValores(consumo) {
    const excedente = consumo - 900; 
    const excedenteFormateado = excedente > 0 ? excedente.toLocaleString() : '0';
    
    const suma = 900 + (excedente > 0 ? excedente : 0); 
    const sumaFormateada = suma.toLocaleString();
    
    
    const subtotalExcedente = excedente > 0 ? (excedente * 2.990).toFixed(2) : '0.00';
    const subtotalExcedenteFormateado = parseFloat(subtotalExcedente).toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    
    const totalFinal = 224.70 + 262.20 + 336.60 + parseFloat(subtotalExcedente);
    const totalFinalFormateado = totalFinal.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    
    document.getElementById('excedente').textContent = excedenteFormateado;
    document.getElementById('suma').textContent = sumaFormateada;
    document.getElementById('subtotalExcedente').textContent = subtotalExcedenteFormateado;
    document.getElementById('totalFinal').textContent = totalFinalFormateado;
}


function descargarReporte() {
    const boton = document.querySelector('.boton-descarga');
    const textoOriginal = boton.textContent;
    

    boton.textContent = ' Descargando...';
    boton.disabled = true;
    
    setTimeout(() => {
        boton.textContent = 'Descarga completada';
        
        setTimeout(() => {
            boton.textContent = textoOriginal;
            boton.disabled = false;
            
            
            alert('Descarga simulada completada. En una implementación real, se descargaría el reporte PDF.');
        }, 1500);
    }, 2000);
}

window.onclick = function(event) {
    const modal = document.getElementById('modalResultados');
    if (event.target === modal) {
        cerrarModal();
    }
}

document.addEventListener('DOMContentLoaded', generarServicios);