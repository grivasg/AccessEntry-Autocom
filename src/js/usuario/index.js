import CryptoJS from "crypto-js";
import { Dropdown } from "bootstrap";
import { ocultarLoader, Toast, validarFormulario, mostrarLoader } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaUsuario', {
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
            title: 'Datos del Solicitante',
            data: 'nombres_solicitante'
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
            title: 'Modulos Autorizados para Habilitación',
            data: 'sol_cred_modulos_autorizados'
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return ` 
                    <button class='btn btn-dark ingresar' title='INGRESAR'>
                        <i class="bi bi-pencil-square"></i>
                    </button>`;
            }
        }
    ]
});

ocultarLoader();

// Función para buscar los datos
const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/usuario/buscar";
        const config = { method: 'GET' };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data && data.datos) {
            datatable.clear();
            datatable.rows.add(data.datos).draw();
        }
    } catch (error) {
        Toast.fire({
            icon: 'info',
            title: 'No se encontraron Datos en esta pagina'
        });
    }
};

// Función para ingresar datos en el formulario
const ingresar = async (e) => {
    e.preventDefault();

    const fila = e.target.closest('tr');
    const datos = datatable.row(fila).data();
    const sol_cred_catalogo = datos.sol_cred_catalogo;

    // Parsear los módulos autorizados
    const modulosAutorizados = datos.sol_cred_modulos_autorizados
        ? datos.sol_cred_modulos_autorizados.split(',').map(m => m.trim())
        : [];

    // Añadimos el checkbox para "Creación de Usuario en CLI"
    const modulosConCreacionCLI = ["Creación de Usuario en CLI.", ...modulosAutorizados];

    // Paso único: Confirmación de Permisos con Selección de Módulos
    const { value: permisosConcedidos, isConfirmed } = await Swal.fire({
        title: 'Creación de Usuarios y Permisos a Nivel Base de Datos.',
        html: ` 
            <div class="alert alert-success mb-4" role="alert">
                <strong>Instrucciones:</strong> Por favor, seleccione las tareas 
                que se han completado en la Compañía de Sistemas, con el fin de reflejar
                la <strong>Creación de Usuario</strong> y la <strong>Asignación de Permisos</strong>
                a nivel de Base de Datos para el Catálogo <strong>${sol_cred_catalogo}.</strong>
            </div>
            <p class="text-start mb-3">Por favor, marque las tareas ya Completadas:</p>
            <div class="text-center" style="display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 10px;">
                ${modulosConCreacionCLI.map((modulo, index) => `
                    <div class="form-check">
                        <input 
                            class="form-check-input modulo-checkbox" 
                            type="checkbox" 
                            id="modulo-${index}" 
                            value="${modulo}"
                        >
                        <label class="form-check-label" for="modulo-${index}">
                            ${modulo}
                        </label>
                    </div>
                `).join('')}
            </div>
        `,
        icon: 'question',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        didRender: () => {
            const confirmButton = Swal.getConfirmButton();
            confirmButton.style.display = 'none';

            const modal = Swal.getPopup();
            modal.style.width = '800px';

            const checkboxes = document.querySelectorAll('.modulo-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
                    if (checkedBoxes.length === modulosConCreacionCLI.length) {
                        const confirmButton = Swal.getConfirmButton();
                        confirmButton.style.display = 'block';
                        confirmButton.textContent = 'Finalizar Tareas';
                    } else {
                        const confirmButton = Swal.getConfirmButton();
                        confirmButton.style.display = 'none';
                    }
                });
            });
        },
        preConfirm: () => {
            const checkboxes = document.querySelectorAll('.modulo-checkbox');
            const seleccionados = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            return seleccionados.length === modulosConCreacionCLI.length
                ? seleccionados
                : false;
        }
    });

    // Si el usuario no confirma la selección de módulos, cancelamos
    if (!isConfirmed) {
        return;
    }

    // Segundo paso: Mostrar formulario para ingresar contraseña
    const { value: formData } = await Swal.fire({
        title: 'Ingrese los credenciales del Usuario Creado',
        html: ` 
            <form id="formularioSolicitud">
                <div class="mb-3">
                    <label for="password" class="form-label">Ingrese Contraseña</label>
                    <input type="text" id="password" class="form-control" placeholder="Escriba la Contraseña..." required>
                </div>
            </form>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const password = document.getElementById('password').value;
            if (!password) {
                Swal.showValidationMessage('Por favor, complete el campo de la contraseña');
                return false;
            }
            return { password };
        }
    });

    // Si el usuario ingresó la contraseña, proceder con la actualización
    if (formData) {
        try {
            // Generamos una clave de encriptación aleatoria
            const secretKey = CryptoJS.lib.WordArray.random(32).toString();
            const token = CryptoJS.lib.WordArray.random(32).toString();
            const encryptedPassword = CryptoJS.AES.encrypt(formData.password, secretKey).toString();

            console.log('Sending data:', {
                solicitud_id: datos.solicitud_id,
                password_encriptada: encryptedPassword,
                pass_token: token,
                encryption_key: secretKey,
                pass_fecha_creacion: new Date().toISOString().split('T')[0]
            });

            const url = '/AccessEntry-Autocom/API/passwords/guardarTemp';
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    solicitud_id: datos.solicitud_id,
                    password_encriptada: encryptedPassword,
                    pass_token: token,
                    encryption_key: secretKey,
                    pass_fecha_creacion: new Date().toISOString().split('T')[0]
                })
            };

            const respuesta = await fetch(url, config);
            const responseText = await respuesta.text();
            console.log('Raw response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON response:', e);
                throw new Error('Invalid JSON response from server');
            }

            console.log('Parsed response:', data);

            if (data.codigo === 1) {
                // Mostrar alerta de éxito de usuario creado
                await Swal.fire({
                    title: 'Usuario Creado y Permisos Concedidos.',
                    text: 'Las Credenciales del Usuario han sido Registradas Correctamente, por lo que esta solicitud será enviada a la Compañia de Atención al Usuario.',
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    width: '700px',
                });

                // Luego enviamos la solicitud
                await enviarSolicitud(fila);
            } else {
                throw new Error(data.mensaje || 'Error desconocido en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error completo:', error);
            await Swal.fire({
                title: 'Error',
                text: `Error al guardar los datos: ${error.message}`,
                icon: 'error'
            });
        }
    }
};

// Función separada para enviar la solicitud
const enviarSolicitud = async (fila) => {
    try {
        const row = datatable.row(fila).data();
        const solicitud_id = row.solicitud_id;

        const formData = new FormData();
        formData.append('solicitud_id', solicitud_id);

        const url = "/AccessEntry-Autocom/API/usuario/enviar";
        const config = {
            method: 'POST',
            body: formData
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data.codigo === 1) {
            // Mostrar toast de éxito y actualizar tabla
            Toast.fire({
                icon: 'success',
                title: data.mensaje
            });
            await buscar(); // Actualiza la tabla
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

// Delegar eventos para los botones dinámicos
datatable.on('click', '.ingresar', ingresar);
datatable.on('click', '.enviar', enviarSolicitud);

// Asegurarnos de cargar los datos y mostrar el estado correcto después de recargar la página
buscar();
