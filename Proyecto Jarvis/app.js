const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

function generarRespuestaInteligente(texto) {
    const textoLimpio = texto.toLowerCase().trim();
    
    const contexto = {
        nombre_usuario: "señor",
        hora: new Date().toLocaleTimeString('es-ES'),
        fecha: new Date().toLocaleDateString('es-ES'),
        dia: new Date().toLocaleDateString('es-ES', { weekday: 'long' })
    };
    
    if (textoLimpio.match(/hola|buenos|saludos|qué tal/)) {
        const saludos = [
            `Buenas, ${contexto.nombre_usuario}. Jarvis a su servicio. ¿En qué puedo asistirle?`,
            `Saludos, ${contexto.nombre_usuario}. Espero encontrarlo bien. ¿Qué necesita?`,
            `Presente, ${contexto.nombre_usuario}. Esperando sus órdenes.`,
            `Buenas, ${contexto.nombre_usuario}. Mis sistemas están completamente operacionales. ¿Cómo puedo ayudarle?`
        ];
        return saludos[Math.floor(Math.random() * saludos.length)];
    }

    if (textoLimpio.match(/hora|qué hora|me dices la hora|decime la hora/)) {
        const respuestas = [
            `Son las ${contexto.hora}, ${contexto.nombre_usuario}.`,
            `La hora actual es ${contexto.hora}.`,
            `Según mis sistemas, son exactamente las ${contexto.hora}.`,
            `Marcando ${contexto.hora} en punto, ${contexto.nombre_usuario}.`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }

    if (textoLimpio.match(/fecha|qué día|qué fecha|hoy es/)) {
        const respuestas = [
            `Hoy es ${contexto.dia}, ${contexto.fecha}, ${contexto.nombre_usuario}.`,
            `La fecha de hoy es ${contexto.fecha}.`,
            `Estamos en ${contexto.fecha}, un hermoso ${contexto.dia}.`,
            `Mis registros indican que es ${contexto.fecha}.`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }

    if (textoLimpio.match(/rojo|cambiar.*rojo|color rojo/)) {
        return "Cambiando a tonos rojos, " + contexto.nombre_usuario + ".";
    }
    
    if (textoLimpio.match(/azul|cambiar.*azul|color azul/)) {
        return "Restaurando paleta azul estándar, " + contexto.nombre_usuario + ".";
    }
    
    if (textoLimpio.match(/verde|cambiar.*verde|color verde/)) {
        return "Activando tonos verdes, " + contexto.nombre_usuario + ".";
    }

    if (textoLimpio.match(/qué puedes|qué haces|tus capacidades|ayuda|qué sabes/)) {
        return `Puedo: darle la hora, la fecha, cambiar colores del interfaz, mantener conversaciones inteligentes y mucho más, ${contexto.nombre_usuario}. Pruebe diciendo "Jarvis, hora" o "Jarvis, cambiar a verde".`;
    }

    if (textoLimpio.match(/quién eres|quién soy|tu nombre|cómo te llamas/)) {
        const respuestas = [
            `Soy Jarvis, el asistente de inteligencia artificial avanzada. Un placer, ${contexto.nombre_usuario}.`,
            `Mi nombre es Jarvis. Sistema de asistencia inteligente a su disposición.`,
            `Jarvis, ${contexto.nombre_usuario}. Creado para servirle con eficiencia.`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }

    if (textoLimpio.match(/gracias|muchas gracias|agradezco/)) {
        const respuestas = [
            `De nada, ${contexto.nombre_usuario}. Estoy para servir.`,
            `Es un honor asistirle, ${contexto.nombre_usuario}.`,
            `Siempre disponible para usted, ${contexto.nombre_usuario}.`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }

    const respuestasGenericas = [
        `Interesante observación, ${contexto.nombre_usuario}. Tomaré nota de ello.`,
        `He anotado: "${texto}". ¿Hay algo más en lo que pueda ayudarle?`,
        `Comprendo, ${contexto.nombre_usuario}. Es una solicitud válida. ¿Desea más detalles?`,
        `${contexto.nombre_usuario}, he registrado su solicitud. ¿Necesita algo adicional?`,
        `Muy bien. He procesado su comando. ¿Qué más puedo hacer por usted?`
    ];
    return respuestasGenericas[Math.floor(Math.random() * respuestasGenericas.length)];
}

app.post('/api/hablar', async (req, res) => {
    const { texto } = req.body;
    if (!texto || texto.trim() === '') {
        return res.status(400).json({ 
            OK: false, 
            voz: "No recibí instrucciones válidas, señor." 
        });
    }

    console.log(`📢 Petición recibida: ${texto}`);

    try {
        const respuesta = generarRespuestaInteligente(texto);
        console.log(`✅ Jarvis dice: ${respuesta}`);

        return res.json({
            OK: true,
            voz: respuesta,
            estilosCSS: null
        });
    } catch (error) {
        console.error("❌ Error:", error.message);
        return res.status(500).json({
            OK: false,
            voz: "Señor, experimenté un error inesperado. Por favor intente nuevamente."
        });
    }
});

app.listen(3000, () => {
    console.log("🤖 [JARVIS - SISTEMA INTELIGENTE] Corriendo en puerto 3000 🤖");
    console.log("✨ Respuestas dinámicas e inteligentes activadas");
});