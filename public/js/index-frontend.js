document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.getElementById('tablaVehiculos');

    fetch('/api/vehiculos')
        .then(response => response.json())
        .then(inventario => {
            if (!inventario || inventario.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay vehículos registrados.</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            inventario.forEach(auto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${auto.marca}</td>
                    <td>${auto.modelo}</td>
                    <td>${auto.ano}</td>
                    <td>${auto.matricula}</td>
                    <td>${auto.motor}</td>
                    <td>$${Number(auto.precio).toLocaleString('es-CL')}</td>
                    <td>
                        <button class="btn btn-danger" onclick="eliminarAuto(${auto.id_vehiculo})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error cargando los datos:', error);
        });
});

window.eliminarAuto = function(id) {
    if (confirm('¿Seguro que deseas remover este vehículo?')) {
        fetch(`/api/vehiculos/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error eliminando:', error);
        });
    }
};