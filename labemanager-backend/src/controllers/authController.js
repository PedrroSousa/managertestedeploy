const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const SECRET_KEY = 'labe_secret_key_super_secure';

const register = (req, res) => {
    const { email, password, role, fullName } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const userRole = role || 'PARTICIPANTE';

    const newUser = {
        email,
        password: hashedPassword,
        role: userRole,
        fullName
    };

    User.createUser(newUser, function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: 'Usuário já existe.' });
            }
            return res.status(500).json({ message: 'Erro no servidor: ' + err.message });
        }
        res.status(200).json({ message: 'Usuário registrado com sucesso!' });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    User.findUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: 'Erro no servidor.' });
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ token: null, message: 'Senha inválida.' });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            token: token
        });
    });
};

module.exports = {
    register,
    login
};
