// src/components/common/ArticleLine.jsx

import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const ArticleLine = ({ artigo, onEdit, isAdmin }) => {
  return (
    <div className="flex justify-between items-center border-2 border-black rounded-xl p-4 my-2 bg-white shadow-sm hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="font-semibold text-gray-800 text-lg">
          {artigo.nome}
        </span>
        <span className="text-sm text-gray-500 italic">
          — {artigo.lideres || 'Autores não especificados'}
        </span>
      </div>

      {/* Link PDF - Visível para todos em Artigos */}
      {artigo.pdfUrl && (
        <a href={artigo.pdfUrl} target="_blank" rel="noopener noreferrer" className="ml-auto mr-4 text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
          📄 Ler
        </a>
      )}

      {/* Botão Editar/CRUD (Apenas Admin) */}
      {isAdmin && (
        <button
          onClick={() => onEdit('artigo', artigo)}
          className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[#e76f51] hover:bg-black hover:text-white transition-colors ml-4"
          title="Editar Artigo"
        >
          <FaPencilAlt size={12} />
        </button>
      )}
    </div>
  );
};

export default ArticleLine;