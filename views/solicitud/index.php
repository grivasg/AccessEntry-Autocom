<h1 class="text-center">Formulario de Solicitud de Usuario</h1>
<div class="row justify-content-center mb-4">
    <form id="formularioSolicitud" class="border shadow p-4 col-lg-8 col-md-8">

        <input type="hidden" name="solicitud_id" id="solicitud_id">

        <!-- Paso 1: Ingresar catálogo -->
        <div id="step-1" class="form-step">
            <div class="row mb-3">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <label for="sol_cred_catalogo" class="form-label">Ingrese Catalogo</label>
                    <input type="number" name="sol_cred_catalogo" id="sol_cred_catalogo" class="form-control" placeholder="Catalogo del Solicitante">
                </div>
            </div>
            <div class="row text-center">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <button type="button" id="next-step" class="btn btn-dark w-100">Verificar</button>
                </div>
            </div>
        </div>

        <!-- Paso 2: Confirmar datos -->
        <div id="step-2" class="form-step" style="display: none;">
            <div class="row mb-3">
                <div class="col">
                    <label for="nombres_completos" class="form-label">Datos Personales del Solicitante</label>
                    <input type="text" id="nombres_completos" class="form-control" disabled>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label for="puesto" class="form-label">Empleo</label>
                    <input type="text" id="puesto" readonly class="form-control" disabled>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label for="sol_cred_correo" class="form-label">Correo Electrónico</label>
                    <input type="text" name="sol_cred_correo" id="sol_cred_correo" class="form-control" placeholder="ejemplo@gmail.com">
                </div>
                <div class="col">
                    <label for="sol_cred_telefono" class="form-label">Telefono</label>
                    <input type="text" name="sol_cred_telefono" id="sol_cred_telefono" class="form-control" placeholder="ejemplo: 31280000">
                </div>
            </div>
            <div class="row mb-3">
                <div id="modulos-container">
                    <div class="modulo-grupo mb-2">
                        <div class="row">
                            <div class="col-md-5">
                                <label for="modulos[]" class="form-label">Seleccione Módulo</label>
                                <select name="modulos[]" id="modulos[]" class="form-control modulo-select">
                                    <option value="#">Seleccione...</option>
                                    <?php foreach ($modulos as $modulo) : ?>
                                        <option value="<?= $modulo['gma_codigo'] ?>"> <?= $modulo['gma_desc'] ?> </option>
                                    <?php endforeach ?>
                                </select>
                            </div>
                            <div class="col-md-5">
                                <label for="justificaciones[]" class="form-label">Justificación</label>
                                <input type="text"
                                    name="justificaciones[]"
                                    id="justificaciones[]"
                                    class="form-control justificacion-input"
                                    placeholder="Justificación"
                                    maxlength="200">
                            </div>
                            <div class="col-md-2">
                                <button type="button" class="btn btn-danger btn-remove-modulo" style="display: none;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                </div>
                <div class="col">
                    <button type="button" id="agregar-modulo" class="btn btn-primary mt-2">
                        <i class="bi bi-plus-circle"></i> Agregar Modulo
                    </button>
                </div>
                <div class="col">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label for="sol_cred_fecha_solicitud" class="form-label">Fecha de Solicitud</label>
                    <input type="date" name="sol_cred_fecha_solicitud" id="sol_cred_fecha_solicitud" class="form-control" disabled>
                </div>
                <div class="col">
                    <label class="form-label" for="sol_cred_usuario">¿Cuenta con Usuario de AUTOCOM?</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="sol_cred_usuario" id="sol_cred_usuario_si" value="SI">
                        <label class="form-check-label" for="sol_cred_usuario_si">Sí</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="sol_cred_usuario" id="sol_cred_usuario_no" value="NO">
                        <label class="form-check-label" for="sol_cred_usuario_no">No</label>
                    </div>
                </div>
            </div>
            <div class="row text-center">
                <div class="col">
                    <button type="button" id="back-step" class="btn btn-secondary w-100">Atrás</button>
                </div>
                <div class="col">
                    <button type="submit" id="btnGuardar" class="btn btn-success w-100">Generar Solicitud</button>
                </div>
            </div>
        </div>
    </form>
</div>

<script src="<?= asset('./build/js/solicitud/index.js') ?>"></script>