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
}