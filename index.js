const express = require('express');
const app = express();
app.use(express.json());

// Lista inicial de usuarios (puedes incluir tu propio UserId aquí por defecto)
let vipUsers = ["10855488808"]; 

// 1. Ver la lista completa de usuarios VIP
app.get('/users', (req, res) => {
    res.json({ success: true, users: vipUsers });
});

// 2. Comprobar si un usuario es VIP
app.get('/check-vip', (req, res) => {
    const userId = String(req.query.userId);
    if (vipUsers.includes(userId)) {
        res.json({ isVip: true, message: "Acceso concedido" });
    } else {
        res.json({ isVip: false, message: "Acceso denegado" });
    }
});

// 3. Añadir un usuario nuevo
app.post('/users/add', (req, res) => {
    const { userId, adminSecret } = req.body;
    
    // Opcional: Una contraseña simple para que nadie más pueda añadir usuarios
    if (adminSecret !== "MTUzMjUzNDY1NDcyMzQyNDQ0OA.GrE-OC.7IqfTRsvRMh-viIAc0VhRPaYStJb7C9RGEcv2g") {
        return res.status(403).json({ error: "No autorizado" });
    }

    if (userId && !vipUsers.includes(String(userId))) {
        vipUsers.push(String(userId));
        res.json({ success: true, message: `Usuario ${userId} añadido con éxito`, users: vipUsers });
    } else {
        res.status(400).json({ error: "El usuario ya existe o ID inválido" });
    }
});

// 4. Quitar un usuario
app.post('/users/remove', (req, res) => {
    const { userId, adminSecret } = req.body;

    if (adminSecret !== "MTUzMjUzNDY1NDcyMzQyNDQ0OA.GrE-OC.7IqfTRsvRMh-viIAc0VhRPaYStJb7C9RGEcv2g") {
        return res.status(403).json({ error: "No autorizado" });
    }

    const index = vipUsers.indexOf(String(userId));
    if (index !== -1) {
        vipUsers.splice(index, 1);
        res.json({ success: true, message: `Usuario ${userId} eliminado`, users: vipUsers });
    } else {
        res.status(404).json({ error: "El usuario no estaba en la lista" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
