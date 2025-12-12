// src/components/common/ProjectCard.jsx

import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const ProjectCard = ({ project, onEdit, isAdmin }) => {
  // Icon logic simplified to check imageUrl directly inside the return


  return (
    <div className="bg-white border-2 border-black rounded-[20px] p-5 flex items-center md:items-start gap-5 relative shadow-sm hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 mb-4">
      {/* Ícone Capa do Projeto */}
      <div
        className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-100"
      >
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.nome} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🧪</span>
        )}
      </div>

      {/* Texto e Detalhes */}
      <div className="flex-grow">
        <h4 className="text-xl font-bold text-[#6c9a9b] mb-2 font-sans">{project.nome}</h4>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
          {project.descricao}
        </p>

        {/* Tags / Membros */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-1 self-center">Membros:</span>
          {project.lideres ? project.lideres.split(',').map((membro, idx) => (
            <span key={idx} className="bg-[#f0ece3] border border-gray-400 rounded-full px-3 py-0.5 text-xs font-semibold text-gray-700">
              {membro.trim()}
            </span>
          )) : <span className="text-xs text-gray-400 italic self-center">Sem membros</span>}
        </div>

        {/* Link do Documento (Apenas Admin para Projetos) */}
        {isAdmin && project.pdfUrl && (
          <div className="mt-2">
            <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
              🔒 Documento do Projeto (Admin)
            </a>
          </div>
        )}
      </div>

      {/* Botão Editar/CRUD (Apenas Admin) */}
      {isAdmin && (
        <button
          onClick={() => onEdit('projeto', project)}
          className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[#e76f51] hover:bg-black hover:text-white transition-colors absolute top-4 right-4"
          title="Editar Projeto"
        >
          <FaPencilAlt size={14} />
        </button>
      )}
    </div>
  );
};

export default ProjectCard;
