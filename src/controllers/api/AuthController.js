export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async registrar(req, res) {
        try {
            const usuario = await this.authService.registrar(req.body);
            return res.status(201).json(usuario);
        } catch (erro) {
            return res.status(erro.status || 400).json({ erro: erro.message });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const auth = await this.authService.login(email, senha);
            return res.status(200).json(auth);
        } catch (erro) {
            return res.status(erro.status || 401).json({ erro: erro.message });
        }
    }
}