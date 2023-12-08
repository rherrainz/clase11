const socketClient = io();

const nombreUsuario = document.getElementById('nombreUsuario');
const formulario = document.getElementById('formulario');
const chatParrafo = document.getElementById('chatParrafo');
const inputMensaje = document.getElementById('mensaje');

let usuario = null;


if(!usuario){
    Swal.fire({
        title: "Bienvenido",
        text: "Ingresa tu usuario",
        input: "text",
        inputValidator: (value) => {
            if (!value) {
                return "Debes ingresar un usuario";
            }
        }
    })
    .then(userName => {
        usuario = userName.value;
        nombreUsuario.innerText=usuario;
        socketClient.emit('nuevoUsuario',usuario);
    })
};

formulario.onsubmit = (e) => {
    e.preventDefault();
    const info = {
        nombre: usuario,
        mensaje: inputMensaje.value
    }
    socketClient.emit('mensaje',info);
    inputMensaje.value = '';
}

socketClient.on('chat', mensajes => {
    const htmlRender = mensajes.map((elem) => {
      return `<p><strong>${elem.nombre}: </strong>${elem.mensaje}</p>`
    }).join(' ');
    chatParrafo.innerHTML = htmlRender;
});

socketClient.on('broadcast', usuario => {
    Toastify({
        text: `${usuario} se ha conectado`,
        duration: 5000,
        position: 'right',
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c93d)'
        }
    }).showToast();
});