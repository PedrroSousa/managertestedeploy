
// src/pages/shared/Almoxarifado.jsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { useAuth } from '../../../context/AuthContext';
import { inventoryApi } from '../../../models/inventory';
import InventoryItemCard from '../../components/inventory/InventoryItemCard';
import InventoryForm from '../../components/inventory/InventoryForm';
import { FaPlus } from 'react-icons/fa';

const Almoxarifado = () => {
    const entityType = 'Almoxarifado';
    const { isAdmin } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await inventoryApi.getAll();
            setItems(data);
        } catch (error) {
            console.error(`Erro ao carregar ${entityType}: `, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenForm = (item = null) => {
        setItemToEdit(item);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setItemToEdit(null);
        setIsFormOpen(false);
        fetchData(); // Atualiza a lista após fechar o formulário (sucesso ou cancelamento)
    };

    if (loading) return (
        <MainLayout>
            <div className="flex h-screen items-center justify-center">
                <p className="text-xl font-bold text-gray-500 animate-pulse">Carregando itens do Almoxarifado...</p>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-[#6c9a9b] mb-6 border-b-2 border-black inline-block pb-2">
                    {entityType}
                </h1>

                {isAdmin && (
                    <button
                        onClick={() => handleOpenForm(null)}
                        className="bg-[#95b8bc] text-white border-2 border-black py-3 px-6 rounded-xl font-bold hover:brightness-110 flex items-center gap-2 mb-8 shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
                    >
                        <FaPlus /> Cadastrar Novo Item
                    </button>
                )}

                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <InventoryForm
                            entityType={entityType}
                            dataToEdit={itemToEdit}
                            apiCalls={inventoryApi}
                            onSuccess={handleCloseForm}
                            onClose={() => setIsFormOpen(false)}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map(item => (
                        <InventoryItemCard
                            key={item.id}
                            item={item}
                            onEdit={handleOpenForm}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>

                {!items.length && !loading && (
                    <div className="text-center py-10 bg-[#f7f2ea] border-2 border-dashed border-gray-400 rounded-xl">
                        <p className="text-gray-500 font-medium">Nenhum item encontrado no Almoxarifado.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Almoxarifado;
