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
                return `
                    <button class='btn btn-success verificar'><i class="bi bi-clipboard-check"></i> </button>

                    <button class='btn btn-danger rechazar'><i class="bi bi-hand-thumbs-down"></i></button>`;
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
            datatable.rows.add(datos).draw();
        }
    } catch (error) {
        console.log(error);
    }
};
buscar();



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
            mensajeConfirmacion = 'El usuario de esta solicitud ya cuenta con credenciales para el Autocom, por lo que será enviada a la Generación de Permisos de a Nivel Base de Datos. ¿Desea Continuar?';
        } else {
            nuevoEstado = 2; // Si no tiene usuario, el estado será 2
            mensajeConfirmacion = 'Esta Solicitud será enviada a la Compañía de Sistemas para la Generación de Usuario y Contraseña. ¿Está seguro de que desea enviar esta solicitud?';
        }

        // Mostrar una confirmación según el estado
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
        formData.append('nuevo_estado', nuevoEstado); // Enviar el nuevo estado (2 o 3)

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



datatable.on('click', '.verificar', verificar);
datatable.on('click', '.rechazar', rechazar);


