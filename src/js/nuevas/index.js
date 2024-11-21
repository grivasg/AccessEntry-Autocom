import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";



const datatable = new DataTable('#tablaNuevas', {
    data: null,
    language: lenguaje,
    pageLength: '15',
    lengthMenu: [3, 9, 11, 25, 100],
    columns: [
        {
            title: 'No.',
            data: 'solicitud_id',
            width: '2%',
            render: (data, type, row, meta) => {
                return meta.row + 1;
            }
        },
        {
            title: 'Grado y Arma',
            data: 'grado_arma'
        },
        {
            title: 'Nombres del Solicitante',
            data: 'nombres_apellidos'
        },
        {
            title: 'Puesto',
            data: 'puesto_dependencia'
        },
        {
            title: 'Catalogo',
            data: 'sol_cred_catalogo'
        },
        {
            title: 'Modulos para habilitar',
            data: 'sol_cred_modulo',
            render: function (data) {
                try {
                    // Si el dato es un string, intenta parsearlo como JSON
                    const modulos = typeof data === 'string' ? JSON.parse(data) : data;
                    // Limpia los caracteres especiales y une con comas
                    return modulos
                        .map(modulo => modulo.trim())  // Elimina posibles espacios extra
                        .join(', ');  // Une con coma y espacio
                } catch (e) {
                    // Si no es un JSON válido, devuelve el dato tal cual
                    return data;
                }
            }
        },
        {
            title: 'Justificacion',
            data: 'sol_cred_justificacion',
            render: function (data) {
                try {
                    const justificaciones = typeof data === 'string' ? JSON.parse(data) : data;
                    return justificaciones
                        .map(justificacion => justificacion.trim())  // Limpia los caracteres especiales
                        .join(', ');  // Une con coma y espacio
                } catch (e) {
                    return data;
                }
            }
        },
        {
            title: '¿Tiene Usuario de AUTOCOM?',
            data: 'sol_cred_usuario'
        },
        {
            title: 'Fecha de Solicitud',
            data: 'sol_cred_fecha_solicitud',
            render: (data, type, row) => {
                if (!data) return "";
                const fecha = new Date(data);
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const año = fecha.getFullYear();
                return `${dia}/${mes}/${año}`;
            }
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                // Check localStorage for justification state
                const justificacionKey = `justificacion_${data}`;
                const justificacionCompleta = localStorage.getItem(justificacionKey) === 'true';

                if (justificacionCompleta) {
                    return `
                        <button class='btn btn-success verificar'><i class="bi bi-check-square-fill"></i></button>`;
                } else {
                    return `
                        <button class='btn btn-dark justificar'><i class="bi bi-toggles2"></i></button>
                        <button class='btn btn-danger rechazar'><i class="bi bi-hand-thumbs-down"></i></button>
                        <button class='btn btn-success verificar' style='display:none;'><i class="bi bi-clipboard-check"></i></button>`;
                }
            }
        }
    ]
});


