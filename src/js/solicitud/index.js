import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const formulario = document.getElementById('formularioSolicitud');
const btnGuardar = document.getElementById('btnGuardar');
const next_step = document.getElementById('next-step');

// Funciones para avanzar entre pasos
const nextStepBtn = document.getElementById('next-step');
const backStepBtn = document.getElementById('back-step');

// Asegurarse de que los elementos existan antes de añadir event listeners
if (nextStepBtn) {
    nextStepBtn.addEventListener('click', function () {
        // La navegación se manejará en la función siguiente()
    });
}

if (backStepBtn) {
    backStepBtn.addEventListener('click', function () {
        // Ocultar paso 2 y mostrar paso 1
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-1').style.display = 'block';

        document.getElementById('sol_cred_catalogo').value = '';

        Toast.fire({
            icon: 'info',
            title: 'Ingrese Catálogo'
        });
    });
}


const guardar = async (e) => {
    e.preventDefault();

    // Mostrar mensaje de confirmación
    const result = await Swal.fire({
        title: "Confirmación",
        text: "Revise bien la Información ya que esta acción es Irreversible. ¿Está Seguro que desea continuar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, Generar Solicitud",
        cancelButtonText: "Cancelar"
    });

    // Si el usuario no confirma, no se hace nada
    if (!result.isConfirmed) {
        return;
    }

    // Lista de campos requeridos que sí se guardarán en la BD
    const camposRequeridos = [
        'sol_cred_catalogo',
        'sol_cred_correo',
        'sol_cred_telefono',
        'sol_cred_usuario'
    ];

    // Validar solo los campos que se guardarán
    if (!validarFormulario(formulario, ['solicitud_id'], camposRequeridos)) {
        Swal.fire({
            title: "Campos vacíos",
            text: "Debe llenar todos los campos requeridos",
            icon: "info",
        });
        return;
    }

    // Limpiar y obtener los módulos y justificaciones
    const moduloInputs = document.querySelectorAll('select[name="modulos[]"]');
    const justificacionInputs = document.querySelectorAll('input[name="justificaciones[]"]');

    // Filtrar solo los módulos y justificaciones no vacíos
    const modulos = Array.from(moduloInputs)
        .map(input => input.value.trim())
        .filter(modulo => modulo !== '' && modulo !== '#');

    const justificaciones = Array.from(justificacionInputs)
        .map(input => input.value.trim())
        .filter(justificacion => justificacion !== '');

    // Validar módulos y justificaciones
    if (modulos.length === 0 || justificaciones.length === 0 || modulos.length !== justificaciones.length) {
        Swal.fire({
            title: "Datos Incompletos",
            text: "Debe llenar todos los módulos con sus justificaciones correspondientes.",
            icon: "info"
        });
        return;
    }

    // Validar máximo 4 módulos
    if (modulos.length > 4) {
        Swal.fire({
            title: "Límite Excedido",
            text: "Solo puede solicitar un máximo de 4 módulos",
            icon: "warning"
        });
        return;
    }

    try {
        const formData = new FormData(formulario);
        const dataToSend = new FormData();

        // Añadir solo los campos requeridos a la base de datos
        dataToSend.append('sol_cred_catalogo', formData.get('sol_cred_catalogo'));
        dataToSend.append('sol_cred_correo', formData.get('sol_cred_correo'));
        dataToSend.append('sol_cred_telefono', formData.get('sol_cred_telefono'));
        dataToSend.append('sol_cred_usuario', formData.get('sol_cred_usuario'));
        dataToSend.append('sol_cred_fecha_solicitud', new Date().toISOString().split('T')[0]);

        // Convertir módulos y justificaciones a JSON para enviarlos como un solo campo
        dataToSend.append('modulos', JSON.stringify(modulos));
        dataToSend.append('justificaciones', JSON.stringify(justificaciones));

        // Enviar los datos al servidor
        const url = "/AccessEntry-Autocom/API/solicitud/guardar";
        const config = {
            method: 'POST',
            body: dataToSend
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        const { codigo, mensaje, detalle } = data;
        let icono = 'info';

        if (codigo === 1) {
            icono = 'success';

            // Vaciar el formulario
            formulario.reset();

            // Volver al primer paso
            document.getElementById('step-2').style.display = 'none';
            document.getElementById('step-1').style.display = 'block';

            // Mostrar mensaje de éxito
            Swal.fire({
                title: "Solicitud Generada con Éxito",
                text: "Su solicitud ha sido registrada. Actualmente se encuentra en proceso. Será notificado oportunamente sobre cualquier actualización respecto al estado de su solicitud.",
                icon: "success",
                footer: '<a href="/AccessEntry-Autocom/estado">Ver Estado de Solicitud</a>',
            });
        } else {
            icono = 'error';
            console.error(detalle);
            Swal.fire({
                title: "Error",
                text: detalle || "Ocurrió un error al guardar la solicitud.",
                icon: icono,
            });
        }
    } catch (error) {
        console.error('Error al guardar la solicitud:', error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al procesar la solicitud. Inténtelo de nuevo más tarde.",
            icon: "error",
        });
    }
};


