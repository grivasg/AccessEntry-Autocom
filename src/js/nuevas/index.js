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
            title: 'Estado de Solicitud',
            data: 'estado_solicitud',
            render: (data, type, row) => {
                // Aquí decides qué imagen se mostrará dependiendo del valor del estado_solicitud
                let imagen = '';
                let estado = data.toUpperCase();

                // Puedes agregar imágenes condicionales para cada estado
                switch (estado) {
                    case 'SOLICITUD RECIBIDA':
                        imagen = `<img src='/AccessEntry-Autocom/public/images/RECIBIDA1.png' alt='Recibida' style='width: 80px; height: 80px;' />`;
                        break;
                }

                // Retorna el HTML que incluye la imagen y el texto
                return `
                    <div style="display: flex; align-items: center;">
                        ${imagen}
                        <span style="margin-left: 5px;">${data}</span>
                    </div>
                `;
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
        
        const confirmacion = await Swal.fire({
            title:'<strong>Por favor, revise que los datos sean correctos.</u></strong>',
            text: "Esta Solicitud será enviada a la Compañia de Sistemas para la Generación de Usuario y Contraseña ¿Está seguro de que desea enviar esta solicitud? ",
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


