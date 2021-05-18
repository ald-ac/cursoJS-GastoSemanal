//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPrespuesto);
}

formulario.addEventListener('submit', agregarGasto);

//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirMensaje(mensaje, tipoMensaje) {
        //Creando elemento DIV
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipoMensaje === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje
        divMensaje.textContent = mensaje;

        //Agregando a html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitando mensaje 
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML();

        //Iterando gastos
        gastos.forEach(gasto => {

            const { cantidad, nombre, id } = gasto;

            //Creando html
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id); Version antigua
            nuevoGasto.dataset.id = id;

            //Agregando html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            //Boton de borrado gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger', 'borrar-gasto');
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            btnBorrar.innerHTML = 'Borrar &times';
            
            nuevoGasto.appendChild(btnBorrar);

            //Agregarlo a html

            gastoListado.appendChild(nuevoGasto);
        });
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    limpiarHTML() {
        //Limpiar child
        while(gastoListado.firstChild) {
            gastoListado.firstChild.remove();
        }
    }
    
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //Verificando que restante sea 25% o menos
        if(restante <= presupuesto*.25) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if (restante <= presupuesto*.5) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else { //Al eliminar gasto regresar a color verde
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el restante es 0 o menor
        if(restante <= 0) {
            ui.imprimirMensaje('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//Instanciando
const ui = new UI();

let presupuesto;

//Funciones
function preguntarPrespuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <=0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

//Insertara los gastos
function agregarGasto(e) {
    e.preventDefault();

    //Leer info
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validando
    if(nombre === '' || cantidad === '') {
        ui.imprimirMensaje('Ambos campos son obligatorios', 'error');

        return; //Evitar que se ejecute el demas codigo
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirMensaje('Cantidad no valida', 'error');

        return;
    }

    //Objeto gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    //Agregando un gasto al presupuesto
    presupuesto.nuevoGasto(gasto);

    //Notificando agregado correcto y formulario en blanco
    ui.imprimirMensaje('Gasto agregado correctamente');
    formulario.reset();

    //Imprimir gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}

function eliminarGasto(id) {
    //Actualizando gastos quitando el eliminado
    presupuesto.eliminarGasto(id);

    //Refrescando HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}