<div class="container py-3">
  <!-- Título principal -->
  <div class="row mb-4 text-center">
    <div class="col">
      <h1 class="display-4 text-white">Sistema de Gestión de Credenciales</h1>
      <p class="lead text-light">Administra de manera fácil y rápida las credenciales para el acceso.</p>
    </div>
  </div>

  <!-- Imagen -->
  <div class="row justify-content-center mb-4">
    <div class="col-lg-6 col-md-8">
      <img src="./images/autocom.png" class="img-fluid shadow-lg rounded" alt="Imagen de Sistema" />
    </div>
  </div>

  <!-- Botón para solicitar credenciales -->
  <div class="row justify-content-center">
    <div class="col-auto">
      <a href="/AccessEntry-Autocom/solicitud">
        <button type="button" class="btn btn-custom btn-lg px-5 py-3 shadow-lg">
          Solicitar Credenciales
        </button>
      </a>
    </div>
  </div>
</div>

<style>
  /* Estilo general */
  body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(145deg, #6e7c6e, #4f5b45);
    /* Fondo degradado */
    color: #fff;
    margin: 0;
    padding: 0;
  }

  /* Títulos */
  h1 {
    font-weight: 700;
    color: #ffffff;
    font-size: 3rem;
    /* Ajuste de tamaño para mayor legibilidad */
    text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
  }

  p.lead {
    font-size: 1.25rem;
    color: #d1d1d1;
    margin-top: 10px;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  }

  /* Contenedor principal */
  .container {
    padding-top: 50px;
    /* Se ajusta para eliminar el espacio superior */
    background-color: rgba(0, 0, 0, 0.7);
    /* Fondo oscuro con opacidad */
    border-radius: 20px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  }

  /* Botones */
  .btn-custom {
    background-color: #2c6e49;
    /* Verde oscuro */
    border: none;
    color: white;
    font-size: 1.25rem;
    padding: 12px 40px;
    border-radius: 50px;
    transition: all 0.3s ease;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  }

  .btn-custom:hover {
    background-color: #1f4d36;
    /* Verde más oscuro */
    transform: scale(1.1);
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.4);
  }


  /* Imágenes */
  .img-fluid {
    border-radius: 12px;
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);
  }
</style>

<script src="build/js/inicio.js"></script>