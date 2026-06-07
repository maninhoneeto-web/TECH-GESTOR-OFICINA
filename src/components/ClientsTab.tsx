/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Car, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  CreditCard,
  Hash,
  Calendar
} from 'lucide-react';
import { Cliente } from '../types';

interface ClientsTabProps {
  clientes: Cliente[];
  onAddCliente: (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => void;
  onEditCliente: (id: string, updatedFields: Partial<Cliente>) => void;
  onDeleteCliente: (id: string) => void;
}

export default function ClientsTab({ 
  clientes, 
  onAddCliente, 
  onEditCliente, 
  onDeleteCliente 
}: ClientsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados dos inputs do formulário (cadastro / edição)
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [veiculoMarca, setVeiculoMarca] = useState('');
  const [veiculoModelo, setVeiculoModelo] = useState('');
  const [veiculoAno, setVeiculoAno] = useState('');
  const [veiculoPlaca, setVeiculoPlaca] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');

  // Limpar formulário
  const resetForm = () => {
    setNome('');
    setTelefone('');
    setEmail('');
    setVeiculoMarca('');
    setVeiculoModelo('');
    setVeiculoAno('');
    setVeiculoPlaca('');
    setCpfCnpj('');
    setEditingId(null);
  };

  const handleOpenCadastro = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setEditingId(cliente.id);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setEmail(cliente.email);
    setVeiculoMarca(cliente.veiculoMarca);
    setVeiculoModelo(cliente.veiculoModelo);
    setVeiculoAno(cliente.veiculoAno);
    setVeiculoPlaca(cliente.veiculoPlaca);
    setCpfCnpj(cliente.cpfCnpj);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !telefone.trim() || !veiculoModelo.trim() || !veiculoPlaca.trim()) {
      alert('Por favor, preencha o Nome, Telefone, Modelo do Veículo e Placa.');
      return;
    }

    const payload = {
      nome,
      telefone,
      email,
      veiculoMarca,
      veiculoModelo,
      veiculoAno,
      veiculoPlaca: veiculoPlaca.toUpperCase(),
      cpfCnpj
    };

