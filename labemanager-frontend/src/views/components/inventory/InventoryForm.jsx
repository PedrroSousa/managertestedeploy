// src/components/common/InventoryForm.jsx

import React, { useState } from 'react';

const InventoryForm = ({ entityType, dataToEdit, apiCalls, onSuccess, onClose }) => {
  const isEditing = !!dataToEdit;
  const isDepartment = entityType === 'Departamentos' || entityType === 'Logísticas'; // "Logísticas" is used in UI title, "Departamentos" in logic

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    marca: '',
    imageUrl: '',
    ...dataToEdit,
    // Ensure these exist even if dataToEdit has them as undefined/null
    lideres: dataToEdit?.lideres || '',
    pdfUrl: dataToEdit?.pdfUrl || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);

    // Validação básica
    if (!formData.nome || !formData.descricao) {
      setError('Nome e Descrição são obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await apiCalls.update(dataToEdit.id, formData);
      } else {
        await apiCalls.add(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || `Erro ao salvar ${entityType}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir este ${entityType}?`)) return;
    try {
      await apiCalls.delete(dataToEdit.id);
      onSuccess();
    } catch (err) {
      setError(err.message || `Erro ao excluir ${entityType}.`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[30px] border-2 border-black w-full max-w-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
      <h3 className="text-2xl font-bold mb-6 text-black border-b-2 border-black pb-2 text-center">
        {isEditing ? 'Editar' : 'Cadastrar'} {entityType}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Nome */}
        <div>
          <label className="block text-sm font-bold mb-1">Nome{isDepartment ? ' do Departamento' : ''}:</label>
          <input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full bg-[#f7f2ea] border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-shadow"
            required
          />
        </div>

        {/* Marca/Modelo (Esconder se for Departamento) */}
        {!isDepartment && (
          <div>
            <label className="block text-sm font-bold mb-1">Marca/Modelo:</label>
            <input
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="w-full bg-[#f7f2ea] border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-shadow"
            />
          </div>
        )}

        {/* Campos Específicos de DEPARTAMENTO */}
        {isDepartment && (
          <>
            <div>
              <label className="block text-sm font-bold mb-1">Líderes Técnicos:</label>
              <input
                name="lideres"
                value={formData.lideres || ''}
                onChange={handleChange}
                placeholder="Ex: João Silva, Maria Souza"
                className="w-full bg-[#f7f2ea] border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Link do Documento (URL):</label>
              <input
                name="pdfUrl"
                value={formData.pdfUrl || ''}
                onChange={handleChange}
                placeholder="Ex: https://drive.google.com/..."
                className="w-full bg-[#f7f2ea] border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-shadow"
              />
            </div>
          </>
        )}

        {/* Descrição */}
        <div>
          <label className="block text-sm font-bold mb-1">Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full bg-[#f7f2ea] border-2 border-black rounded-xl p-3 h-24 focus:outline-none focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-shadow resize-none"
            required
          />
        </div>

        {/* URL Imagem (Pode ser o logo do departamento) */}
        <div>
          <label className="block text-sm font-bold mb-1">URL da Imagem (Logo/Foto):</label>
          <input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.png"
            className="w-full bg-[#f7f2ea] border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-shadow"
          />
        </div>

        {/* Image Preview */}
        {formData.imageUrl && (
          <div className="mt-2 border-2 border-black rounded-xl overflow-hidden h-40 bg-gray-100 flex items-center justify-center relative">
            <span className="absolute text-xs text-gray-500 font-bold z-0">Preview</span>
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover relative z-10"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {error && <p className="text-red-500 font-bold text-sm bg-red-100 p-2 rounded border-2 border-red-500">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-black border-2 border-black py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#7aaeb5] text-white border-2 border-black py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>

      {isEditing && (
        <button
          onClick={handleDelete}
          className="w-full mt-4 bg-[#ff8c69] text-white border-2 border-black py-2 rounded-xl font-bold hover:brightness-110 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          Excluir {entityType}
        </button>
      )}
    </div>
  );
};

export default InventoryForm;
