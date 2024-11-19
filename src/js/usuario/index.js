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
            data: 'sol_cred_modulos_autorizados'
        },
        {
            title: 'Permisos Solicitados',
            data: 'sol_cred_justificacion'
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

    // Primer paso: Confirmar si los permisos a nivel base de datos han sido concedidos
    const { value: permisosConcedidos } = await Swal.fire({
        title: '¿Ha concedido los permisos a nivel base de datos?',
        text: 'Por favor, asegúrese de haber otorgado los permisos necesarios antes de continuar.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, ya se concedieron',
        cancelButtonText: 'No, aún no'
    });

    // Si el usuario no confirma los permisos, se detiene el flujo
    if (!permisosConcedidos) {
        Swal.fire({
            title: 'Acción cancelada',
            text: 'Debe conceder los permisos antes de continuar.',
            icon: 'info'
        });
        return; // No continuar si no se concedieron los permisos
    }

    // Segundo paso: Si los permisos fueron concedidos, mostrar el formulario para ingresar la contraseña
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
            // Hacer una solicitud POST al backend para actualizar la contraseña
            const url = '/AccessEntry-Autocom/API/solicitud/actualizarPassword'; // URL de la API
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    solicitud_id: datos.solicitud_id,  // Usamos el ID de la solicitud
                    password: formData.password  // La contraseña que ingresó el usuario
                })
            };

            const respuesta = await fetch(url, config);
            const data = await respuesta.json();

            if (data.codigo === 1) {
                // Los datos se guardaron correctamente en la base de datos
                // Guardamos el estado en localStorage para persistencia
                localStorage.setItem(`datosGuardados_${datos.solicitud_id}`, true);
                datatable.row(fila).invalidate().draw();

                // Mostrar mensaje de éxito
                Swal.fire({
                    title: 'Contraseña Generada',
                    text: 'La contraseña ha sido guardada correctamente.',
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

const enviar = async (e) => {
    try {
        const row = datatable.row(e.target.closest('tr')).data();
        const solicitud_id = row.solicitud_id;

        const confirmacion = await Swal.fire({
            title: '<strong>Por favor, revise que los datos sean correctos.</u></strong>',
            text: "Esta Solicitud será enviada a la Compañia de Atención al Usuario con los Permisos y contraseñas creadas ",
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

        const url = "/AccessEntry-Autocom/API/usuario/enviar";
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
datatable.on('click', '.enviar', enviar);

// Asegurarnos de cargar los datos y mostrar el estado correcto después de recargar la página
buscar();
