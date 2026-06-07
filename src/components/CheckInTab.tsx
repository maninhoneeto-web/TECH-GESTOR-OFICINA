/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Car, 
  Calendar, 
  Clock, 
  Gauge, 
  Fuel, 
  ClipboardCheck, 
  Check, 
  X, 
  Printer, 
  Trash2, 
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Wrench,
  Layers,
  Inbox,
  UserCheck
} from 'lucide-react';
import { Cliente, CheckInItem } from '../types';

interface CheckInTabProps {
  checkins: CheckInItem[];
  clientes: Cliente[];
  onAddCheckin: (checkin: Omit<CheckInItem, 'id'>) => void;
  onDeleteCheckin: (id: string) => void;
  nomeOficina: string;
}

export default function CheckInTab({ 
  checkins, 
  clientes, 
  onAddCheckin, 
  onDeleteCheckin,
  nomeOficina
}: CheckInTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReceiptId, setActiveReceiptId] = useState<string | null>(null);

  // Estados dos inputs de formulário
  const [clienteId, setClienteId] = useState('');
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [km, setKm] = useState<number>(0);
  const [nivelCombustivel, setNivelCombustivel] = useState<CheckInItem['nivelCombustivel']>('1/2');
  const [arranhaMassa, setArranhaMassa] = useState(false);
  const [faroisLanternas, setFaroisLanternas] = useState(true);
  const [estepeMacaco, setEstepeMacaco] = useState(true);
  const [objetosInternos, setObjetosInternos] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [operador, setOperador] = useState('');

  const resetForm = () => {
    setClienteId('');
    setTipo('entrada');
    setKm(0);
    setNivelCombustivel('1/2');
    setArranhaMassa(false);
    setFaroisLanternas(true);
    setEstepeMacaco(true);
    setObjetosInternos(false);
    setObservacoes('');
    setOperador('');
  };

  const handleOpenForm = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteId) {
      alert('Selecione primeiro o cliente proprietário do veículo.');
      return;
    }

    if (km < 0) {
      alert('Digite uma quilometragem válida.');
      return;
    }

    const payload = {
      clienteId,
      tipo,
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      km: Number(km),
      nivelCombustivel,
      checklist: {
        arranhaMassa,
        faroisLanternas,
        estepeMacaco,
        objetosInternos
      },
      observacoes,
      operador
    };

    onAddCheckin(payload);
    setIsModalOpen(false);
    resetForm();
  };

  // Obter detalhes rápidos do cliente pelo ID
  const getCliente = (id: string): Cliente | undefined => {
    return clientes.find(c => c.id === id);
  };

  const getClienteNome = (id: string) => {
    const c = getCliente(id);
    return c ? c.nome : 'Cliente Não Identificado';
  };

  const getClienteCarro = (id: string) => {
    const c = getCliente(id);
    return c ? `${c.veiculoMarca} ${c.veiculoModelo} (${c.veiculoPlaca})` : 'Veículo Desconhecido';
  };

  const getClienteWhatsApp = (id: string) => {
    const c = getCliente(id);
    return c ? c.telefone : '';
  };

  const handleWhatsAppNotify = (item: CheckInItem) => {
    const client = getCliente(item.clienteId);
    if (!client) return;

    const phone = client.telefone;
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;

    let text = '';
    
    if (item.tipo === 'entrada') {
      text = `Olá ${client.nome}!\n` +
             `Aqui é da *${nomeOficina || 'Tech Gestor Oficina'}* 🚗💨\n\n` +
             `Confirmamos que seu veículo *${client.veiculoMarca} ${client.veiculoModelo}* (Placa: *${client.veiculoPlaca}*) deu entrada oficial com segurança em nosso galpão técnico!\n\n` +
             `📋 *Laudo e Checklist Digital de Check-In*:\n` +
             `- *Operação:* Controle de Entrada\n` +
             `- *Data:* ${item.data} às ${item.hora}\n` +
             `- *KM Atual:* ${item.km.toLocaleString('pt-BR')} km\n` +
             `- *Nível de Combustível:* ${item.nivelCombustivel}\n` +
             `- *Luzes, Faróis & Lanternas:* ${item.checklist.faroisLanternas ? '✅ Verificado e OK' : '⚠️ Necessita Revisão'}\n` +
             `- *Ranhuras / Amassados na Pintura:* ${item.checklist.arranhaMassa ? '⚠️ Registrados sob Laudo de Entrada' : '✅ Nenhuma avaria observada'}\n` +
             `- *Estepe / Chave de roda / Triângulo:* ${item.checklist.estepeMacaco ? '✅ Presentes no porta-malas' : '⚠️ Não localizados'}\n` +
             `- *Objetos de Valor Internos:* ${item.checklist.objetosInternos ? '✅ Registrados e Guardados' : '✅ Nenhum objeto de valor em cabine'}\n\n` +
             `📌 *Observações Adicionais:* ${item.observacoes || 'Nenhum risco detectado.'}\n` +
             `👤 *Responsável Técnico:* ${item.operador}\n\n` +
             `Fique tranquilo! Toda a análise foi documentada em nosso banco de dados. Nosso orçamento oficial está sendo gerado e enviaremos em instantes para sua aprovação.`; 
    } else {
      text = `Olá ${client.nome}!\n` +
             `Aqui é da *${nomeOficina || 'Tech Gestor Oficina'}* 🟢✨\n\n` +
             `Seu veículo *${client.veiculoMarca} ${client.veiculoModelo}* (Placa: *${client.veiculoPlaca}*) está finalizado e pronto para retirada!\n\n` +
             `📋 *Laudo Digital de Check-Out (Saída)*:\n` +
             `- *Operação:* Liberação / Entrega\n` +
             `- *Horário de Saída:* ${item.data} às ${item.hora}\n` +
             `- *KM de Saída:* ${item.km.toLocaleString('pt-BR')} km\n` +
             `- *Nível de Combustível:* ${item.nivelCombustivel}\n` +
             `- *Status dos Testes mecânicos:* ✅ Aprovado com sucesso!\n\n` +
             `📌 *Mensagem da Oficina:* ${item.observacoes || 'Seu carro foi limpo, inspecionado e regulado. Pronto para pegar a estrada!'}\n\n` +
             `Muito obrigado pela confiança em nossa equipe! Sinta-se à vontade para nos avaliar. Dirija com total segurança! 🚗💨`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Filtragem
  const filteredCheckins = checkins.filter(c => {
    const q = searchTerm.toLowerCase();
    const clienteNome = getClienteNome(c.clienteId).toLowerCase();
    const carro = getClienteCarro(c.clienteId).toLowerCase();
    return (
      clienteNome.includes(q) ||
      carro.includes(q) ||
      c.tipo.toLowerCase().includes(q) ||
      c.operador.toLowerCase().includes(q)
    );
  });

  const receiptItem = checkins.find(c => c.id === activeReceiptId);
  const receiptCliente = receiptItem ? getCliente(receiptItem.clienteId) : null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="checkin-tab-view">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Controle de Entrada & Saída (Vistorias)
          </h2>
          <p className="text-slate-500 text-sm">
            Inspecione e documente o estado físico dos automóveis na entrada e na entrega da oficina, evitando mal-entendidos.
          </p>
        </div>
        <button
          onClick={handleOpenForm}
          id="btn-adicionar-checkin"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-blue-500/10 cursor-pointer self-start"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Lançar Entrada / Saída
        </button>
      </div>

      {/* Caixa de Busca */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar laudos por nome de cliente, carro, placa, auditor ou operador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white focus:outline-none transition"
          />
        </div>
        <div className="flex items-center justify-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 font-mono">
          {filteredCheckins.length} Laudo(s) Registrado(s)
        </div>
      </div>

      {/* Grid de Registros */}
      {filteredCheckins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="checkins-grid">
          {filteredCheckins.map((item) => {
            const isEntrada = item.tipo === 'entrada';
            return (
              <div 
                key={item.id}
                id={`checkin-card-${item.id}`}
                className="bg-white border border-slate-200 bg-gradient-to-b from-white to-blue-50/10 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition relative group"
              >
                {/* Badge do Tipo de Laudo */}
                <div className="absolute right-4 top-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-wider ${isEntrada ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isEntrada ? 'bg-emerald-500' : 'bg-blue-600'} animate-pulse`}></span>
                    {isEntrada ? 'Vistoria (Entrada)' : 'Vistoria (Saída)'}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Informação do Cliente */}
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl border ${isEntrada ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 pr-32">
                      <h3 className="font-extrabold text-slate-900 text-sm leading-tight truncate">{getClienteNome(item.clienteId)}</h3>
                      <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">{getClienteCarro(item.clienteId)}</p>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Detalhes Médicos de Entrada */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200/50 p-3 rounded-xl text-[11px] font-mono">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase text-[9px]">Data / Hora</span>
                      <span className="text-slate-700 font-extrabold mt-0.5">{item.data} a {item.hora}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-3">
                      <span className="text-slate-400 font-bold uppercase text-[9px]">Quilometragem</span>
                      <span className="text-slate-700 font-extrabold mt-0.5">{item.km.toLocaleString('pt-BR')} km</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-3">
                      <span className="text-slate-400 font-bold uppercase text-[9px]">Combustível</span>
                      <span className="text-slate-700 font-extrabold mt-0.5 flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-slate-500" />
                        {item.nivelCombustivel}
                      </span>
                    </div>
                  </div>

                  {/* Checklist Rápido Visual (4 itens) */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${item.checklist.faroisLanternas ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                      <Lightbulb className="w-3.5 h-3.5" />
                      Luzes/Seta: {item.checklist.faroisLanternas ? '✓ OK' : '⚠️ Falha'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${!item.checklist.arranhaMassa ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                      <Layers className="w-3.5 h-3.5" />
                      Pintura/Risco: {item.checklist.arranhaMassa ? '⚠️ Risco Registrado' : '✓ Sem Risco'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${item.checklist.estepeMacaco ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                      <Wrench className="w-3.5 h-3.5" />
                      Estepe/Macaco: {item.checklist.estepeMacaco ? '✓ OK' : '⚠️ Ausente'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${!item.checklist.objetosInternos ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                      <Inbox className="w-3.5 h-3.5" />
                      Cabine: {item.checklist.objetosInternos ? 'ℹ️ Contém pertences' : '✓ Limpa'}
                    </span>
                  </div>

                  {/* Observações */}
                  {item.observacoes && (
                    <p className="text-xs text-slate-500 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 italic leading-normal">
                      &ldquo;{item.observacoes}&rdquo;
                    </p>
                  )}

                  <div className="text-[10px] text-slate-405 font-mono">
                    Auditor Responsável: <strong>{item.operador}</strong>
                  </div>
                </div>

                {/* Ações Técnicas */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleWhatsAppNotify(item)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Mandar no WhatsApp
                  </button>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setActiveReceiptId(item.id)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-600 rounded-xl transition"
                      title="Imprimir Checklist Autenticado"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Deseja excluir permanentemente o laudo deste checklist?')) {
                          onDeleteCheckin(item.id);
                        }
                      }}
                      className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition"
                      title="Apagar Checklist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 p-12 text-center rounded-2xl">
          <p className="text-slate-500 text-sm">Nenhum laudo de vistoria emitido com esses critérios.</p>
          <button 
            onClick={handleOpenForm}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:text-white border text-white font-bold text-xs rounded-xl transition"
          >
            Lançar Primeira Vistoria
          </button>
        </div>
      )}

      {/* FORMULÁRIO DE CADASTRO DE CHECKIN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden" id="checkin-modal">
            
            <div className="h-1 bg-gradient-to-r from-blue-650 to-indigo-650"></div>

            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                Laudo de Vistoria (Entrada & Saída)
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* LADO ESQUERDO: Dados e Controles */}
                <div className="flex flex-col gap-4">
                  {/* Escolha do Cliente */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Selecione o Cliente & Veículo *</label>
                    <select
                      required
                      value={clienteId}
                      onChange={(e) => setClienteId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 text-xs rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    >
                      <option value="">-- Escolha o Carro Cadastrado --</option>
                      {clientes.map(cli => (
                        <option key={cli.id} value={cli.id}>
                          {cli.nome} | Carro: {cli.veiculoMarca} {cli.veiculoModelo} ({cli.veiculoPlaca})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de Operação */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Tipo de Laudo Operacional *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTipo('entrada')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${tipo === 'entrada' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Vistoria (Entrada)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipo('saida')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${tipo === 'saida' ? 'bg-blue-50 text-blue-800 border-blue-250' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        Vistoria (Saída)
                      </button>
                    </div>
                  </div>

                  {/* KM e Combustível */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-slate-400" />
                        Quilometragem (KM) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={km || ''}
                        onChange={(e) => setKm(Number(e.target.value))}
                        placeholder="Ex: 48500"
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:border-blue-600 focus:bg-white focus:outline-none transition font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-705 flex items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-slate-400" />
                        Nível Combustível *
                      </label>
                      <select
                        value={nivelCombustivel}
                        onChange={(e) => setNivelCombustivel(e.target.value as CheckInItem['nivelCombustivel'])}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      >
                        <option value="Reserva">Reserva 🛑</option>
                        <option value="1/4">1/4 do Tanque</option>
                        <option value="1/2">Meio Tanque (1/2)</option>
                        <option value="3/4">3/4 do Tanque</option>
                        <option value="Cheio">Tanque Cheio 🟢</option>
                      </select>
                    </div>
                  </div>

                  {/* Operador Auditor */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Técnico Responsável pela Auditoria *</label>
                    <input
                      type="text"
                      required
                      value={operador}
                      onChange={(e) => setOperador(e.target.value)}
                      placeholder="Nome do mecânico responsável"
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:border-blue-600 focus:bg-white focus:outline-none transition font-sans"
                    />
                  </div>
                </div>

                {/* LADO DIREITO: Itens de Checklist Visual */}
                <div className="bg-slate-55/60 p-4 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 font-mono flex items-center gap-1">
                    <ClipboardCheck className="w-4 h-4" />
                    CONDIÇÕES FÍSICAS REAIS
                  </span>

                  <p className="text-[11px] text-slate-500 leading-normal mb-1">
                    Marque os itens observados no veículo para salvar e documentar o laudo de segurança.
                  </p>

                  <div className="flex flex-col gap-3 font-sans text-xs">
                    {/* Faróis e Luzes */}
                    <label className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={faroisLanternas}
                        onChange={(e) => setFaroisLanternas(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <div>
                        <p className="font-bold text-slate-800">Faróis & Lanternas Funcionando</p>
                        <p className="text-[10px] text-slate-500">A lâmpada de faróis alto/baixo, lanternas traseiras e piscas estão funcionais e perfeitas.</p>
                      </div>
                    </label>

                    {/* Risco/Amassado */}
                    <label className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={arranhaMassa}
                        onChange={(e) => setArranhaMassa(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-rose-700">Contém Riscos / Amassados na Pintura</p>
                        <p className="text-[10px] text-slate-500">Marque se o veículo já contiver riscos relevantes nas portas, teto, capô ou para-choques.</p>
                      </div>
                    </label>

                    {/* Estepe / Macaco */}
                    <label className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={estepeMacaco}
                        onChange={(e) => setEstepeMacaco(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <div>
                        <p className="font-bold text-slate-800">Ferramental Auxiliar Presente</p>
                        <p className="text-[10px] text-slate-500">Chave de roda, triângulo de sinalização, macaco e pneu reserva estão na mala.</p>
                      </div>
                    </label>

                    {/* Pertences Pessoais */}
                    <label className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={objetosInternos}
                        onChange={(e) => setObjetosInternos(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <div>
                        <p className="font-bold text-slate-800">Recolheu pertences / Rádio de som</p>
                        <p className="text-[10px] text-slate-500">Há objetos pessoais deixados pelo proprietário na cabine (ex: notebooks, sacolas, som portátil).</p>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Observações Detalhadas */}
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700">Anotações do Laudo Histórico</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Risco na porta esquerda. Cliente relatou barulho de suspensão diária."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-600 focus:bg-white transition resize-none"
                />
              </div>

              {/* Ações */}
              <div className="border-t border-slate-150 pt-5 flex justify-end gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="submit-checkin-form"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Gravar Laudo de Vistoria
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* POPUP DE VISUALIZAÇÃO DE RECIBO AUTENTICADO DE INSPEÇÃO */}
      {activeReceiptId && receiptItem && receiptCliente && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col justify-between shadow-2xl relative overflow-hidden" id="checkin-receipt-modal">
            
            <div className="h-1 bg-gradient-to-r from-blue-650 to-indigo-650"></div>

            {/* Cabeçalho de Controle */}
            <div className="flex items-center justify-between p-4 border-b border-slate-150 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Controle de Laudo Técnico de Entrada/Saída</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir / Assinar papel
                </button>
                <button 
                  onClick={() => setActiveReceiptId(null)} 
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-720 hover:bg-slate-105 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AREA IMPRESSA EM PAPEL - WHITE CLEAN DESIGN */}
            <div className="p-8 bg-white text-slate-900 flex-1 overflow-y-auto font-sans" id="printable-checkin-area">
              
              <div className="flex justify-between items-start border-b-2 border-slate-205 pb-4">
                <div>
                  <h1 className="text-lg font-black text-blue-900 tracking-tight uppercase">{nomeOficina || 'Tech Gestor Oficina'}</h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vistoria e Controle de Segurança Automotiva</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-slate-100 font-bold border border-slate-200 text-slate-700 px-2 py-0.5 tracking-wider rounded uppercase font-mono">
                    Laudo: {receiptItem.id.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Data: {receiptItem.data} às {receiptItem.hora}</span>
                </div>
              </div>

              {/* Grid: Cliente / Veículo */}
              <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 rounded-xl p-3 border border-slate-150 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Cliente / Proprietário</span>
                  <p className="font-extrabold text-slate-800 text-sm">{receiptCliente.nome}</p>
                  <p className="text-slate-500 font-mono mt-0.5">{receiptCliente.telefone}</p>
                  <p className="text-slate-405 font-mono text-[9px]">Documento: {receiptCliente.cpfCnpj || '---'}</p>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Especificações veículo</span>
                  <p className="font-extrabold text-slate-800">{receiptCliente.veiculoMarca} {receiptCliente.veiculoModelo}</p>
                  <p className="text-slate-500">Ano: {receiptCliente.veiculoAno || '---'}</p>
                  <span className="inline-block mt-1 font-mono font-black border bg-slate-200 text-slate-800 border-slate-300 rounded px-2 text-[11px]">
                    {receiptCliente.veiculoPlaca}
                  </span>
                </div>
              </div>

              {/* Caraterísticas aferidas */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs bg-slate-50 border border-slate-200 p-3 rounded-xl font-mono">
                <div>
                  <span className="text-[9px] text-slate-405 block uppercase">Quilometragem</span>
                  <strong className="text-slate-800 text-sm">{receiptItem.km.toLocaleString()} km</strong>
                </div>
                <div className="border-l border-slate-200 pl-3">
                  <span className="text-[9px] text-slate-405 block uppercase">Combustível</span>
                  <strong className="text-slate-800 text-sm">{receiptItem.nivelCombustivel}</strong>
                </div>
                <div className="border-l border-slate-200 pl-3">
                  <span className="text-[9px] text-slate-405 block uppercase">Tipo Vistoria</span>
                  <strong className={`text-sm ${receiptItem.tipo === 'entrada' ? 'text-emerald-700' : 'text-blue-700'}`}>
                    {receiptItem.tipo === 'entrada' ? 'CHECK-IN (ENTRADA)' : 'CHECK-OUT (SAÍDA)'}
                  </strong>
                </div>
              </div>

              {/* Tabela Comparativa de Checklist */}
              <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden text-xs font-sans">
                <div className="grid grid-cols-12 bg-slate-100 py-1.5 px-3 font-bold text-slate-500 uppercase text-[9px] tracking-wider border-b border-slate-200">
                  <div className="col-span-8">Checklist e Inspeção de Segurança</div>
                  <div className="col-span-4 text-right">Aferido no Recebimento</div>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="grid grid-cols-12 py-2 px-3">
                    <div className="col-span-8 text-slate-800 font-medium">Faróis, Lanternas, Luzes de Freio, Setas</div>
                    <div className="col-span-4 text-right font-bold text-emerald-700">{receiptItem.checklist.faroisLanternas ? '✓ OK - Perfeito' : '⚠️ Detectado Luzes Queimadas/Avariado'}</div>
                  </div>
                  <div className="grid grid-cols-12 py-2 px-3">
                    <div className="col-span-8 text-slate-800 font-medium">Integridade da Lataria (Pintura, batidas ou amassados)</div>
                    <div className="col-span-4 text-right font-bold text-slate-800">{receiptItem.checklist.arranhaMassa ? '⚠️ Riscos / Amassados Registrados' : '✓ OK - Sem Riscos relevantes'}</div>
                  </div>
                  <div className="grid grid-cols-12 py-2 px-3">
                    <div className="col-span-8 text-slate-800 font-medium">Estepe de Pneu, Macaco hidráulico, Chave de Roda</div>
                    <div className="col-span-4 text-right font-bold text-emerald-700">{receiptItem.checklist.estepeMacaco ? '✓ OK - Itens Presentes' : '⚠️ Ausente ou Danificado'}</div>
                  </div>
                  <div className="grid grid-cols-12 py-2 px-3">
                    <div className="col-span-8 text-slate-800 font-medium font-sans">Pertences Pessoais recolhidos da cabine</div>
                    <div className="col-span-4 text-right font-bold text-slate-650">{receiptItem.checklist.objetosInternos ? 'ℹ️ Objetos Cadastrados' : '✓ OK - Sem pertences no interior'}</div>
                  </div>
                </div>
              </div>

              {/* Observações da Inspeção */}
              <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-150 text-xs">
                <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Observações do Mecânico</span>
                <p className="text-slate-700 leading-normal mt-1">{receiptItem.observacoes || 'Nenhum risco detectado.'}</p>
              </div>

              {/* Assinaturas */}
              <div className="mt-10 pt-8 border-t border-dashed border-slate-250 grid grid-cols-2 gap-8 text-[11px] text-center text-slate-550 font-sans">
                <div className="flex flex-col gap-1 items-center">
                  <div className="w-48 border-b border-slate-400 h-6"></div>
                  <span className="font-bold text-slate-700 uppercase mt-1">Responsável Técnico / Auditor</span>
                  <span>{receiptItem.operador}</span>
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <div className="w-48 border-b border-slate-400 h-6"></div>
                  <span className="font-bold text-slate-700 uppercase mt-1">Proprietário / Cliente</span>
                  <span>{receiptCliente.nome}</span>
                </div>
              </div>

              <div className="mt-8 text-center text-[9px] text-slate-400 italic">
                * Este documento é gerado diretamente do ERP corporativo *{nomeOficina || 'Tech Gestor'}* para fidelidade e cumprimento de regras de vistoria.
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
