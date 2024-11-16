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
            data: 'estado_solicitud'
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                let html = `
                <button class='btn btn-danger eliminar' data-solicitud_id="${data}"><i class="bi bi-trash3-fill"></i></i></button>
                `
                
                return html;
            }
        },
    ]
});