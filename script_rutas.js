// Variables globales
let miLat = null;
let miLon = null;
let map = null;
let marcadores = [];
let clienteActual = null;
let rutaPolyline = null;

// Datos de clientes del día
const nodosDelDia = [
    { 
        nombre: "José Pérez", 
        direccion: "Calle Reforma 123, CDMX", 
        coords: [19.4330, -99.1912],
        id: 1
    },
    { 
        nombre: "María López", 
        direccion: "Insurgentes Sur 890, CDMX", 
        coords: [19.4310, -99.1335],
        id: 2
    },
    { 
        nombre: "Carlos García", 
        direccion: "Av. Juárez 55, CDMX", 
        coords: [19.4350, -99.1366],
        id: 3
    },
    { 
        nombre: "Ana Martínez", 
        direccion: "Calle Reforma 456, CDMX", 
        coords: [19.4330, -99.1320],
        id: 4
    },
    { 
        nombre: "Roberto Sánchez", 
        direccion: "Insurgentes Sur 567, CDMX", 
        coords: [19.4310, -99.1345],
        id: 5
    },
    { 
        nombre: "Laura González", 
        direccion: "Av. Juárez 89, CDMX", 
        coords: [19.4350, -99.1360],
        id: 6
    }
];

// Inicialización 
document.addEventListener('DOMContentLoaded', function() {
    inicializarMapa();
    inicializarEventos();
    obtenerUbicacionUsuario();
    actualizarContadorClientes();
});

function inicializarMapa() {
    // Inicializar mapa centrado en CDMX
    map = L.map('mapa').setView([19.4326, -99.1332], 13);

    // Capa del mapa
    L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { 
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(map);
}

function inicializarEventos() {
    // Botón calcular ruta
    document.getElementById('btnRuta').addEventListener('click', calcularRutaDelDia);
    
    // Botón cerrar panel
    document.getElementById('btnCerrarPanel').addEventListener('click', cerrarPanelCliente);
    
    // Botón guardar
    document.getElementById('btnGuardar').addEventListener('click', guardarInformacion);
    
    // Botón siguiente cliente
    document.getElementById('btnSiguiente').addEventListener('click', siguienteCliente);
    
    // Radio buttons para captura
    document.querySelectorAll('input[name="captura"]').forEach(radio => {
        radio.addEventListener('change', function() {
            manejarSeleccionCaptura(this.value);
        });
    });
    
    // Validación en tiempo real de entradas
    document.getElementById('lecturaInput').addEventListener('input', validarFormulario);
    document.getElementById('explicacionText').addEventListener('input', validarFormulario);
}

function obtenerUbicacionUsuario() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                miLat = pos.coords.latitude;
                miLon = pos.coords.longitude;
                
                console.log("Ubicación actual:", miLat, miLon);
                actualizarEstadoUbicacion(true);
                
                // Marcador de ubicación actual
                L.marker([miLat, miLon])
                    .addTo(map)
                    .bindPopup("<b>Tu ubicación actual</b><br>Estás aquí")
                    .openPopup();
                
                map.setView([miLat, miLon], 16);
            },
            (err) => {
                console.log("No se pudo obtener ubicación:", err);
                actualizarEstadoUbicacion(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
        actualizarEstadoUbicacion(false);
    }
}

function actualizarEstadoUbicacion(disponible) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (disponible) {
        statusDot.classList.add('active');
        statusText.textContent = 'Ubicación disponible';
    } else {
        statusDot.classList.remove('active');
        statusText.textContent = 'Ubicación no disponible';
    }
}

function actualizarContadorClientes() {
    document.getElementById('clientesCount').textContent = nodosDelDia.length;
}

