// src/components/inventory/InventoryItemCard.jsx

import React from 'react';
import { FaPencilAlt, FaFilePdf } from 'react-icons/fa';

const InventoryItemCard = ({ item, onEdit, isAdmin, isDepartment }) => {
  return (
    <div className="bg-white border-2 border-black rounded-[20px] p-5 flex items-center gap-5 relative shadow-sm hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
      {/* Imagem */}
      <div className="w-20 h-20 rounded-xl border-2 border-black overflow-hidden flex-shrink-0 bg-gray-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.nome} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">Sem Foto</div>
        )}
      </div>

      {/* Detalhes */}
      <div className="flex-grow">
        <h4 className="text-xl font-bold text-[#6c9a9b] mb-1 font-sans">{item.nome}</h4>

        {/* Exibe Marca/Modelo OU Líderes Técnicos */}
        {isDepartment || item.lideres ? (
          <div className="mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Líderes Técnicos:</p>
            <p className="text-sm font-semibold text-gray-800 bg-yellow-50 inline-block px-2 py-1 rounded border border-yellow-200">
              {item.lideres || <span className="text-gray-400 italic font-normal">Não informado</span>}
            </p>
          </div>
        ) : (
          item.marca && <p className="text-sm text-gray-500 font-semibold mb-1">Marca: {item.marca}</p>
        )}

        {/* Resumo / Descrição */}
        <div className="mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Resumo:</span>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {item.descricao}
          </p>
        </div>

        {/* Links (Documento e Imagem) */}
        <div className="flex flex-col gap-1 mt-2">
          {/* Link do Documento */}
          {item.pdfUrl && (
            <a
              href={item.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <FaFilePdf /> Acessar Documento
            </a>
          )}

          {/* Link da Imagem removed globally by user request */}
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        {/* Botão Editar (Admin) */}
        {isAdmin && (
          <button
            onClick={() => onEdit(item)}
            className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-[#e76f51] hover:bg-black hover:text-white transition-colors shadow-sm"
            title="Editar Item"
          >
            <FaPencilAlt size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InventoryItemCard;
