import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token não fornecido" });
    }

    const partes = authHeader.split(' ');
    if (partes.length !== 2) {
        return res.status(401).json({ erro: "Token inválido" });
    }

    const token = partes[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        return next();
    } catch (erro) {
        if (erro.name === 'TokenExpiredError') {
            return res.status(401).json({ erro: "Token expirado" });
        }
        return res.status(401).json({ erro: "Token inválido" });
    }
}