import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const formulario = document.getElementById('formularioSolicitud');
const tabla = document.getElementById('tablaSolicitudes');
const btnGuardar = document.getElementById('btnGuardar');
const btnModificar = document.getElementById('btnModificar');
const btnCancelar = document.getElementById('btnCancelar');

const datatable = new DataTable('#tablaSolicitudes', {
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
            title: 'Catalogo',
            data: 'sol_cred_catalogo'
        },
        {
            title: 'Puesto',
            data: 'puesto_dependencia'
        },
        {
            title: 'Correo',
            data: 'sol_cred_correo'
        },
        {
            title: 'Telefono',
            data: 'sol_cred_telefono'
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
            title: '¿Cuénta con Usuario y contraseña para AUTOCOM?',
            data: 'sol_cred_usuario'
        },
        {
            title: 'Estado de Solicitud',
            data: 'estado_solicitud',
            render: (data, type, row, meta) => {
                return `
                    <span>${data}</span>
                    <button class="btn btn-success verificar" data-solicitud_id="${row.solicitud_id}">Verificar
                    </button>
                `;
            }
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                let html = `
                <button class='btn btn-warning modificar' 
                data-solicitud_id="${data}" 
                data-sol_cred_catalogo="${row.sol_cred_catalogo}" 
                data-sol_cred_correo="${row.sol_cred_correo}"  
                data-sol_cred_telefono="${row.sol_cred_telefono}" 
                data-sol_cred_fecha_solicitud="${row.sol_cred_fecha_solicitud}" 
                data-sol_cred_modulo="${row.sol_cred_modulo}" 
                data-sol_cred_justificacion="${row.sol_cred_justificacion}" 
                data-sol_cred_usuario="${row.sol_cred_usuario}" 
                data-sol_cred_estado_solicitud="${row.sol_cred_estado_solicitud}"><i class='bi bi-pencil-square'></i></button>
                
                <button class='btn btn-danger eliminar' data-solicitud_id="${data}"><i class="bi bi-trash3-fill"></i></i></button>
                `
                return html;
            }
        },
    ]
});
btnModificar.parentElement.style.display = 'none'
btnModificar.disabled = true
btnCancelar.parentElement.style.display = 'none'
btnCancelar.disabled = true

const guardar = async (e) => {
    e.preventDefault()

    if (!validarFormulario(formulario, ['solicitud_id'])) {
        Swal.fire({
            title: "Campos vacios",
            text: "Debe llenar todos los campos",
            icon: "info"
        })
        return
    }

    try {
        const body = new FormData(formulario)
        const url = "/AccessEntry-Autocom/API/solicitud/guardar"
        const config = {
            method: 'POST',
            body
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle } = data;
        let icon = 'info'
        if (codigo == 1) {
            icon = 'success'
            formulario.reset();
            buscar();
        } else {
            icon = 'error'
            console.log(detalle);
        }

        Toast.fire({
            icon: icon,
            title: mensaje
        });

    } catch (error) {
        console.log(error);
    }
}

const traerDatos = (e) => {
    const elemento = e.currentTarget.dataset;

    formulario.solicitud_id.value = elemento.solicitud_id;
    formulario.sol_cred_catalogo.value = elemento.sol_cred_catalogo;
    formulario.sol_cred_correo.value = elemento.sol_cred_correo;
    formulario.sol_cred_telefono.value = elemento.sol_cred_telefono;
    formulario.sol_cred_fecha_solicitud.value = elemento.sol_cred_fecha_solicitud;
    formulario.sol_cred_modulo.value = elemento.sol_cred_modulo;
    formulario.sol_cred_justificacion.value = elemento.sol_cred_justificacion;
    formulario.sol_cred_usuario.value = elemento.sol_cred_usuario;
    tabla.parentElement.parentElement.style.display = 'none';
    btnGuardar.parentElement.style.display = 'none';
    btnGuardar.disabled = true;
    btnModificar.parentElement.style.display = '';
    btnModificar.disabled = false;
    btnCancelar.parentElement.style.display = '';
    btnCancelar.disabled = false;
}

