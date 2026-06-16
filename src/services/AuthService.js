import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    constructor(usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
    }

    async registrar(dados) {
        const usuarioExistente = await this.usuariosRepository.buscarPorEmail(dados.email);
        if (usuarioExistente) {
            const erro = new Error('Email já cadastrado');
            erro.status = 409;
            throw erro;
        }

        const senhaHash = await bcrypt.hash(dados.senha, 10);

        const novoUsuario = await this.usuariosRepository.criar({
            nome: dados.nome,
            email: dados.email,
            senha: senhaHash,
            papel: dados.papel || 'OPERADOR'
        });

        const { senha, ...usuarioSemSenha } = novoUsuario;
        return usuarioSemSenha;
    }

    async login(email, senha) {
        const usuario = await this.usuariosRepository.buscarPorEmail(email);
        
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            const erro = new Error('Credenciais inválidas');
            erro.status = 401;
            throw erro;
        }

        const payload = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            papel: usuario.papel
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return { token, usuario: payload };
    }
}