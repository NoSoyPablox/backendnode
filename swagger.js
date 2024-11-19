const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: "Backend Node.js API",
        description: "Esta en una API en node.js para un projecto tipo mercado libre"
    },
    host: 'localhost:3000'
}

//generacion de archivo swagger-output.json
const outputFile = './swagger-output.json'
const routes = ['./index.js']

swaggerAutogen(outputFile,routes,doc)