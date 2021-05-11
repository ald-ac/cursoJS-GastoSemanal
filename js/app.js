//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPrespuesto);
}

//Clases


//Funciones
function preguntarPrespuesto() {
    const presupuestUsuario = prompt('¿Cual es tu presupuesto?');
    console.log(presupuestUsuario);

    if(presupuestUsuario === '' || presupuestUsuario === null || isNaN(presupuestUsuario) || presupuestUsuario <=0) {
        window.location.reload();
    }
}