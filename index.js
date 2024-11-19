const express = require('express')
const cors = require("cors")
const dotenv = require('dotenv')
const app = express()

//Primero carga la configuracion del .env para las demas llamadas
dotenv.config()

//Se requiere para entender los datos recibidos en JSON
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Se requiere si se accede desde un navegador web
var corsOptions = {
    origin: ["http://localhost:8080", "http://localhost:8080"],
    methods: "GET,PUT,POST,DELETE"
}
app.use(cors(corsOptions))


//swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//bitacora
app.use(require("./middlewares/bitacora.middleware"))

//rutas
app.use("/api/categorias", require('./routes/categorias.routes'))
app.use("/api/productos", require('./routes/productos.routes'))
app.use("/api/usuarios", require('./routes/usuarios.routes'))
app.use("/api/roles", require('./routes/roles.routes'))
app.use("/api/auth", require('./routes/auth.routes'))
app.use("/api/archivos", require('./routes/archivos.routes'))
app.use("/api/bitacora", require('./routes/bitacora.routes'))

//cualquier otra ruta que no exista
app.get("*", (req, res) => {
    res.status(404).send("Recurso no encontrado");
})

//midddleware para el manejo de errores (el ultimo middleware a utilizar)
const errorhandler = require("./middlewares/errorhandler.middleware")
app.use(errorhandler)

//Inicia el servidor en el puerto indicado en el archivo .env: SERVER_PORT
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.SERVER_PORT}`);
})