import fetch from "node-fetch";

const loginURL = "http://localhost:3000/auth/login";

async function simulateFastSubmit() {
    console.log("=".repeat(60));
    console.log("Iniciando prueba de protección de tiempo...");
    console.log("=".repeat(60));
    console.log("");
    
    for (let i = 0; i < 200; i++) {
        try {
            const startTime = Date.now();
            const res = await fetch(loginURL, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "node-fetch/test"
                },
                body: "email=usuario@valido.com&password=1234"
            });
            const elapsed = Date.now() - startTime;
            
            console.log(`Envío ${i + 1}: HTTP ${res.status} (${res.statusText}) - ${elapsed}ms`);
            const text = await res.text();
            
            if (res.status === 429) {
                console.log("BLOQUEADO POR TIMEPROTECTION");
                console.log(`   Mensaje: ${text.substring(0, 80)}...`);
            } else {
                console.log(`   Respuesta: ${text.substring(0, 80)}...`);
            }
            console.log("");
        } catch (error) {
            console.error(`Error en envío ${i + 1}:`, error.message);
            console.log("");
        }
    }
    
    console.log("=".repeat(60));
    console.log("Prueba finalizada.");
    console.log("=".repeat(60));
}

simulateFastSubmit();