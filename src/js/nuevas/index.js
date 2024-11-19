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
            data: 'sol_cred_modulo'
        },
        {
            title: 'Justificacion',
            data: 'sol_cred_justificacion'
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
        html: `
            <div>
                <h3>Porfavor elija los módulos que autoriza habilitar al Usuario:</h3>
                ${modulosSeleccionadosOriginales.map(modulo => `
                    <div>
                        <input type="checkbox" id="${modulo}" name="modulos" value="${modulo}" checked>
                        <label for="${modulo}">${modulo}</label>
                    </div>
                `).join('')}
            </div>
            <div id="justificacionContainer" style="display:none;">
                <h3>¿Porqué no autoriza habilitar estos modulos?</h3>
                <textarea id="justificacionTexto" rows="4" class="swal2-input" 
                          placeholder="Justifique el Motivo"></textarea>
            </div>
        `,
        focusConfirm: false,
        didRender: () => {
            const checkboxes = document.querySelectorAll('input[name="modulos"]');
            const justificacionContainer = document.getElementById('justificacionContainer');

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const todosSeleccionados = Array.from(checkboxes).every(cb => cb.checked);
                    justificacionContainer.style.display = todosSeleccionados ? 'none' : 'block';
                });
            });
        },

        preConfirm: () => {
            const checkboxes = document.querySelectorAll('input[name="modulos"]:checked');
            const modulosSeleccionados = Array.from(checkboxes).map(cb => cb.value);
            const justificacion = document.getElementById('justificacionTexto').value;

            if (modulosSeleccionados.length === 0) {
                Swal.showValidationMessage('Debe seleccionar al menos un módulo');
                return false;
            }

            if (modulosSeleccionados.length < modulosSeleccionadosOriginales.length && !justificacion.trim()) {
                Swal.showValidationMessage('Debe proporcionar una justificación para los módulos no seleccionados');
                return false;
            }

            return {
                modulosSeleccionados,
                justificacion
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

            formData.append('justificacion', formValues.justificacion);

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
            title: '¿Está seguro?',
            text: "¿Desea rechazar esta solicitud?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
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