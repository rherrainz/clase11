import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//hbs
app.engine('handlebars',handlebars.engine());
app.set('view engine','handlebars');
app.set('views', __dirname + '/views');

//ruta raiz
app.get('/', (req, res) => {
    res.render('socket');
});

const mensajes = [];

//socket
const httpServer = app.listen(3000, () => {
    console.log('Server up en puerto 3000');
});
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });

    socket.on('mensaje', (info) => {
        mensajes.push(info);
        socketServer.emit('chat', mensajes);
    }) 

    socket.on('nuevoUsuario', (usuario) => {
        socket.broadcast.emit('broadcast', usuario);
    });

});