const cancelar = () => {
    tabla.parentElement.parentElement.style.display = ''
    formulario.reset();
    btnGuardar.parentElement.style.display = ''
    btnGuardar.disabled = false
    btnModificar.parentElement.style.display = 'none'
    btnModificar.disabled = true
    btnCancelar.parentElement.style.display = 'none'
    btnCancelar.disabled = true
}

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/solicitud/buscar"
        const config = {
            method: 'GET',
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle, datos } = data;

        console.log(datos);
        datatable.clear().draw();

        if (datos) {
            datatable.rows.add(datos).draw();
        }
    } catch (error) {
        console.log(error);
    }
}
buscar();


const modificar = async (e) => {
    e.preventDefault();

    if (!validarFormulario(formulario)) {
        Swal.fire({
            title: "Campos vacíos",
            text: "Debe llenar todos los campos",
            icon: "info"
        });
        return;
    }


    try {
        const body = new FormData(formulario);
        const url = "/AccessEntry-Autocom/API/solicitud/modificar";
        const config = {
            method: 'POST',
            body
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle } = data;
        console.log('Respuesta de la API:', data);
        let icon = 'info';
        if (codigo == 1) {
            icon = 'success';
            formulario.reset();
            buscar();
            cancelar();
        } else {
            icon = 'error';
            console.log(detalle);
        }

        Toast.fire({
            icon: icon,
            title: mensaje
        });

    } catch (error) {
        console.log(error);
    }
}

const eliminar = async (e) => {
    const solicitud_id = e.currentTarget.dataset.solicitud_id
    let confirmacion = await Swal.fire({
        icon: 'question',
        title: 'Confirmacion',
        text: '¿Está seguro que desea eliminar esta Solicitud?',
        showCancelButton: true,
        confirmButtonText: 'Si, Seguro',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#999902',
        // input: 'text'
    })
    if (confirmacion.isConfirmed) {
        try {
            const body = new FormData()
            body.append('solicitud_id', solicitud_id)
            const url = "/AccessEntry-Autocom/API/solicitud/eliminar"
            const config = {
                method: 'POST',
                body
            }
            const respuesta = await fetch(url, config);
            const data = await respuesta.json();
            const { codigo, mensaje, detalle } = data;
            let icon = 'info'
            if (codigo == 1) {
                icon = 'success'
                formulario.reset();
                buscar();
            } else {
                icon = 'error'
                console.log(detalle);
            }

            Toast.fire({
                icon: icon,
                title: mensaje
            })
        } catch (error) {
            console.log(error);
        }
    }
};

const verificar = async (e) => {
    let confirmacion = await Swal.fire({
        icon: 'question',
        title: 'Confirmacion',
        text: 'Esta accion es Irreversible, ¿Desea Enviar la Solicitud?',
        showCancelButton: true,
        confirmButtonText: 'Si, Enviar',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#018f1b',
        cancelButtonColor: '#cc0606',
        // input: 'text'
    })
    if (confirmacion.isConfirmed) {
        try {
            alert("¡Datos Enviados!");
            const body = new FormData(formulario);
            const url = "/AccessEntry-Autocom/API/solicitud/verificar";
            const config = {
                method: 'POST',
                body
            };

            const respuesta = await fetch(url, config);
            const data = await respuesta.json();
            const { codigo, mensaje, detalle } = data;
            console.log('Respuesta de la API:', data);
            let icon = 'info';
            if (codigo == 1) {
                icon = 'success';
                formulario.reset();
                buscar();
                cancelar();
            } else {
                icon = 'error';
                console.log(detalle);
            }

            Toast.fire({
                icon: icon,
                title: mensaje
            });

        } catch (error) {
            console.log(error);
        }
    }
};




formulario.addEventListener('submit', guardar)
btnCancelar.addEventListener('click', cancelar)
btnModificar.addEventListener('click', modificar)
datatable.on('click', '.modificar', traerDatos);
datatable.on('click', '.eliminar', eliminar)
datatable.on('click', '.verificar', verificar)