    if (editingId) {
      onEditCliente(editingId, payload);
    } else {
      onAddCliente(payload);
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Filtrar clientes
  const filteredClientes = clientes.filter(c => {
    const q = searchTerm.toLowerCase();
    return (
      c.nome.toLowerCase().includes(q) ||
      c.telefone.includes(q) ||
      c.veiculoModelo.toLowerCase().includes(q) ||
      c.veiculoPlaca.toLowerCase().includes(q) ||
      c.cpfCnpj.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="clients-tab">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full inline-block"></span>
            Clientes & Veículos
          </h2>
          <p className="text-slate-400 text-sm">
            Cadastre proprietários e seus respectivos automóveis para gerar orçamentos instantâneos.
          </p>
        </div>
        <button
          onClick={handleOpenCadastro}
          id="btn-adicionar-cliente"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl transition duration-300 shadow-md shadow-cyan-500/10 cursor-pointer self-start"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Novo Registro
        </button>
      </div>

      {/* Caixa de Ferramentas: Busca */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
          <input
            type="text"
            id="search-clients"
            placeholder="Pesquisar por nome, telefone, veículo, placa do carro ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none transition font-sans"
          />
        </div>
        <div className="flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
          {filteredClientes.length} Encontrado(s)
        </div>
      </div>

      {/* Lista / Grid de Clientes com Aparência Futurista */}
      {filteredClientes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="clients-grid">
          {filteredClientes.map((c) => (
            <div 
              key={c.id} 
              id={`client-card-${c.id}`}
              className="bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              {/* Placa decorativa no topo-direito */}
              <div className="absolute right-4 top-4 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-sm font-mono group-hover:border-cyan-500/30 transition">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span className="text-[11px] font-black text-slate-200 tracking-wider uppercase">{c.veiculoPlaca || 'SEM PLACA'}</span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Nome e Ícone Principal */}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-cyan-950 to-blue-950 text-cyan-400 border border-cyan-500/20 rounded-xl">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 pr-24">
                    <h3 className="font-bold text-slate-200 text-base leading-tight truncate">{c.nome}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Cadastrado em {c.dataCadastro}</p>
                  </div>
                </div>

                <hr className="border-slate-900" />

                {/* Dados de Contato */}
                <div className="flex flex-col gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono">{c.telefone}</span>
                  </div>
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0 truncate" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  )}
                  {c.cpfCnpj && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-mono text-slate-400 text-[11px]">Doc: {c.cpfCnpj}</span>
                    </div>
                  )}
                </div>

                {/* Detalhes do Veículo */}
                <div className="bg-slate-900/65 rounded-xl p-3 border border-slate-900/80 flex items-center gap-3 mt-1">
                  <div className="p-2 bg-slate-950 text-cyan-400/90 rounded-lg border border-slate-800">
                    <Car className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="text-[10px] uppercase font-bold text-cyan-500 tracking-wider font-mono">Automóvel</p>
                    <p className="text-sm font-semibold text-slate-200 truncate">{c.veiculoMarca} {c.veiculoModelo}</p>
                    <span className="text-[10px] text-slate-500">Ano/Mod: {c.veiculoAno || '---'}</span>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="mt-5 pt-3 border-t border-slate-900 flex justify-end gap-2.5">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
                  title="Editar Cliente"
                >
                  <Edit3 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Tem certeza de que deseja excluir o cliente ${c.nome}?`)) {
                      onDeleteCliente(c.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                  title="Excluir Cliente"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-dashed border-slate-800 p-12 text-center rounded-2xl">
          <p className="text-slate-400 text-sm">Nenhum cliente cadastrado com esses critérios.</p>
          <button 
            onClick={handleOpenCadastro}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-cyan-400 font-bold text-xs rounded-xl transition"
          >
            Cadastrar Primeiro Cliente
          </button>
        </div>
      )}

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden" id="client-modal">
            
            {/* Linha brilhante decorativa de topo */}
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

            {/* Cabeçalho Modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-900">
              <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-cyan-400" />
                {editingId ? 'Editar Cliente e Veículo' : 'Cadastrar Cliente e Veículo'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              
              {/* Seção 1: Dados Pessoais */}
              <div>
                <h4 className="text-xs font-bold font-mono text-cyan-400 tracking-wider uppercase mb-3">Informações de Contato</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Roberto Alves"
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Telefone / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="Ex: (11) 99999-8888"
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: roberto@provedor.com"
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">CPF ou CNPJ (opcional)</label>
                    <input
                      type="text"
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(e.target.value)}
                      placeholder="Ex: 000.000.000-00"
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Dados do Veículo */}
              <div className="border-t border-slate-900 pt-4">
                <h4 className="text-xs font-bold font-mono text-cyan-400 tracking-wider uppercase mb-3">Especificações do Automóvel</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Marca do Carro</label>
                    <input
                      type="text"
                      value={veiculoMarca}
                      onChange={(e) => setVeiculoMarca(e.target.value)}
                      placeholder="Ex: Toyota, Honda, GM"
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Modelo do Veículo *</label>
                    <input
                      type="text"
                      required
                      value={veiculoModelo}
                      onChange={(e) => setVeiculoModelo(e.target.value)}
                      placeholder="Ex: Corolla LX, Civic"
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Ano Fabricação</label>
                    <input
                      type="text"
                      value={veiculoAno}
                      onChange={(e) => setVeiculoAno(e.target.value)}
                      placeholder="Ex: 2021"
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Placa do Veículo *</label>
                    <input
                      type="text"
                      required
                      value={veiculoPlaca}
                      onChange={(e) => setVeiculoPlaca(e.target.value)}
                      placeholder="Ex: ABC1D23"
                      maxLength={8}
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Botões do Formulário */}
              <div className="border-t border-slate-900 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="submit-client-form"
                  className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-md transition"
                >
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
