import { useState, useEffect, useMemo } from 'react';
import { getAllTransactions, addTransaction, updateTransaction, deleteTransaction } from '../models/finance';

export const useFinanceController = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);

    // Initial Fetch
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllTransactions();
            setTransactions(data);
        } catch (err) {
            console.error("Erro ao carregar finanças:", err);
            setError("Falha ao carregar dados financeiros.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Form Handlers
    const handleOpenForm = (transaction = null) => {
        setTransactionToEdit(transaction);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setTransactionToEdit(null);
        setIsFormOpen(false);
    };

    const handleSuccess = () => {
        handleCloseForm();
        fetchData(); // Refresh list after success
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta transação?")) return;
        try {
            await deleteTransaction(id);
            fetchData();
        } catch (err) {
            alert(err.message || "Erro ao excluir.");
        }
    };

    const totalBalance = useMemo(() => {
        return transactions.reduce((acc, t) => {
            if (t.tipo === 'RECEITA') return acc + t.valor;
            if (t.tipo === 'DESPESA') return acc - t.valor;
            // INVESTIMENTO não afeta o saldo total conforme solicitado
            return acc;
        }, 0);
    }, [transactions]);

    return {
        transactions,
        loading,
        error,
        isFormOpen,
        transactionToEdit,
        totalBalance,
        handleOpenForm,
        handleCloseForm,
        handleSuccess,
        handleDelete
    };
};
