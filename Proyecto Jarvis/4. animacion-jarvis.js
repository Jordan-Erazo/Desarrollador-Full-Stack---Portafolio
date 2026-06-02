// ================================================
// 🧠 JARVIS - ASISTENTE DE VOZ (SIEMPRE ACTIVO)
// ================================================

const boton = document.getElementById('btn-hablar');
const estado = document.getElementById('estado');
let reconocimiento = null;
let corriendo = false;
let autorizado = false;

console.log("✨ JARVIS inicializando...");

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    estado.textContent = "❌ Navegador no soporta micrófono. Usa Chrome o Edge.";
    boton.disabled = true;
}

function iniciar() {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    reconocimiento = new SpeechRecognition();
    reconocimiento.lang = 'es-ES';
    reconocimiento.continuous = true;
    reconocimiento.interimResults = false;

    reconocimiento.onstart = () => {
        corriendo = true;
        estado.textContent = "🎧 Escuchando (di 'Jarvis')...";
        boton.style.boxShadow = "0 0 40px 15px rgba(0,255,255,0.3)";
    };

    reconocimiento.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const texto = event.results[i][0].transcript.toLowerCase().trim();
            console.log("📢 Escuché:", texto);

            if (texto.includes('jarvis')) {
                const comando = texto.replace(/jarvis/i, '').trim();
                console.log("✅ Comando:", comando);
                
                if (comando) {
                    enviar(comando);
                }
            }
        }
    };

    reconocimiento.onerror = (event) => {
        console.error("❌ Error micrófono:", event.error);
        corriendo = false;
    };

    reconocimiento.onend = () => {
        console.log("🔄 Reconocimiento terminó, reiniciando automáticamente...");
        corriendo = false;
        setTimeout(() => {
            if (!corriendo && autorizado) {
                intentarIniciar();
            }
        }, 500);
    };
}

function intentarIniciar() {
    if (reconocimiento && !corriendo && autorizado) {
        try {
            reconocimiento.start();
        } catch (e) {
            console.error("No se pudo iniciar:", e.message);
            setTimeout(() => intentarIniciar(), 1000);
        }
    }
}

boton.addEventListener('click', () => {
    if (!autorizado) {
        autorizado = true;
        estado.textContent = "✅ Micrófono siempre activo - di 'Jarvis'";
        boton.style.boxShadow = "0 0 40px 15px rgba(0,255,255,0.3)";

        const dummy = new SpeechSynthesisUtterance(" ");
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
        setTimeout(() => {
            if (!reconocimiento) {
                iniciar();
            }
            intentarIniciar();
        }, 300);
    } else {
        if (corriendo) {
            reconocimiento.stop();
            corriendo = false;
            estado.textContent = "⏸️ Micrófono pausado";
            boton.style.boxShadow = "0 0 10px 5px rgba(255,100,100,0.3)";
        } else {
            intentarIniciar();
        }
    }
});

async function enviar(comando) {
    console.log("📡 Enviando comando:", comando);
    estado.textContent = "⏳ Jarvis procesando...";

    try {
        const response = await fetch('http://localhost:3000/api/hablar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: comando })
        });

        const data = await response.json();
        console.log("📥 Respuesta:", data);

        if (data.OK && data.voz) {
            console.log("🔊 Reproduciendo:", data.voz);
            estado.textContent = "🔊 Hablando...";

            // Primero, reproducir un sonido silencioso para "despertar" el permiso de audio
            const dummy = new SpeechSynthesisUtterance(" ");
            dummy.volume = 0;
            
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(dummy);

            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(data.voz);
                utterance.lang = 'es-ES';
                utterance.rate = 0.85;
                utterance.pitch = 1.0;
                utterance.volume = 1;

                const voces = window.speechSynthesis.getVoices();
                const vozPablo = voces.find(v => v.name.includes('Pablo') || v.name.includes('pablo'));
                if (vozPablo) {
                    utterance.voice = vozPablo;
                    console.log("✅ Usando voz:", vozPablo.name);
                } else {
                    console.log("⚠️ Voz Pablo no disponible. Voces disponibles:", voces.map(v => v.name));
                    const vozES = voces.find(v => v.lang === 'es-ES');
                    if (vozES) {
                        utterance.voice = vozES;
                        console.log("📢 Usando voz es-ES alternativa:", vozES.name);
                    }
                }

                utterance.onstart = () => {
                    console.log("🎵 Voz iniciada");
                };

                utterance.onend = () => {
                    console.log("✅ Voz terminada");
                    estado.textContent = "🎧 Escuchando (di 'Jarvis')...";
                    setTimeout(() => {
                        if (!corriendo && autorizado) {
                            intentarIniciar();
                        }
                    }, 500);
                };

                utterance.onerror = (event) => {
                    console.error("❌ Error en voz:", event.error);
                    estado.textContent = "⚠️ Error de audio";
                    setTimeout(() => {
                        estado.textContent = "🎧 Escuchando (di 'Jarvis')...";
                    }, 2000);
                };

                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utterance);
            }, 100);

            if (data.estilosCSS) {
                let estiloElement = document.getElementById('estilos-jarvis');
                if (!estiloElement) {
                    estiloElement = document.createElement('style');
                    estiloElement.id = 'estilos-jarvis';
                    document.head.appendChild(estiloElement);
                }
                estiloElement.innerHTML = data.estilosCSS;
            }
        } else {
            console.error("❌ Respuesta inválida:", data);
            estado.textContent = "❌ Error en respuesta";
        }
    } catch (error) {
        console.error("❌ Error de fetch:", error);
        estado.textContent = "❌ Error de conexión";
    }
}

window.addEventListener('load', () => {
    console.log("🚀 Sistema JARVIS listo");
    estado.textContent = "Click en 🎤 para autorizar y activar micrófono";
});
