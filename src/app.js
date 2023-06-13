const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configurar la carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

// Configurar el servidor de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el servidor de WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Escuchar eventos desde el cliente
    socket.on('nuevoProducto', (producto) => {
        // Aquí puedes procesar la creación de un nuevo producto
        // y emitir un evento para actualizar la lista en la vista
        io.emit('productoCreado', producto);
    });

    socket.on('eliminarProducto', (productoId) => {
        // Aquí puedes procesar la eliminación de un producto
        // y emitir un evento para actualizar la lista en la vista
        io.emit('productoEliminado', productoId);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Configurar las rutas
app.get('/', (req, res) => {
    // Renderizar la vista home.handlebars con la lista de productos
    res.render('home', { productos: obtenerProductos() });
});

app.get('/realtimeproducts', (req, res) => {
    // Renderizar la vista realTimeProducts.handlebars con la lista de productos
    res.render('realTimeProducts', { productos: obtenerProductos() });
});

// Iniciar el servidor HTTP
http.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
