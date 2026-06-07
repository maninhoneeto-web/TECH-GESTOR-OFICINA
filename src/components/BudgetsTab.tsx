/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  User, 
  Car, 
  Package, 
  Wrench, 
  Trash2, 
  X, 
  Check, 
  Printer, 
  AlertCircle,
  Eye,
  BadgeAlert,
  Percent,
  TrendingUp,
  Share2,
  MessageSquare
} from 'lucide-react';
import { Cliente, Peca, Servico, Orcamento, ItemOrcamentoPeca, ItemOrcamentoServico } from '../types';

interface BudgetsTabProps {
  orcamentos: Orcamento[];
  clientes: Cliente[];
  pecas: Peca[];
  servicos: Servico[];
  onAddOrcamento: (orcamento: Omit<Orcamento, 'id' | 'codigo' | 'dataCriacao'>) => void;
  onUpdateStatusOrcamento: (id: string, status: Orcamento['status']) => void;
  onDeleteOrcamento: (id: string) => void;
}

export default function BudgetsTab({ 
  orcamentos, 
  clientes, 
  pecas, 
  servicos, 
  onAddOrcamento, 
  onUpdateStatusOrcamento, 
  onDeleteOrcamento 
}: BudgetsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeReceiptOrcId, setActiveReceiptOrcId] = useState<string | null>(null);

  // Estados gerais do formulário de criação
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [selectedPecas, setSelectedPecas] = useState<ItemOrcamentoPeca[]>([]);
  const [selectedServicos, setSelectedServicos] = useState<ItemOrcamentoServico[]>([]);
  const [desconto, setDesconto] = useState(0);
  const [observacoes, setObservacoes] = useState('');

  // Auxiliares para adição rápida de item no formulário
  const [tempPecaId, setTempPecaId] = useState('');
  const [tempPecaQtd, setTempPecaQtd] = useState(1);
  const [tempServicoId, setTempServicoId] = useState('');

  // Limpar formulário de orçamentos
  const resetForm = () => {
    setSelectedClienteId('');
    setSelectedPecas([]);
    setSelectedServicos([]);
    setDesconto(0);
    setObservacoes('');
    setTempPecaId('');
    setTempPecaQtd(1);
    setTempServicoId('');
  };

  // Funções de manipulação do formulário
  const addPecaToBudget = () => {
    if (!tempPecaId) return;
    const pecaEncontrada = pecas.find(p => p.id === tempPecaId);
    if (!pecaEncontrada) return;

    // Verificar se peça já foi adicionada
    const index = selectedPecas.findIndex(i => i.pecaId === tempPecaId);
    if (index >= 0) {
      const novaLista = [...selectedPecas];
      novaLista[index].quantidade += Number(tempPecaQtd);
      setSelectedPecas(novaLista);
    } else {
      setSelectedPecas([
        ...selectedPecas, 
        { 
          pecaId: tempPecaId, 
          quantidade: Number(tempPecaQtd), 
          precoUnitario: pecaEncontrada.precoVenda 
        }
      ]);
    }
    setTempPecaId('');
    setTempPecaQtd(1);
  };

  const removePecaFromBudget = (index: number) => {
    setSelectedPecas(selectedPecas.filter((_, i) => i !== index));
  };

  const addServicoToBudget = () => {
    if (!tempServicoId) return;
    const servEncontrado = servicos.find(s => s.id === tempServicoId);
    if (!servEncontrado) return;

    const index = selectedServicos.findIndex(i => i.servicoId === tempServicoId);
    if (index >= 0) {
      alert('Este serviço já foi adicionado a este orçamento.');
    } else {
      setSelectedServicos([
        ...selectedServicos,
        {
          servicoId: tempServicoId,
          valorUnitario: servEncontrado.valorMaoDeObra
        }
      ]);
    }
    setTempServicoId('');
  };

  const removeServicoFromBudget = (index: number) => {
    setSelectedServicos(selectedServicos.filter((_, i) => i !== index));
  };

  // Cálculos no formulário em tempo de edição
  const subtotalPecas = selectedPecas.reduce((acc, p) => acc + (p.quantidade * p.precoUnitario), 0);
  const subtotalServicos = selectedServicos.reduce((acc, s) => acc + s.valorUnitario, 0);
  const totalGeralOriginal = subtotalPecas + subtotalServicos;
  const totalComDesconto = Math.max(0, totalGeralOriginal - desconto);

  // Informações de custo associados
  const custoPecasFormulated = selectedPecas.reduce((acc, sp) => {
    const originalP = pecas.find(p => p.id === sp.pecaId);
    return acc + (sp.quantidade * (originalP?.precoCusto || 0));
  }, 0);
  
  // Lucro líquido aproximado deste orçamento específico sendo montado
  const lucroEstimadoFormulated = totalComDesconto - custoPecasFormulated;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClienteId) {
      alert('Selecione o cliente proprietário do veículo.');
      return;
    }

    if (selectedPecas.length === 0 && selectedServicos.length === 0) {
      alert('Adicione pelo menos uma peça em estoque ou um serviço para gerar orçamento.');
      return;
    }

    const payload = {
      clienteId: selectedClienteId,
      pecas: selectedPecas,
      servicos: selectedServicos,
      desconto: Number(desconto),
      valorTotal: totalComDesconto,
      status: 'Pendente' as Orcamento['status'],
      dataValidade: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 dias validade
      observacoes,
      custoTotalPecas: custoPecasFormulated,
      custoTotalMaoDeObra: subtotalServicos,
      lucroEstimado: lucroEstimadoFormulated
    };

    onAddOrcamento(payload);
    setIsFormOpen(false);
    resetForm();
  };

  // Encontrar nomes para exibição na listagem
  const getClienteNome = (cliId: string) => {
    const cli = clientes.find(c => c.id === cliId);
    return cli ? cli.nome : 'Cliente Não Cadastrado';
  };

  const getClientePlaca = (cliId: string) => {
    const cli = clientes.find(c => c.id === cliId);
    return cli ? cli.veiculoPlaca : '---';
  };

  const getPecaNome = (pId: string) => {
    const p = pecas.find(peca => peca.id === pId);
    return p ? p.nome : 'Peça Indisponível';
  };

  const getServicoNome = (sId: string) => {
    const s = servicos.find(ser => ser.id === sId);
    return s ? s.descricao : 'Serviço Indisponível';
  };

  const handleSendWhatsApp = (orc: Orcamento) => {
    const cli = clientes.find(c => c.id === orc.clienteId);
    if (!cli) {
      alert('Cliente não localizado.');
      return;
    }

    const nroPecas = orc.pecas.reduce((acc, p) => acc + p.quantidade, 0);
    const nroServicos = orc.servicos.length;

    const msg = `Olá *${cli.nome}*!\n` +
                `Aqui é da oficina. Segue o orçamento *${orc.codigo}* para seu veículo *${cli.veiculoMarca} ${cli.veiculoModelo}* (Placa: *${cli.veiculoPlaca}*):\n\n` +
                `📋 *Resumo Técnico de Serviços & Peças*:\n` +
                `- Peças Lançadas: ${nroPecas} item(ns) no total\n` +
                `- Mão de Obra: ${nroServicos} serviço(s) listado(s)\n` +
                (orc.desconto > 0 ? `- Desconto Técnico: R$ ${orc.desconto.toFixed(2)}\n` : '') +
                `- *VALOR TOTAL DO SERVIÇO:* R$ ${orc.valorTotal.toFixed(2)}\n\n` +
                `📌 *Diagnóstico Inicial:* ${orc.observacoes || 'Aguardando verificação completa.'}\n\n` +
                `Se você precisar debater possíveis alterações no orçamento, ajustar alguma peça ou obter mais informações diagnósticas, por favor responda aqui. Estamos prontos para adequar o serviço ao seu planejamento!\n\n` +
                `Podemos aprovar o início das vistorias e reparos?`;

    const cleanPhone = cli.telefone.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;
    const url = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Filtro Busca Orçamentos
  const filteredOrcamentos = orcamentos.filter(o => {
    const q = searchTerm.toLowerCase();
    const clienteNome = getClienteNome(o.clienteId).toLowerCase();
    const clientePlaca = getClientePlaca(o.clienteId).toLowerCase();
    return (
      clienteNome.includes(q) ||
      clientePlaca.includes(q) ||
      o.codigo.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  // Orcamento ativo para visualização da nota de orçamento
  const receiptOrc = orcamentos.find(o => o.id === activeReceiptOrcId);
  const receiptCliente = receiptOrc ? clientes.find(c => c.id === receiptOrc.clienteId) : null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="budgets-tab">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full inline-block"></span>
            Emissor de Orçamentos
          </h2>
          <p className="text-slate-400 text-sm">
            Gere ordens de serviço e orçamentos transparentes, calculando rentabilidades em tempo real.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            id="btn-criar-orcamento"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl transition duration-300 shadow-md shadow-cyan-500/10 cursor-pointer self-start animate-fade-in"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            Gerar Novo Orçamento
          </button>
        )}
      </div>

      {/* FORMULÁRIO DE EMISSÃO DE NOVO ORÇAMENTO */}
      {isFormOpen && (
        <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 animate-slide-in relative" id="budget-creator-form">
          <button 
            onClick={() => {
              setIsFormOpen(false);
              resetForm();
            }}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pb-4 border-b border-slate-900">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 rounded-2xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-200 text-md">Painel Gerador de Orçamento</h3>
              <p className="text-xs text-slate-500 font-mono">INSIRA OS ELEMENTOS ABAIXO PARA O VEÍCULO DO CLIENTE</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Esquerda: Escolha Cliente, Peca, Servico */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              
              {/* Cliente Selector */}
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900/80 flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">1. Proprietário & Automóvel *</label>
                <select
                  required
                  value={selectedClienteId}
                  onChange={(e) => setSelectedClienteId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl py-2.5 px-3.5 focus:border-cyan-500 focus:outline-none transition cursor-pointer"
                >
                  <option value="">-- Selecione o Cliente Cadastrado --</option>
                  {clientes.map(cli => (
                    <option key={cli.id} value={cli.id}>
                      {cli.nome} | Carro: {cli.veiculoMarca} {cli.veiculoModelo} ({cli.veiculoPlaca})
                    </option>
                  ))}
                </select>
              </div>

              {/* Adição de Peças */}
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900/80 flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">2. Injetar Peças do Estoque</label>
                <div className="flex gap-2.5">
                  <select
                    value={tempPecaId}
                    onChange={(e) => setTempPecaId(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-350 text-xs rounded-xl py-2 px-3 focus:outline-none"
                  >
                    <option value="">Selecione Peça para Adicionar...</option>
                    {pecas.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} | Estoque ({p.quantidade} un) - Preço: R$ {p.precoVenda.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  
                  {/* Qtde */}
                  <input
                    type="number"
                    min="1"
                    placeholder="Qtd"
                    value={tempPecaQtd}
                    onChange={(e) => setTempPecaQtd(Number(e.target.value))}
                    className="w-16 bg-slate-950 border border-slate-800 text-slate-200 text-center text-xs rounded-xl py-2"
                  />

                  <button
                    type="button"
                    onClick={addPecaToBudget}
                    className="px-4 py-2 bg-slate-950 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/40 rounded-xl text-xs font-bold transition"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Tabela de Peças Selecionadas */}
                {selectedPecas.length > 0 && (
                  <div className="mt-2 bg-slate-950 border border-slate-900 rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-12 bg-slate-900 py-2 px-3 font-bold text-slate-400 uppercase tracking-wider text-[9px] text-center border-b border-slate-905">
                      <div className="col-span-6 text-left">Peça</div>
                      <div className="col-span-2">Qtd</div>
                      <div className="col-span-2">Unitário</div>
                      <div className="col-span-2">Ação</div>
                    </div>
                    <div className="divide-y divide-slate-900/60 font-mono">
                      {selectedPecas.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 py-2.5 px-3 items-center text-center">
                          <div className="col-span-6 text-left font-sans text-slate-300 font-semibold">{getPecaNome(item.pecaId)}</div>
                          <div className="col-span-2 text-slate-100">{item.quantidade}</div>
                          <div className="col-span-2 text-cyan-400/90">R$ {item.precoUnitario.toFixed(2)}</div>
                          <div className="col-span-2">
                            <button 
                              type="button" 
                              onClick={() => removePecaFromBudget(idx)}
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1 rounded"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Adição de Serviços */}
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900/80 flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">3. Checklist de Mão de Obra</label>
                <div className="flex gap-2.5">
                  <select
                    value={tempServicoId}
                    onChange={(e) => setTempServicoId(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-350 text-xs rounded-xl py-2 px-3 focus:outline-none"
                  >
                    <option value="">Selecione Mão de Obra...</option>
                    {servicos.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.descricao} | Valor Mão de Obra: R$ {s.valorMaoDeObra.toFixed(2)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={addServicoToBudget}
                    className="px-4 py-2 bg-slate-950 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/40 rounded-xl text-xs font-bold transition"
                  >
                    Aplicar Mão de Obra
                  </button>
                </div>

                {/* Tabela de Serviços Selecionados */}
                {selectedServicos.length > 0 && (
                  <div className="mt-2 bg-slate-950 border border-slate-900 rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-12 bg-slate-900 py-2 px-3 font-bold text-slate-400 uppercase tracking-wider text-[9px] text-center border-b border-slate-905">
                      <div className="col-span-8 text-left">Mão de Obra</div>
                      <div className="col-span-2">Preço Fixo</div>
                      <div className="col-span-2">Ação</div>
                    </div>
                    <div className="divide-y divide-slate-900/60 font-mono">
                      {selectedServicos.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 py-2.5 px-3 items-center text-center">
                          <div className="col-span-8 text-left font-sans text-slate-300 font-semibold">{getServicoNome(item.servicoId)}</div>
                          <div className="col-span-2 text-cyan-400/90">R$ {item.valorUnitario.toFixed(2)}</div>
                          <div className="col-span-2">
                            <button 
                              type="button" 
                              onClick={() => removeServicoFromBudget(idx)}
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1 rounded"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Observações */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Observações adicionais para nota de serviço</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Escreva termos de garantia, detalhes técnicos, peças fornecidas pelo cliente ou problemas específicos já identificados..."
                  rows={2}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3.5 py-2.5 focus:border-cyan-500 focus:outline-none transition resize-none"
                />
              </div>

            </div>

            {/* Direita: Totalizador Financeiro & Lucros */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-3 border-b border-slate-800">
                  Resumo Financeiro & Lucro
                </h4>

                <div className="flex flex-col gap-2 font-mono text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal Peças:</span>
                    <span className="text-slate-200">R$ {subtotalPecas.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal Mão de Obra:</span>
                    <span className="text-slate-200">R$ {subtotalServicos.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Soma das Tabelas:</span>
                    <span className="text-slate-200">R$ {totalGeralOriginal.toFixed(2)}</span>
                  </div>
                </div>

                <hr className="border-slate-800" />

                {/* Desconto */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400">Desconto Comercial (R$)</label>
                    <span className="text-[10px] text-amber-500 font-mono">Dar descontos reduz sua margem</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="5.00"
                    placeholder="0.00"
                    value={desconto}
                    onChange={(e) => setDesconto(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 text-amber-500 text-sm font-semibold rounded-xl py-2 px-3 focus:outline-none"
                  />
                </div>

                {/* Margem Bruta Indicador de Risco no Orçamento */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      Lucro Líquido Estimado:
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">+R$ {lucroEstimadoFormulated.toFixed(2)}</span>
                  </div>
                  {desconto > 0 && lucroEstimadoFormulated < (totalComDesconto * 0.25) && (
                    <div className="mt-2 text-[10px] text-amber-400 flex items-start gap-1 font-sans leading-tight">
                      <BadgeAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>Alerta de Rentabilidade! Desconto concedido está reduzindo excessivamente os lucros deste serviço.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões do Form */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="text-center pb-2.5">
                  <span className="text-[10px] text-slate-500 font-mono">Valor Total Final a Pagar</span>
                  <p className="text-2xl font-black text-cyan-400 font-mono">R$ {totalComDesconto.toFixed(2)}</p>
                </div>
                
                <button
                  type="submit"
                  id="submit-budget-form"
                  className="w-full text-center py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-md"
                >
                  Confirmar e Emitir Orçamento
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-950 rounded-xl transition border border-transparent hover:border-slate-800"
                >
                  Descartar Alterações
                </button>
              </div>

            </div>

          </form>
        </div>
      )}

      {/* LISTA DE ORÇAMENTOS EMITIDOS */}
      {!isFormOpen && (
        <>
          {/* Busca de notas */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Filtrar por nome de cliente, placa de veículo, código (ORC-...) ou status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 text-slate-100 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none transition animate-fade-in"
              />
            </div>
            <div className="flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
              {filteredOrcamentos.length} Orçamentos Registrados
            </div>
          </div>

          {/* GRID DE LISTAGEM */}
          {filteredOrcamentos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="budgets-grid">
              {filteredOrcamentos.map((orc) => (
                <div 
                  key={orc.id} 
                  id={`budget-card-${orc.id}`}
                  className="bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition duration-200"
                >
                  <div className="flex flex-col gap-4">
                    {/* Header: Código & Status badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2.5 py-1 border border-cyan-500/20 rounded-md">
                        {orc.codigo}
                      </span>
                      
                      {/* Badge do Status atual */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider text-bold uppercase ${orc.status === 'Pendente' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : orc.status === 'Aprovado' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : orc.status === 'Concluido' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'}`}>
                        {orc.status}
                      </span>
                    </div>

                    <hr className="border-slate-900" />

                    {/* Cliente e Carro */}
                    <div className="flex flex-col gap-1.5 leading-tight">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Proprietário</span>
                      <p className="text-slate-205 text-sm font-bold truncate">{getClienteNome(orc.clienteId)}</p>
                      
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                        <span>Carro Placa:</span>
                        <span className="font-mono text-slate-200 uppercase font-bold text-[10px]">{getClientePlaca(orc.clienteId)}</span>
                      </div>
                    </div>

                    {/* Resumos quantias */}
                    <div className="flex justify-between bg-slate-900/40 border border-slate-900/60 p-3 rounded-xl">
                      <div className="text-[10px] text-slate-500 font-mono leading-tight">
                        <p>{orc.pecas.length} categoria de Peças</p>
                        <p className="mt-1">{orc.servicos.length} Mão de Obra(s)</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-cyan-500 font-bold block font-mono">VALOR REAIS</span>
                        <span className="text-base font-extrabold text-cyan-400 font-mono">R$ {orc.valorTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Inteligentes e Botão Ver Nota */}
                  <div className="mt-5 pt-3.5 border-t border-slate-900 flex items-center justify-between">
                    
                    {/* Alteradores de Status do Fluxo da Oficina */}
                    <div className="flex items-center gap-1">
                      {orc.status === 'Pendente' && (
                        <>
                          <button
                            onClick={() => onUpdateStatusOrcamento(orc.id, 'Aprovado')}
                            className="bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-slate-950 border border-blue-500/20 px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => onUpdateStatusOrcamento(orc.id, 'Rejeitado')}
                            className="bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-slate-950 border border-rose-500/20 px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Rejeitar
                          </button>
                        </>
                      )}
                      
                      {orc.status === 'Aprovado' && (
                        <button
                          onClick={() => onUpdateStatusOrcamento(orc.id, 'Concluido')}
                          className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Concluir Serviço
                        </button>
                      )}

                      {orc.status === 'Concluido' && (
                        <span className="text-[10px] text-emerald-400 font-semibold font-mono flex items-center gap-1">
                          ✓ Baixa Lançada
                        </span>
                      )}
                    </div>

                    {/* Botões visibilidade de Impressão */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleSendWhatsApp(orc)}
                        className="p-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:text-emerald-500 rounded-lg transition"
                        title="Enviar orçamento via WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                      </button>

                      <button
                        onClick={() => setActiveReceiptOrcId(orc.id)}
                        className="p-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:text-cyan-400 rounded-lg transition"
                        title="Ver Nota PDF / Recibo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza de que deseja apagar o registro deste orçamento?')) {
                            onDeleteOrcamento(orc.id);
                          }
                        }}
                        className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 rounded-lg transition"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-950 border border-dashed border-slate-800 p-12 text-center rounded-2xl animate-fade-in">
              <p className="text-slate-400 text-sm">Nenhum orçamento emitido com esses critérios.</p>
            </div>
          )}
        </>
      )}

      {/* POPUP DE VISUALIZAÇÃO DE RECIBO / DOCUMENTAÇÃO COMPLETA (PDF Mockup) */}
      {activeReceiptOrcId && receiptOrc && receiptCliente && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col justify-between shadow-2xl relative overflow-hidden" id="receipt-modal">
            
            <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

            {/* Cabeçalho de Controle do visualizador */}
            <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-slate-900/30">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Visualizador de Documentos de Serviço</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Simula impressão no browser
                    window.print();
                  }}
                  className="px-3.5 py-1.5 bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir / PDF
                </button>
                <button
                  onClick={() => {
                    alert('Link do recibo copiado para a Área de Transferência. Pronto para mandar aos clientes no WhatsApp!');
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar WhatsApp
                </button>
                <button 
                  onClick={() => setActiveReceiptOrcId(null)} 
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* NOTA DE SERVIÇO EM SI - GORGEOUS CLEAN WHITE/LIGHT DESIGN PARA IMPRESSÃO PERFEITA */}
            <div className="p-8 bg-white text-slate-900 flex-1 overflow-y-auto font-sans" id="printable-receipt-area">
              
              {/* Cabeçalho da Empresa */}
              <div className="flex justify-between items-start border-b-2 border-slate-200 pb-5">
                <div>
                  <h1 className="text-xl font-black text-cyan-600 tracking-tight uppercase">Tech Gestor Oficina</h1>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mecânica Inteligente Sustentável</p>
                  <span className="text-[10px] text-slate-400 block mt-1">Galpão Técnico Principal - CNPJ 12.345.678/0001-90</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono block">Código do Documento</span>
                  <span className="text-xl font-bold font-mono text-slate-900 uppercase tracking-widest">{receiptOrc.codigo}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Criado em: {receiptOrc.dataCriacao}</span>
                </div>
              </div>

              {/* Grid: Cliente Proprietário e Veículo */}
              <div className="grid grid-cols-2 gap-6 mt-5 bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CLIENTE / CONTATO</span>
                  <p className="font-bold text-slate-900 text-sm">{receiptCliente.nome}</p>
                  <p className="text-slate-600 font-mono">Nro: {receiptCliente.telefone}</p>
                  <p className="text-slate-600">{receiptCliente.email || 'E-mail não informado'}</p>
                  <p className="text-slate-500 font-mono text-[10px]">Doc: {receiptCliente.cpfCnpj || '---'}</p>
                </div>
                <div className="flex flex-col gap-1 border-l border-slate-200 pl-6">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">VEÍCULO / placa</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-slate-200 border border-slate-300 font-mono font-black text-xs text-slate-800 px-2.5 py-0.5 tracking-wider rounded">
                      {receiptCliente.veiculoPlaca}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1">{receiptCliente.veiculoMarca} {receiptCliente.veiculoModelo}</p>
                  <p className="text-slate-500 font-mono">Ano/Modelo: {receiptCliente.veiculoAno || '---'}</p>
                </div>
              </div>

              {/* TABELA DE COMPONENTES E MÃO DE OBRA */}
              <div className="mt-6 flex flex-col gap-5 text-xs">
                
                {/* 1. Peças Aplicadas */}
                {receiptOrc.pecas.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 pb-1 border-b border-slate-200">
                      Peças Lançadas no Serviço
                    </h4>
                    <table className="w-full text-left mt-2">
                      <thead>
                        <tr className="text-slate-400 font-bold border-b border-slate-100">
                          <th className="py-2">Item</th>
                          <th className="py-2 text-center">Quantidade</th>
                          <th className="py-2 text-right">Unitário</th>
                          <th className="py-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {receiptOrc.pecas.map((item, idx) => (
                          <tr key={idx} className="text-slate-700 font-mono text-[11px]">
                            <td className="py-2.5 font-sans font-medium text-slate-900">{getPecaNome(item.pecaId)}</td>
                            <td className="py-2.5 text-center">{item.quantidade}</td>
                            <td className="py-2.5 text-right">R$ {item.precoUnitario.toFixed(2)}</td>
                            <td className="py-2.5 text-right font-bold text-slate-900">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. Mão de obra selecionadas */}
                {receiptOrc.servicos.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 pb-1 border-b border-slate-200">
                      Mão de Obra e Checklist Técnico
                    </h4>
                    <table className="w-full text-left mt-2">
                      <thead>
                        <tr className="text-slate-400 font-bold border-b border-slate-100">
                          <th className="py-2">Serviço Realizado</th>
                          <th className="py-2 text-right">Preço Mão de Obra</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-[11px] font-mono">
                        {receiptOrc.servicos.map((item, idx) => (
                          <tr key={idx} className="text-slate-700">
                            <td className="py-2.5 font-sans font-medium text-slate-900">{getServicoNome(item.servicoId)}</td>
                            <td className="py-2.5 text-right font-bold text-slate-900">R$ {item.valorUnitario.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

              {/* Termos e Observações */}
              {receiptOrc.observacoes && (
                <div className="mt-6 bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] text-slate-500 leading-relaxed font-sans">
                  <span className="font-bold text-slate-700 block uppercase mb-0.5">Laudo Técnico & Observações:</span>
                  {receiptOrc.observacoes}
                </div>
              )}

              {/* Totalizador Financeiro Oficial */}
              <div className="mt-6 pt-4 border-t-2 border-slate-200 flex justify-end gap-16 font-mono text-xs">
                <div className="flex flex-col gap-1 text-slate-500">
                  <div className="flex justify-between w-40">
                    <span>Peças Acumulado:</span>
                    <span>R$ {receiptOrc.pecas.reduce((acc, p) => acc + (p.quantidade * p.precoUnitario), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-40">
                    <span>Mão de Obra:</span>
                    <span>R$ {receiptOrc.custoTotalMaoDeObra.toFixed(2)}</span>
                  </div>
                  {receiptOrc.desconto > 0 && (
                    <div className="flex justify-between w-40 text-rose-500">
                      <span>Desconto Especial:</span>
                      <span>-R$ {receiptOrc.desconto.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="border-slate-200 my-1" />
                  <div className="flex justify-between w-40 text-sm font-bold text-slate-900">
                    <span>TOTAL GERAL:</span>
                    <span className="text-cyan-600 font-extrabold text-base">R$ {receiptOrc.valorTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Assinaturas */}
              <div className="mt-12 flex justify-between text-[10px] text-slate-400 font-mono text-center pt-8 border-t border-dashed border-slate-200">
                <div className="w-52">
                  <div className="h-0.5 bg-slate-300 mb-2"></div>
                  <p className="font-bold text-slate-600">{receiptCliente.nome}</p>
                  <p>Autorização do Cliente</p>
                </div>
                <div className="w-52">
                  <div className="h-0.5 bg-slate-300 mb-2"></div>
                  <p className="font-bold text-slate-600">Supervisor Técnico da Oficina</p>
                  <p>Tech Gestor Oficina SaaS</p>
                </div>
              </div>

            </div>

            {/* Fechar base */}
            <div className="p-4 border-t border-slate-900 bg-slate-950 flex justify-end text-xs text-slate-500 font-mono">
              <span>Status atual: {receiptOrc.status} / Documento gerado em conformidade com o Contrato SaaS</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
