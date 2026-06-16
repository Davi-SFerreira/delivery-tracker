export function autorizar(...papeis) {
    return (req, res, next) => {
        if (!req.usuario || !papeis.includes(req.usuario.papel)) {
            return res.status(403).json({ erro: "Acesso negado" });
        }
        return next();
    };
}