const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/nuevas/buscar";
        const config = {
            method: 'GET'
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { datos } = data;

        datatable.clear().draw();

        if (datos) {
            // Add rows and then modify button visibility
            datatable.rows.add(datos).draw();

            // After drawing the table, adjust button visibility
            datos.forEach((row) => {
                // Check localStorage for justification state
                const justificacionKey = `justificacion_${row.solicitud_id}`;
                const justificacionCompleta = localStorage.getItem(justificacionKey) === 'true';

                const rowElement = document.querySelector(`#tablaNuevas tbody tr:has([data-solicitud-id="${row.solicitud_id}"])`);

                if (rowElement) {
                    const justificarBtn = rowElement.querySelector('.justificar');
                    const rechazarBtn = rowElement.querySelector('.rechazar');
                    const verificarBtn = rowElement.querySelector('.verificar');

                    if (justificacionCompleta) {
                        // If justification is complete, hide justificar and rechazar, show verificar
                        if (justificarBtn) justificarBtn.style.display = 'none';
                        if (rechazarBtn) rechazarBtn.style.display = 'none';
                        if (verificarBtn) verificarBtn.style.display = 'inline-block';
                    } else {
                        // Default state
                        if (justificarBtn) justificarBtn.style.display = 'inline-block';
                        if (rechazarBtn) rechazarBtn.style.display = 'inline-block';
                        if (verificarBtn) verificarBtn.style.display = 'none';
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};
buscar();


const mostrarJustificacion = async (e) => {
    const row = datatable.row(e.target.closest('tr')).data();
    const solicitud_id = row.solicitud_id;

    // Limpiar la cadena de módulos, eliminando posibles caracteres no deseados
    const modulosSeleccionadosOriginales = row.sol_cred_modulo
        .replace(/[\\"\[\]]/g, '') // Elimina barras, comillas, corchetes
        .split(',')
        .map(m => m.trim())
        .filter(m => m); // Elimina elementos vacíos

    const { value: formValues } = await Swal.fire({
        title: 'Selección de Módulos',
        width: '1000px', // Más ancho para Bootstrap
        heightAuto: true,
        html: `
            <style>
                .custom-checkbox {
                    transform: scale(1.3);
                    margin-right: 10px;
                }
                .custom-checkbox-label {
                    font-size: 16px;
                    vertical-align: middle;
                }
            </style>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-6 border-right">
                        <h3 class="h4 font-weight-bold mb-4">Módulos Disponibles:</h3>
                        <div class="list-group">
                            ${modulosSeleccionadosOriginales.map(modulo => `
                                <div class="list-group-item list-group-item-action p-3">
                                    <div class="custom-control custom-checkbox">
                                        <input 
                                            type="checkbox" 
                                            class="custom-control-input custom-checkbox" 
                                            id="${modulo}" 
                                            name="modulos" 
                                            value="${modulo}" 
                                            checked
                                        >
                                        <label 
                                            class="custom-control-label custom-checkbox-label" 
                                            for="${modulo}"
                                        >
                                            ${modulo}
                                        </label>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h3 class="h4 font-weight-bold mb-4">Justificaciones:</h3>
                        <div id="justificacionesContainer" class="mt-3">
                            <!-- Aquí se agregarán dinámicamente los campos de justificación -->
                        </div>
                    </div>
                </div>
            </div>
        `,
        focusConfirm: false,
        didRender: () => {
            const checkboxes = document.querySelectorAll('input[name="modulos"]');
            const justificacionesContainer = document.getElementById('justificacionesContainer');

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    const modulo = event.target.value;

                    // Contar cuántos checkboxes están seleccionados
                    const checkboxesSeleccionados = document.querySelectorAll('input[name="modulos"]:checked');

                    // Si se intenta des-seleccionar el último módulo
                    if (checkboxesSeleccionados.length === 0) {
                        // Revertir la des-selección
                        event.target.checked = true;

                        // Mostrar toast de alerta
                        Toast.fire({
                            icon: 'warning',
                            title: 'Debe seleccionar al menos un módulo',
                            timer: '5000',
                            html: `
                                <p>Si no va a autorizar ningun módulo, utilice la opción de rechazo de solicitud</p>
                                <i class="bi bi-hand-thumbs-down" style="font-size: 40px; color: #f31212; margin-top: 10px;"></i>
                            `
                        });



                        return;
                    }

                    if (!event.target.checked) {
                        // Crear un nuevo div para la justificación de este módulo
                        const justificacionDiv = document.createElement('div');
                        justificacionDiv.id = `justificacion-${modulo}`;
                        justificacionDiv.className = 'card mb-3';
                        justificacionDiv.innerHTML = `
                            <div class="card-header bg-warning text-dark">
                                Justificación para no habilitar ${modulo}
                            </div>
                            <div class="card-body">
                                <textarea 
                                    id="justificacion-texto-${modulo}" 
                                    rows="4" 
                                    class="form-control" 
                                    placeholder="Escriba la justificación detallada para no habilitar este módulo"
                                    required
                                ></textarea>
                            </div>
                        `;

                        justificacionesContainer.appendChild(justificacionDiv);
                    } else {
                        // Eliminar el div de justificación si se vuelve a seleccionar
                        const justificacionDiv = document.getElementById(`justificacion-${modulo}`);
                        if (justificacionDiv) {
                            justificacionDiv.remove();
                        }
                    }
                });
            });
        },

        preConfirm: () => {
            const checkboxes = document.querySelectorAll('input[name="modulos"]:checked');
            const modulosSeleccionados = Array.from(checkboxes).map(cb => cb.value);

            // Recoger justificaciones para módulos no seleccionados
            const justificaciones = {};
            const modulosNoSeleccionados = modulosSeleccionadosOriginales.filter(m => !modulosSeleccionados.includes(m));

            modulosNoSeleccionados.forEach(modulo => {
                const justificacionTexto = document.getElementById(`justificacion-texto-${modulo}`);
                if (!justificacionTexto || !justificacionTexto.value.trim()) {
                    Swal.showValidationMessage(`Debe proporcionar una justificación para el módulo ${modulo}`);
                    return false;
                }
                justificaciones[modulo] = justificacionTexto.value.trim();
            });

            if (modulosSeleccionados.length === 0) {
                Swal.showValidationMessage('Debe seleccionar al menos un módulo');
                return false;
            }

            return {
                modulosSeleccionados,
                justificaciones
            };
        }
    });

    if (formValues) {
        try {
            const formData = new FormData();
            formData.append('solicitud_id', solicitud_id);

            // Limpiar y formatear los módulos seleccionados
            const modulosLimpios = formValues.modulosSeleccionados.map(m => m.trim());
            formData.append('modulos_seleccionados', modulosLimpios.join(','));

            // Concatenar justificaciones
            const justificacionesConcatenadas = Object.entries(formValues.justificaciones)
                .map(([modulo, justificacion]) => `${modulo}: ${justificacion}`)
                .join(' | ');
            formData.append('justificacion', justificacionesConcatenadas);

            const url = "/AccessEntry-Autocom/API/nuevas/justificar";
            const config = {
                method: 'POST',
                body: formData
            };

            const respuesta = await fetch(url, config);
            const data = await respuesta.json();

            if (data.codigo === 1) {
                // Set localStorage to remember justification state
                localStorage.setItem(`justificacion_${solicitud_id}`, 'true');

                Toast.fire({
                    icon: 'success',
                    title: data.mensaje
                });

                await buscar(); // Actualiza la tabla
            } else {
                throw new Error(data.detalle);
            }
        } catch (error) {
            console.error('Error en justificar:', error);
            Toast.fire({
                icon: 'error',
                title: 'Error al justificar los módulos'
            });
        }
    }
};

const verificar = async (e) => {
    try {
        const row = datatable.row(e.target.closest('tr')).data();
        const solicitud_id = row.solicitud_id;
        const tieneUsuario = row.sol_cred_usuario; // Valor de sol_cred_usuario (SI o NO)

        // Verifica el estado inicial según el valor de 'sol_cred_usuario'
        let nuevoEstado = 2; // Por defecto, el estado es 2
        let mensajeConfirmacion = ''; // Mensaje a mostrar en la confirmación

        if (tieneUsuario === 'SI') {
            nuevoEstado = 7; // Si ya tiene usuario, el estado será 3
            mensajeConfirmacion = 'El usuario de esta solicitud ya cuenta con credenciales para el Autocom, por lo que será enviada para el cambio de Permisos a Nivel Base de Datos. ¿Desea Continuar?';
        } else {
            nuevoEstado = 2; // Si no tiene usuario, el estado será 2
            mensajeConfirmacion = 'Esta Solicitud será enviada a la Compañía de Sistemas para la Generación de Usuario y Contraseña. ¿Está seguro de que desea enviar esta solicitud?';
        }

        const confirmacion = await Swal.fire({
            title: '<strong>Por favor, revise que los datos sean correctos.</strong>',
            text: mensajeConfirmacion,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#206617',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Enviar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        const formData = new FormData();
        formData.append('solicitud_id', solicitud_id);
        formData.append('nuevo_estado', nuevoEstado);

        const url = "/AccessEntry-Autocom/API/nuevas/verificar";
        const config = {
            method: 'POST',
            body: formData
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data.codigo === 1) {
            Toast.fire({
                icon: 'success',
                title: data.mensaje
            });

            // Remove localStorage item when verified
            localStorage.removeItem(`justificacion_${solicitud_id}`);

            await buscar(); // Actualiza la tabla con la nueva información
        } else {
            throw new Error(data.detalle);
        }
    } catch (error) {
        console.error('Error en verificar:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al verificar la solicitud'
        });
    }
};

const rechazar = async (e) => {
    try {
        const row = datatable.row(e.target.closest('tr')).data();
        const solicitud_id = row.solicitud_id;

        const confirmacion = await Swal.fire({
            title: 'Rechazo de Solicitud',
            text: "¿Está seguro que desea rechazar esta solicitud?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#525252',
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        const formData = new FormData();
        formData.append('solicitud_id', solicitud_id);

        const url = "/AccessEntry-Autocom/API/nuevas/rechazar";
        const config = {
            method: 'POST',
            body: formData
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data.codigo === 1) {
            Toast.fire({
                icon: 'success',
                title: data.mensaje
            });

            // Remove localStorage item when rejected
            localStorage.removeItem(`justificacion_${solicitud_id}`);

            await buscar(); // Actualiza la tabla
        } else {
            throw new Error(data.detalle);
        }
    } catch (error) {
        console.error('Error en rechazar:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al rechazar la solicitud'
        });
    }
};



datatable.on('click', '.justificar', mostrarJustificacion);
datatable.on('click', '.verificar', verificar);
datatable.on('click', '.rechazar', rechazar);