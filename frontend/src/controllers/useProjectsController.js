import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllArtigos, getAllProjetos, deleteArtigo, deleteProjeto, addArtigo, updateArtigo, addProjeto, updateProjeto } from '../models/academic';

export const useProjectsController = () => {
    const { isAdmin } = useAuth();
    const [artigos, setArtigos] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ type: null, data: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [artigosData, projetosData] = await Promise.all([
                getAllArtigos(),
                getAllProjetos()
            ]);
            setArtigos(artigosData);
            setProjetos(projetosData);
        } catch (error) {
            console.error("Erro ao carregar dados acadêmicos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenForm = (type, data = null) => {
        setFormData({ type, data });
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormData({ type: null, data: null });
        setIsFormOpen(false);
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Tem certeza que deseja excluir este ${type}?`)) return;

        try {
            const deleteApi = type === 'artigo' ? deleteArtigo : deleteProjeto;
            await deleteApi(id);
            fetchData();
        } catch (error) {
            alert(`Falha ao excluir ${type}.`);
        }
        handleCloseForm();
    };

    const handleSuccess = () => {
        handleCloseForm();
        fetchData();
    };

    return {
        isAdmin,
        artigos,
        projetos,
        loading,
        isFormOpen,
        formData,
        handleOpenForm,
        handleCloseForm,
        handleDelete,
        handleSuccess,
        // Also exporting these for the generic form to use if needed, 
        // though strictly they belong to the model. 
        // For the view, it just needs the callbacks.
        addArtigo, updateArtigo, addProjeto, updateProjeto
    };
};
