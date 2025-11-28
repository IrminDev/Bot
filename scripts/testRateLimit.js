import fetch from "node-fetch";

const loginURL = "http://localhost:3000/auth/login";

async function testTimeProtection() {
    console.log("=".repeat(60));
    console.log("Iniciando prueba de protección de tiempo...");
    console.log("Objetivo: Detectar 2 intentos en menos de 200ms");
    console.log("=".repeat(60));
    console.log("");
    
    let blockedCount = 0;
    
    for (let i = 0; i < 7; i++) {
        try {
            const startTime = Date.now();
            const res = await fetch(loginURL, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "node-fetch/test"
                },
                body: "email=usuario@test.com&password=wrongpassword123",
                redirect: 'manual'
            });
            const elapsed = Date.now() - startTime;
            
            const location = res.headers.get('location');
            
            console.log(`Intento ${i + 1}: HTTP ${res.status} - ${elapsed}ms`);
            
            if (res.status === 429) {
                console.log("BLOQUEADO POR TIME PROTECTION");
                blockedCount++;
            } else if (res.status === 302) {
                console.log(`📝 Redirigido a: ${location}`);
            } else {
                console.log(`   Estado: ${res.status}`);
            }
            console.log("");
            
            // NO hay pausa entre intentos - esto disparará la protección
        } catch (error) {
            console.error(`Error en intento ${i + 1}:`, error.message);
            console.log("");
        }
    }
    
    console.log("=".repeat(60));
    console.log("Prueba finalizada.");
    console.log(`Total de bloqueos detectados: ${blockedCount}`);
    console.log("");
    console.log("RESULTADO:");
    if (blockedCount >= 1) {
        console.log("   Time protection funcionando correctamente!");
        console.log(`   Intentos bloqueados: ${blockedCount}`);
    } else {
        console.log("   La protección de tiempo no se activó.");
    }
    console.log("=".repeat(60));
}

testTimeProtection();