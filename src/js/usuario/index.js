import { jsPDF } from "jspdf";
import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
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
                const datosGuardados = localStorage.getItem(`datosGuardados_${data}`);
                if (datosGuardados) {
                    return ` 
                        <button class='btn btn-success enviar'>
                            <i class="bi bi-send-fill"></i>
                        </button>`;
                } else {
                    return ` 
                        <button class='btn btn-dark ingresar'>
                            <i class="bi bi-pencil-square"></i>
                        </button>`;
                }
            }
        }
    ]
});

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
            icon: 'error',
            title: 'Error al cargar los datos'
        });
    }
};

// Función para ingresar datos en el formulario
const ingresar = async (e) => {
    e.preventDefault();

    const fila = e.target.closest('tr');
    const datos = datatable.row(fila).data();

    // Mostrar el formulario con dos campos usando HTML personalizado
    const { value: formData } = await Swal.fire({
        title: 'Ingrese los credenciales del Usuario Creado',
        html: ` 
            <form id="formulariousu">
                <div class="mb-3">
                    <label for="usuario" class="form-label">Ingrese Usuario</label>
                    <input type="number" id="usuario" class="form-control" placeholder="Escriba el Usuario...">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Ingrese Contraseña</label>
                    <input type="text" id="password" class="form-control" placeholder="Escriba la Contraseña...">
                </div>
            </form>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const usuario = document.getElementById('usuario').value;
            const password = document.getElementById('password').value;

            if (!usuario || !password) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }

            return { usuario, password };
        }
    });

    if (formData) {
        try {
            // Hacer una solicitud POST al backend para guardar los datos
            const url = '/AccessEntry-Autocom/API/usuario/guardar'; // URL de la API
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usu_id: datos.solicitud_id, // Usar el ID de la solicitud
                    usuario: formData.usuario,
                    password: formData.password
                })
            };

            const respuesta = await fetch(url, config);
            const data = await respuesta.json();

            if (data.codigo === 1) {
                // Los datos se guardaron correctamente en la base de datos
                // Cambiar el botón "Ingresar Datos" a "Enviar"
                datatable.row(fila).invalidate().draw();

                // Mostrar mensaje de éxito
                Swal.fire({
                    title: 'Datos Ingresados',
                    text: 'Los datos se han guardado correctamente.',
                    icon: 'success'
                });
            } else {
                // Hubo un error al guardar los datos
                Swal.fire({
                    title: 'Error',
                    text: data.mensaje,
                    icon: 'error'
                });
            }
        } catch (error) {
            // Manejo de errores en la solicitud
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al guardar los datos.',
                icon: 'error'
            });
        }
    }
};


// Función para enviar los datos (solo muestra un alert en este caso)
const enviar = (e) => {
    e.preventDefault();
    alert('Los datos han sido enviados!');
};

// Delegar eventos para los botones dinámicos
datatable.on('click', '.ingresar', ingresar);
datatable.on('click', '.enviar', enviar);

buscar();