const fetchModulos = async () => {
    try {
        const response = await fetch("/AccessEntry-Autocom/API/solicitud/obtenerModulos");
        const data = await response.json();
        return data.modulos || [];
    } catch (error) {
        console.error('Error al obtener módulos:', error);
        return [];
    }
};

const agregarModulo = async () => {
    const container = document.getElementById('modulos-container');
    const modulosActuales = container.querySelectorAll('.modulo-grupo').length;

    if (modulosActuales >= 4) {
        Swal.fire({
            title: "Límite Alcanzado",
            text: "Solo puede solicitar un máximo de 4 módulos",
            icon: "warning"
        });
        return;
    }

    try {
        const response = await fetch("/AccessEntry-Autocom/API/solicitud/obtenerModulos");
        const data = await response.json();

        if (data.codigo !== 1) {
            throw new Error("No se pudieron obtener los módulos");
        }

        const modulos = data.modulos;

        const nuevoModulo = document.createElement('div');
        nuevoModulo.className = 'modulo-grupo mb-2';
        nuevoModulo.innerHTML = `
            <div class="row">
                <div class="col-md-5">
                    <label for="modulos[]" class="form-label">Seleccione Módulo</label>
                    <select name="modulos[]" id="modulos[]" class="form-control modulo-select">
                        <option value="#">Seleccione...</option>
                        ${modulos.map(modulo =>
            `<option value="${modulo.gma_codigo}">${modulo.gma_desc}</option>`
        ).join('')}
                    </select>
                </div>
                <div class="col-md-5">
                    <label for="justificaciones[]" class="form-label">Justificación</label>
                    <input type="text" 
                        name="justificaciones[]" 
                        id="justificaciones[]" 
                        class="form-control justificacion-input" 
                        placeholder="Justificación"
                        maxlength="200"
                    >
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger btn-remove-modulo">
                        <i class="bi bi-x-circle-fill"></i>
                    </button>
                </div>
            </div>`;

        container.appendChild(nuevoModulo);

        // Update remove button visibility
        const removeButtons = document.querySelectorAll('.btn-remove-modulo');
        removeButtons.forEach((btn, index) => {
            btn.style.display = index === 0 ? 'none' : 'block';
        });

    } catch (error) {
        console.error('Error al obtener módulos:', error);
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los módulos",
            icon: "error"
        });
    }
};

// Manejar la eliminación de módulos
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-remove-modulo')) {
        const moduloGrupo = e.target.closest('.modulo-grupo');
        const container = document.getElementById('modulos-container');

        // Eliminar el módulo seleccionado
        if (container.children.length > 1) {
            moduloGrupo.remove();

            // Actualizar la visibilidad de los botones de eliminar después de eliminar un módulo
            const removeButtons = document.querySelectorAll('.btn-remove-modulo');
            removeButtons.forEach((btn, index) => {
                if (index === 0) {
                    // Asegurarse de que el primer campo siga ocultando el botón de eliminar
                    btn.style.display = 'none';
                } else {
                    // Mostrar el botón de eliminar para los campos restantes
                    btn.style.display = 'block';
                }
            });
        }
    }
});






const siguiente = async (e) => {
    e.preventDefault();

    // Establecer la fecha actual en el campo de fecha
    const fechaActual = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    document.getElementById('sol_cred_fecha_solicitud').value = fechaActual;

    // Obtener el valor del catálogo
    const catalogo = formulario.sol_cred_catalogo.value.trim();

    // Validar que se haya ingresado un catálogo
    if (!catalogo) {
        Swal.fire({
            title: "Campo vacío",
            text: "Debe ingresar un número de catálogo",
            icon: "warning"
        });
        return;
    }

    try {
        // Verificar si existe el catálogo
        const body = new FormData(formulario);
        const url = "/AccessEntry-Autocom/API/solicitud/catalogoExiste";
        const config = {
            method: 'POST',
            body
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data.codigo === 1) {
            // El catálogo existe, obtener los datos del personal
            const urlDatos = "/AccessEntry-Autocom/API/solicitud/obtenerDatosPersonal";
            const respuestaDatos = await fetch(urlDatos, config);
            const datosPersonal = await respuestaDatos.json();
            console.log("Respuesta completa:", datosPersonal);

            if (datosPersonal.codigo === 1) {
                // Llenar los campos con los datos obtenidos
                document.getElementById('nombres_completos').value = datosPersonal.datos.NOMBRES_COMPLETOS;
                document.getElementById('puesto').value = datosPersonal.datos.PUESTO;

                // Mostrar el segundo paso
                document.getElementById('step-1').style.display = 'none';
                document.getElementById('step-2').style.display = 'block';

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Catalogo Verificado",
                    text: "Compruebe los datos del solicitante y complete los campos para realizar la Solicitud.",
                    showConfirmButton: true,
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron obtener los datos del personal",
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Catálogo no encontrado",
                text: "El número de catálogo ingresado no existe.",
                icon: "error"
            });
        }

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: "Error",
            text: "Ocurrio un problema al verificar el catálogo",
            icon: "error"
        });
    }
};




// Event Listeners
formulario.addEventListener('submit', guardar);
next_step.addEventListener('click', siguiente);
document.getElementById('agregar-modulo').addEventListener('click', agregarModulo);
