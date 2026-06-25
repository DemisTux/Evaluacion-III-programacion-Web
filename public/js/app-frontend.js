document.getElementById('formVehiculo').addEventListener('submit', function(event) {
    event.preventDefault();

    const marcaInput = document.getElementById('marca');
    const modeloInput = document.getElementById('modelo');
    const anoInput = document.getElementById('ano');
    const matriculaInput = document.getElementById('matricula');
    const confirmarInput = document.getElementById('confirmarMatricula');
    const motorInput = document.getElementById('motor');
    const precioInput = document.getElementById('precio');

    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));

    let esValido = true;

    if (!marcaInput.value.trim() || !modeloInput.value.trim() || !anoInput.value.trim() || !matriculaInput.value.trim() || !motorInput.value.trim() || !precioInput.value.trim()) {
        alert('Por favor, complete todos los campos obligatorios.');
    }

    if (marcaInput.value.trim().length < 3) {
        mostrarError('errorMarca', marcaInput, 'La marca debe tener al menos 3 caracteres.');
        esValido = false;
    }

    if (modeloInput.value.trim().length < 2) {
        mostrarError('errorModelo', modeloInput, 'El modelo debe tener al menos 2 caracteres.');
        esValido = false;
    }

    const ano = parseInt(anoInput.value);
    const anoActual = new Date().getFullYear();
    if (isNaN(ano) || ano < 1900 || ano > anoActual) {
        mostrarError('errorAno', anoInput, `Ingrese un año válido entre 1900 y ${anoActual}.`);
        esValido = false;
    }

    const regexMatricula = /^[A-Z]{2,4}[0-9]{2,4}$/i; 
    if (!regexMatricula.test(matriculaInput.value.trim())) {
        mostrarError('errorMatricula', matriculaInput, 'Formato inválido (Ej: BBCC12 o AA1020).');
        esValido = false;
    }

    if (matriculaInput.value.trim().toUpperCase() !== confirmarInput.value.trim().toUpperCase()) {
        mostrarError('errorConfirmar', confirmarInput, 'Las matrículas ingresadas no coinciden.');
        esValido = false;
    }

    if (motorInput.value.trim().length < 2) {
        mostrarError('errorMotor', motorInput, 'El código de motor no es válido.');
        esValido = false;
    }

    const precio = parseInt(precioInput.value);
    if (isNaN(precio) || precio <= 0) {
        mostrarError('errorPrecio', precioInput, 'Ingrese un precio mayor a 0.');
        esValido = false;
    }

    if (esValido) {
        const nuevoVehiculo = {
            marca: marcaInput.value.trim(),
            modelo: modeloInput.value.trim(),
            ano: ano,
            matricula: matriculaInput.value.trim().toUpperCase(),
            motor: motorInput.value.trim().toUpperCase(),
            precio: precio
        };

        fetch('/api/vehiculos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoVehiculo)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en el servidor');
            }
            return response.json();
        })
        .then(() => {
            alert('¡Vehículo guardado con éxito!');
            window.location.href = '/';
        })
        .catch(error => {
            alert('Error al guardar: la matrícula ya existe en la base de datos.');
            console.error(error);
        });
    }
});

function mostrarError(idSpark, elementoInput, mensaje) {
    document.getElementById(idSpark).textContent = mensaje;
    elementoInput.classList.add('input-error'); 
}