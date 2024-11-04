<h1 class="text-center">Formulario de Solicitud de Usuario</h1>
<div class="row justify-content-center mb-4">
    <form id="formularioSolicitud" class="border shadow p-4 col-lg-10">
        <input type="hidden" name="solicitud_id" id="solicitud_id">
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="sol_cred_catalogo" class="form-label">Catalogo</label>
                <input type="number" name="sol_cred_catalogo" id="sol_cred_catalogo" class="form-control">
            </div>
            <div class="col-md-6">
                <label for="sol_cred_correo" class="form-label">Correo Electronico</label>
                <input type="text" name="sol_cred_correo" id="sol_cred_correo" class="form-control">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="sol_cred_telefono" class="form-label">Telefono</label>
                <input type="text" name="sol_cred_telefono" id="sol_cred_telefono" class="form-control">
            </div>
            <div class="col-md-6">
                <label for="sol_cred_fecha_solicitud" class="form-label">Fecha de Solicitud</label>
                <input type="date" name="sol_cred_fecha_solicitud" id="sol_cred_fecha_solicitud" class="form-control">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="sol_cred_modulo" class="form-label">Modulos a Habilitar</label>
                <input type="text" name="sol_cred_modulo" id="sol_cred_modulo" class="form-control">
            </div>
            <div class="col-md-6">
                <label for="sol_cred_justificacion" class="form-label">Justificacion</label>
                <input type="text" name="sol_cred_justificacion" id="sol_cred_justificacion" class="form-control">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col"></div>
            <div class="col">
                <label class="form-label" for="sol_cred_usuario">¿Cuenta con Usuario de AUTOCOM?</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="sol_cred_usuario" id="sol_cred_usuario_si" value="SI" required>
                    <label class="form-check-label" for="sol_cred_usuario_si">Sí</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="sol_cred_usuario" id="sol_cred_usuario_no" value="NO" required>
                    <label class="form-check-label" for="sol_cred_usuario_no">No</label>
                </div>

            </div>
            <div class="col"></div>
        </div>
        <div class="row text-center">
            <div class="col">
                <button type="submit" form="formularioSolicitud" id="btnGuardar" class="btn btn-success w-100">Generar Solicitud</button>
            </div>
            <div class="col">
                <button type="button" id="btnModificar" class="btn btn-warning w-100">Modificar</button>
            </div>
            <div class="col">
                <button type="button" id="btnCancelar" class="btn btn-danger w-100">Cancelar</button>
            </div>
        </div>
    </form>
</div>
<h2 class="text-center mb-4">Verificacion de Solicitudes</h2>
<div class="row">
    <div class="col table-responsive">
        <table class="table table-bordered table-hover w-100" id="tablaSolicitudes">
        </table>
    </div>
</div>
<script src="<?= asset('./build/js/solicitud/index.js') ?>"></script>