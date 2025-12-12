const eventModel = require('../models/eventModel');

const getAll = (req, res) => {
    eventModel.getAll((err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar eventos.' });
        }
        res.json(rows);
    });
};

const create = (req, res) => {
    const { title, date, description } = req.body;
    if (!title || !date) {
        return res.status(400).json({ error: 'Título e Data são obrigatórios.' });
    }

    eventModel.add({ title, date, description }, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao criar evento.' });
        }
        res.status(201).json(result);
    });
};

const update = (req, res) => {
    const { id } = req.params;
    const { title, date, description } = req.body;

    eventModel.update(id, { title, date, description }, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar evento.' });
        }
        res.json(result);
    });
};

const remove = (req, res) => {
    const { id } = req.params;

    eventModel.delete(id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar evento.' });
        }
        res.json({ message: 'Evento removido com sucesso.' });
    });
};

module.exports = {
    getAll,
    create,
    update,
    remove
};
