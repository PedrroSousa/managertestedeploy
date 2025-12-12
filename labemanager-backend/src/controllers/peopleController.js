const peopleModel = require('../models/peopleModel');

const getAll = (req, res) => {
    peopleModel.getAll((err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar membros.' });
        }
        res.json(rows);
    });
};

const create = (req, res) => {
    const { nome, email, tipo } = req.body;
    if (!nome || !email || !tipo) {
        return res.status(400).json({ error: 'Nome, Email e Tipo são obrigatórios.' });
    }

    peopleModel.add(req.body, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao criar membro.' });
        }
        res.status(201).json(result);
    });
};

const update = (req, res) => {
    const { id } = req.params;

    peopleModel.update(id, req.body, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar membro.' });
        }
        res.json(result);
    });
};

const remove = (req, res) => {
    const { id } = req.params;

    peopleModel.delete(id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar membro.' });
        }
        res.json({ message: 'Membro removido com sucesso.' });
    });
};

module.exports = {
    getAll,
    create,
    update,
    remove
};
