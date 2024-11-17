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
                return `
                    <button class='btn btn-dark ingresar'><i class="bi bi-file-earmark-arrow-up-fill"></i> </button>`;
            }
        }
    ]
});

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/usuario/buscar";
        const config = {
            method: 'GET'
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        console.log('Datos recibidos:', data);

        if (data && data.datos) {
            datatable.clear();
            datatable.rows.add(data.datos).draw();
        }
    } catch (error) {
        console.error('Error en buscar:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar los datos'
        });
    }
};

const ingresar = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto

    // Mostrar el formulario con dos campos usando HTML personalizado
    const { value: formData } = await Swal.fire({
        title: 'Ingrese los credenciales del Usuario Creado',
        html: `
            <form id="FormCredenciales">
                <div class="mb-3">
                    <label for="usuario" class="form-label">Ingrese Usuario</label>
                    <input type="text" id="usuario" class="form-control" placeholder="Escribe algo...">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Ingrese Contraseña</label>
                    <input type="text" id="password" class="form-control" placeholder="Escribe algo más...">
                </div>
            </form>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            // Obtener los valores de los campos del formulario
            const usuario = document.getElementById('usuario').value;
            const password = document.getElementById('password').value;
            
            // Validar que los campos no estén vacíos
            if (!usuario || !password) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false; // No continuar si hay campos vacíos
            }
            
            return { usuario, password }; // Retorna los valores de los campos
        }
    });

    // Si se llenaron los campos correctamente
    if (formData) {
        // Mostrar los datos ingresados
        Swal.fire({
            title: 'Datos Recibidos',
            text: `Usuario: ${formData.usuario}\nContraseña: ${formData.password}`,
            icon: 'success'
        });
    } else {
        // Si el formulario es cancelado o hay errores
        Swal.fire({
            title: 'Operación cancelada',
            text: 'No se enviaron los datos.',
            icon: 'info'
        });
    }
};











buscar();



datatable.on('click', '.ingresar', ingresar);


