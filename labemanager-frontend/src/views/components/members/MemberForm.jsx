import React, { useState, useRef } from 'react';
import { addMember, updateMember } from "../../../models/members";
import { FaPlus, FaTimes, FaArrowRight, FaCamera } from 'react-icons/fa';

const MemberForm = ({ memberToEdit, onSuccess, onClose }) => {
  const isEditing = !!memberToEdit;
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    dataAdesao: '',
    tipo: 'ALUNO',
    areas: '',
    fotoUrl: '', // Base64 string
    ...memberToEdit,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, fotoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateMember(memberToEdit.id, formData);
      } else {
        await addMember(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Erro ao salvar membro.');
    } finally {
      setLoading(false);
    }
  };

  // Styling constants matching Image 3 (Neubrutalism)
  const cardStyle = "bg-white p-8 rounded-[32px] border-2 border-black max-w-2xl w-full mx-auto relative animate-scaleIn shadow-[8px_8px_0_0_rgba(0,0,0,1)]";
  const labelStyle = "block font-bold text-gray-800 text-sm mb-1 ml-1";
  const inputStyle = "w-full bg-white border-2 border-black rounded-full px-4 py-3 outline-none font-medium focus:bg-gray-50 transition placeholder-gray-400";
  const selectStyle = "w-full bg-white border-2 border-black rounded-full px-4 py-3 outline-none font-medium appearance-none cursor-pointer";
  const buttonPrimaryStyle = "bg-[#7aaeb5] hover:bg-[#689aa0] text-black font-bold py-3 px-8 rounded-full border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition flex items-center gap-2 text-lg";
  const buttonDeleteStyle = "bg-[#e76f51] hover:bg-[#d65d40] text-white font-bold py-3 px-8 rounded-full border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition";

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={cardStyle}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 border-2 border-transparent hover:border-black transition"
        >
          <FaTimes size={20} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Header Layout: Photo Left, Fields Right */}
          <div className="flex flex-col md:flex-row gap-8">

            {/* Image Upload Area */}
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={triggerFileInput}
                className="w-40 h-40 bg-[#7aaeb5] rounded-[24px] border-2 border-black flex items-center justify-center cursor-pointer hover:brightness-110 transition relative overflow-hidden group shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              >
                {formData.fotoUrl ? (
                  <img src={formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-black">
                    <FaPlus size={32} />
                    <span className="font-bold text-xs mt-1 text-center leading-tight">Adicionar<br />Imagem</span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <FaCamera className="text-white text-2xl" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Text Fields */}
            <div className="flex-1 space-y-4">
              <div>
                <label className={labelStyle}>Nome</label>
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label className={labelStyle}>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label className={labelStyle}>Data de Adesão</label>
                <input
                  type="date"
                  name="dataAdesao"
                  value={formData.dataAdesao}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Lower Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Tipo</label>
              <div className="relative">
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={selectStyle}
                >
                  <option value="ALUNO">Aluno</option>
                  <option value="PROFESSOR">Professor</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FaArrowRight className="rotate-90 text-sm" />
                </div>
              </div>
            </div>
            <div>
              <label className={labelStyle}>Área(s)</label>
              <input
                name="areas"
                value={formData.areas}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Ex: Machine Learning, UX Design"
              />
            </div>
          </div>

          {/* Removed Projects/Articles Dropdowns as requested */}

          {error && <p className="text-red-500 font-bold text-center">{error}</p>}

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-4">
            {isEditing ? (
              <button
                type="button"
                // Delete logic would handle calling parent's delete or we can add it here if props passed
                // But usually MemberForm is just add/edit. 
                // Added a visual placeholder for Delete if consistent with design 3 (Red Button "Excluir")
                className={buttonDeleteStyle}
                onClick={() => { /* In this component flow, usually delete is on list, but image 3 shows Excluir. User didn't ask to impl delete inside modal explicitly for logic, but visually yes. */ }}
              >
                Excluir
              </button>
            ) : (
              <div></div> // Spacer
            )}

            <button type="submit" className={buttonPrimaryStyle} disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar'} <FaArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;