function calcularRutaDelDia() {
    // Limpiar marcadores y rutas anteriores
    limpiarMapa();
    
    // Crear marcadores para cada cliente
    nodosDelDia.forEach((nodo, index) => {
        const marker = L.marker(nodo.coords)
            .addTo(map)
            .bindPopup(`
                <div style="text-align: center;">
                    <b>${nodo.nombre}</b><br>
                    <small>${nodo.direccion}</small><br>
                    <em>Cliente #${index + 1}</em>
                </div>
            `)
            .on("click", () => mostrarPanelCliente(nodo));
        
        marcadores.push(marker);
        
        // Número en el marcador
        L.divIcon({
            html: `<div style="
                background: var(--primary-color); 
                color: white; 
                border-radius: 50%; 
                width: 24px; 
                height: 24px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 12px; 
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            ">${index + 1}</div>`,
            className: 'custom-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    });
    
    // Trazar ruta si tenemos ubicación
    if (miLat && miLon && nodosDelDia.length > 0) {
        const primerCliente = nodosDelDia[0];
        trazarRuta(
            { lat: miLat, lon: miLon },
            { lat: primerCliente.coords[0], lon: primerCliente.coords[1] }
        );
        
        // Mostrar el primer cliente automáticamente
        setTimeout(() => {
            mostrarPanelCliente(primerCliente);
        }, 1000);
    }
    
    // Ajustar vista del mapa para mostrar todos los marcadores
    const group = new L.featureGroup(marcadores);
    map.fitBounds(group.getBounds().pad(0.1));
}

function limpiarMapa() {
    // Eliminar marcadores anteriores
    marcadores.forEach(marker => {
        map.removeLayer(marker);
    });
    marcadores = [];
    
    // Eliminar ruta anterior
    if (rutaPolyline) {
        map.removeLayer(rutaPolyline);
        rutaPolyline = null;
    }
}

function trazarRuta(origen, destino) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=full&geometries=geojson`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                const coords = data.routes[0].geometry.coordinates;
                const latlngs = coords.map(c => [c[1], c[0]]);
                
                rutaPolyline = L.polyline(latlngs, { 
                    color: '#058d20', 
                    weight: 5,
                    opacity: 0.7,
                    dashArray: '10, 10'
                }).addTo(map);
                
                // Animación de la ruta
                animarRuta(rutaPolyline);
            }
        })
        .catch(err => console.log("Error al calcular ruta:", err));
}

function animarRuta(polyline) {
    // Simular animación de progreso en la ruta
    let progress = 0;
    const interval = setInterval(() => {
        progress += 0.1;
        if (progress >= 1) {
            clearInterval(interval);
            // Cambiar a línea sólida cuando termine la animación
            polyline.setStyle({
                dashArray: null,
                opacity: 0.8
            });
        }
    }, 50);
}

function mostrarPanelCliente(nodo) {
    clienteActual = nodo;
    
    // Actualizar información en el panel
    document.getElementById('clienteNombre').textContent = nodo.nombre;
    document.getElementById('clienteDireccion').textContent = nodo.direccion;
    document.getElementById('clienteCoords').textContent = `${nodo.coords[0].toFixed(4)}, ${nodo.coords[1].toFixed(4)}`;
    
    // Resetear formulario
    document.querySelectorAll('input[name="captura"]').forEach(r => r.checked = false);
    document.getElementById('lecturaInput').value = '';
    document.getElementById('explicacionText').value = '';
    document.getElementById('capturaCampo').classList.add('hidden');
    document.getElementById('explicacionCampo').classList.add('hidden');
    document.getElementById('btnGuardar').disabled = true;
    
    // Mostrar panel con animación
    const panel = document.getElementById('panelCliente');
    panel.style.display = 'block';
    
    // Centrar mapa en el cliente
    map.setView(nodo.coords, 16);
    
    // Resaltar marcador del cliente actual
    resaltarMarcadorCliente(nodo);
}

function resaltarMarcadorCliente(nodo) {
    marcadores.forEach(marker => {
        const latlng = marker.getLatLng();
        if (latlng.lat === nodo.coords[0] && latlng.lng === nodo.coords[1]) {
            // Animación para el marcador actual
            marker.setZIndexOffset(1000);
            marker.openPopup();
        } else {
            marker.setZIndexOffset(0);
        }
    });
}

function cerrarPanelCliente() {
    document.getElementById('panelCliente').style.display = 'none';
    clienteActual = null;
}

function manejarSeleccionCaptura(valor) {
    if (valor === "si") {
        document.getElementById('capturaCampo').classList.remove('hidden');
        document.getElementById('explicacionCampo').classList.add('hidden');
    } else {
        document.getElementById('capturaCampo').classList.add('hidden');
        document.getElementById('explicacionCampo').classList.remove('hidden');
    }
    validarFormulario();
}

function validarFormulario() {
    const capturaSeleccionada = document.querySelector('input[name="captura"]:checked');
    const btnGuardar = document.getElementById('btnGuardar');
    
    if (!capturaSeleccionada) {
        btnGuardar.disabled = true;
        return;
    }
    
    if (capturaSeleccionada.value === "si") {
        const lectura = document.getElementById('lecturaInput').value;
        btnGuardar.disabled = !lectura || isNaN(lectura);
    } else {
        const explicacion = document.getElementById('explicacionText').value;
        btnGuardar.disabled = explicacion.length < 10;
    }
}

function guardarInformacion() {
    if (!clienteActual) return;
    
    const captura = document.querySelector('input[name="captura"]:checked').value;
    let datos = {
        clienteId: clienteActual.id,
        clienteNombre: clienteActual.nombre,
        fecha: new Date().toISOString(),
        capturaRealizada: captura === "si"
    };
    
    if (captura === "si") {
        datos.lectura = document.getElementById('lecturaInput').value;
    } else {
        datos.explicacion = document.getElementById('explicacionText').value;
    }
    
    // Simular guardado en base de datos
    console.log("Guardando datos:", datos);
    
    // Mostrar confirmación
    const btnGuardar = document.getElementById('btnGuardar');
    const originalText = btnGuardar.innerHTML;
    
    btnGuardar.innerHTML = 'Guardado';
    btnGuardar.style.background = 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)';
    
    setTimeout(() => {
        btnGuardar.innerHTML = originalText;
        btnGuardar.style.background = '';
    }, 2000);
    
    // Marcar cliente como completado en el mapa
    marcarClienteCompletado(clienteActual);
}

function marcarClienteCompletado(cliente) {
    marcadores.forEach(marker => {
        const latlng = marker.getLatLng();
        if (latlng.lat === cliente.coords[0] && latlng.lng === cliente.coords[1]) {
            // Cambiar color del marcador a verde
            marker.setIcon(L.divIcon({
                html: `<div style="
                    background: #28a745; 
                    color: white; 
                    border-radius: 50%; 
                    width: 24px; 
                    height: 24px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 12px; 
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                ">✓</div>`,
                className: 'custom-marker-completed',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            }));
        }
    });
}

function siguienteCliente() {
    if (!clienteActual) return;
    
    const currentIndex = nodosDelDia.findIndex(cliente => cliente.id === clienteActual.id);
    const nextIndex = (currentIndex + 1) % nodosDelDia.length;
    
    mostrarPanelCliente(nodosDelDia[nextIndex]);
}