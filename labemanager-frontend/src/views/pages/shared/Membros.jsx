
// src/pages/shared/Membros.jsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { useAuth } from '../../../context/AuthContext';
import { getAllMembers, addMember, updateMember, deleteMember } from '../../../models/members';
import MemberForm from '../../components/members/MemberForm';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';

// Estilos
const sectionTitleStyle = { color: '#6c9a9b', borderBottom: '2px solid #95b8bc', paddingBottom: '5px', marginTop: '30px' };
const cardListStyle = { display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' };
const memberCardStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '15px',
  width: 'calc(33% - 20px)', // 3 cards por linha
  boxShadow: '2px 2px 5px rgba(0,0,0,0.05)',
  position: 'relative',
};
const buttonStyle = {
  padding: '8px 15px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
};
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const Membros = () => {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenForm = (member = null) => {
    setMemberToEdit(member);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setMemberToEdit(null);
    setIsFormOpen(false);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Tem certeza que deseja excluir este membro?")) {
      try {
        await deleteMember(memberId);
        fetchMembers(); // Recarrega a lista
      } catch (error) {
        alert("Falha ao excluir membro.");
      }
    }
  };

  // Classificação dos membros
  const professores = members.filter(m => m.tipo === 'PROFESSOR' || m.role === 'ADMIN');
  const alunos = members.filter(m => m.tipo === 'ALUNO' || m.role === 'PARTICIPANTE');

  const MemberCard = ({ member }) => (
    <div style={memberCardStyle}>
      {isAdmin && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
          <FaEdit
            style={{ cursor: 'pointer', color: '#95b8bc' }}
            onClick={() => handleOpenForm(member)}
            title="Editar"
          />
          <FaTrashAlt
            style={{ cursor: 'pointer', color: '#e76f51' }}
            onClick={() => handleDelete(member.id)}
            title="Excluir"
          />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <img src={member.fotoUrl || 'placeholder.png'} alt={member.nome} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
        <h4 style={{ margin: 0, color: '#333' }}>{member.nome}</h4>
      </div>
      <p style={{ fontSize: '14px', color: '#666' }}>Email: {member.email}</p>
      <p style={{ fontSize: '14px', color: '#666' }}>Adesão: {member.dataAdesao}</p>
      {/* Detalhes que o Admin pode cadastrar, mas todos visualizam */}
      <p style={{ fontSize: '14px', color: '#666', borderTop: '1px solid #eee', paddingTop: '5px' }}>
        Áreas: {member.areas}
      </p>
    </div>
  );

  return (
    <MainLayout>
      <h1 style={{ color: '#6c9a9b' }}>Gestão de Membros</h1>

      {isAdmin && (
        <button
          onClick={() => handleOpenForm(null)}
          style={{ ...buttonStyle, backgroundColor: '#95b8bc', color: '#fff', marginBottom: '20px' }}
        >
          <FaPlus style={{ marginRight: '5px' }} /> Adicionar Novo Membro
        </button>
      )}

      {loading && <p>Carregando membros...</p>}

      {/* SEÇÃO PROFESSORES */}
      <h2 style={sectionTitleStyle}>Professores</h2>
      <div style={cardListStyle}>
        {professores.map(p => <MemberCard key={p.id} member={p} />)}
      </div>

      {/* SEÇÃO ALUNOS */}
      <h2 style={sectionTitleStyle}>Alunos</h2>
      <div style={cardListStyle}>
        {alunos.map(a => <MemberCard key={a.id} member={a} />)}
      </div>

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      {isFormOpen && (
        <div style={modalOverlayStyle}>
          <MemberForm
            memberToEdit={memberToEdit}
            onSuccess={() => {
              handleCloseForm();
              fetchMembers(); // Recarrega a lista após o sucesso
            }}
            onClose={handleCloseForm}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Membros;