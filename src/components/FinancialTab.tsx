/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Check, 
  X, 
  Layers, 
  Calendar,
  Sparkles,
  Lock,
  EyeOff,
  KeyRound,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Transacao } from '../types';

interface FinancialTabProps {
  transacoes: Transacao[];
  onAddTransacao: (transacao: Omit<Transacao, 'id'>) => void;
  onDeleteTransacao: (id: string) => void;
  adminUnlocked: boolean;
  onToggleAdmin: () => void;
}

export default function FinancialTab({ 
  transacoes, 
  onAddTransacao, 
  onDeleteTransacao,
  adminUnlocked,
  onToggleAdmin
}: FinancialTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Estados dos inputs de formulário
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita');
  const [categoria, setCategoria] = useState<Transacao['categoria']>('Serviço Executado');
  const [valor, setValor] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  // Cálculos financeiros
  const receitasTotais = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0);

  const despesasTotais = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0);

  const saldoLiquido = receitasTotais - despesasTotais;

  // Limpar formulário
  const resetForm = () => {
    setTipo('receita');
    setCategoria('Serviço Executado');
    setValor(0);
    setDescricao('');
    setData(new Date().toISOString().split('T')[0]);
  };

  const handleOpenForm = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (valor <= 0 || !descricao.trim()) {
      alert('Preencha o valor (maior que zero) e crie uma descrição.');
      return;
    }

    const payload = {
      tipo,
      categoria,
      valor: Number(valor),
      descricao,
      data
    };

    onAddTransacao(payload);
    setIsModalOpen(false);
    resetForm();
  };

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      onToggleAdmin();
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Filtragem das transações listadas
  const filteredTransacoes = transacoes.filter(t => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      t.descricao.toLowerCase().includes(q) || 
      t.categoria.toLowerCase().includes(q) ||
      t.tipo.toLowerCase().includes(q);

    const matchesTipo = 
      filterTipo === 'todos' || 
      t.tipo === filterTipo;

    return matchesSearch && matchesTipo;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="financial-tab">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Fluxo de Caixa e Livro Diário
          </h2>
          <p className="text-slate-500 text-sm">
            Acompanhe a lucratividade consolidada, lance despesas administrativas e fature comissões.
          </p>
        </div>
        {adminUnlocked && (
          <button
            onClick={handleOpenForm}
            id="btn-lancar-transacao"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-blue-500/10 cursor-pointer self-start"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            Lançar Registro Manual
          </button>
        )}
      </div>

      {/* VERIFICAÇÃO SE ESTÁ BLOQUEADO POR SENHA */}
      {!adminUnlocked ? (
        /* LOCK SCREEN DO LIVRO-CAIXA */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden text-center flex flex-col items-center justify-center gap-4 py-16 shadow-sm" id="financial-locked-view">
          <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 text-slate-100">
            <Lock className="w-40 h-40 stroke-[0.3]" />
          </div>
          
          <div className="p-4 bg-amber-50 text-amber-700 rounded-full border border-amber-200 inline-block animate-pulse relative z-10">
            <EyeOff className="w-8 h-8" />
          </div>

          <div className="max-w-md flex flex-col gap-2 relative z-10">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              🔒 Movimentação de Caixa Restrita ao Proprietário
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              O fluxo de caixa detalhado, faturamento acumulado, despesas operativas e lucro líquido real são dados confidenciais restritos. Digite as credenciais do dono do estabelecimento para liberar acesso.
            </p>
          </div>

          <form onSubmit={handleUnlockPin} className="flex flex-col sm:flex-row items-center gap-2 max-w-sm w-full mt-4 relative z-10">
            <div className="relative flex-1 w-full">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Insira a Senha Administrativa..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:bg-white transition ${pinError ? 'border-rose-450 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'}`}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition shadow-md w-full sm:w-auto shrink-0 cursor-pointer"
            >
              Liberar Ledger
            </button>
          </form>

          {pinError && (
            <p className="text-xs text-rose-600 font-bold mt-1 font-mono animate-shake relative z-10">
              ❌ Senha administrativa incorreta! Digite "1234".
            </p>
          )}

          <div className="mt-4 text-[11px] text-slate-450 font-mono">
            * Mn Configuração: Altere o status no menu lateral de acesso rápido
          </div>
        </div>
      ) : (
        /* LIVRE ACESSO FINANCEIRO CASO ADMIN DESTRANCADO */
        <div className="flex flex-col gap-6" id="financial-unlocked-view">
          
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 shadow-sm text-xs font-bold leading-none">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <span>Auditoria Financeira Ativa. Lançamentos de despesa, faturamentos de caixa e relatórios consolidados liberados para análise da diretoria.</span>
          </div>

          {/* Grid de Saldos (Branco e Azul) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Receitas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-505 uppercase tracking-wider">Entradas Totais (Faturamento)</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ArrowUpRight className="w-4.5 h-4.5" />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-600 mt-4 font-mono leading-none">
                +R$ {receitasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-slate-400 text-[11px] mt-2 leading-none">Vendas de peças e ordens concluídas.</p>
            </div>

            {/* Despesas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-505 uppercase tracking-wider">Saídas Totais (Despesas)</span>
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <ArrowDownLeft className="w-4.5 h-4.5" />
                </div>
              </div>
              <p className="text-3xl font-black text-rose-550 mt-4 font-mono leading-none">
                -R$ {despesasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-slate-400 text-[11px] mt-2 leading-none">Gastos operacionais e reposições de peças.</p>
            </div>

            {/* Saldo Líquido */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-505 uppercase tracking-wider">Saldo Líquido em Caixa</span>
                <div className={`p-2 rounded-xl ${saldoLiquido >= 0 ? 'bg-blue-50 text-blue-600 border border-blue-105' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  <DollarSign className="w-4.5 h-4.5" />
                </div>
              </div>
              <p className={`text-3xl font-black mt-4 font-mono leading-none ${saldoLiquido >= 0 ? 'text-blue-700' : 'text-rose-500'}`}>
                R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono font-black uppercase">
                <span className={`h-1.5 w-1.5 rounded-full ${saldoLiquido >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                <span className={saldoLiquido >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                  {saldoLiquido >= 0 ? 'Consolidado Positivo' : 'Consolidado Negativo'}
                </span>
              </div>
            </div>

          </div>

          {/* Caixa de Busca / Filtros */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar transações por descrição, categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white focus:outline-none transition"
              />
            </div>

            {/* Botões do Filtro Tipo */}
            <div className="flex items-center bg-slate-50 border border-slate-100 p-1 rounded-xl">
              {(['todos', 'receita', 'despesa'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterTipo(opt)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition capitalize cursor-pointer border ${filterTipo === opt ? 'bg-white text-blue-700 border-slate-200 shadow-sm font-black' : 'border-transparent text-slate-550 hover:text-blue-600'}`}
                >
                  {opt === 'todos' ? 'Todos' : opt === 'receita' ? 'Entradas 🟢' : 'Saídas 🔴'}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Transações (Tabela Branca e Azul) */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm" id="financial-ledger-table">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-4 px-5">Data Lançamento</th>
                    <th className="py-4 px-5">Categoria</th>
                    <th className="py-4 px-5">Descrição do Lançamento</th>
                    <th className="py-4 px-5 text-center">Tipo</th>
                    <th className="py-4 px-5 text-right">Valor Final</th>
                    <th className="py-4 px-5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTransacoes.length > 0 ? (
                    filteredTransacoes.map((t) => (
                      <tr key={t.id} id={`ledger-row-${t.id}`} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-5 font-mono text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{t.data}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                            <Layers className="w-3 h-3 text-blue-600" />
                            {t.categoria}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{t.descricao}</span>
                            {t.orcamentoId && (
                              <span className="text-[10px] text-blue-500 font-mono mt-0.5">Automático: ref. ao orçamento ID {t.orcamentoId}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded ${t.tipo === 'receita' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>
                            {t.tipo === 'receita' ? '+ ENTRADA' : '- SAÍDA'}
                          </span>
                        </td>
                        <td className={`py-3.5 px-5 text-right font-mono font-extrabold text-sm ${t.tipo === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          R$ {t.valor.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <button
                            onClick={() => {
                              if (confirm('Deseja excluir permanentemente este lançamento do livro-caixa?')) {
                                onDeleteTransacao(t.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Deletar Lançamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                        Nenhum faturamento ou despesa encontrado nos filtros ativos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Modal de Lançamentos Manuais */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden" id="financial-modal">
            
            <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 font-sans">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Lançamento em Livro-Caixa
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              
              {/* Radio Tipo (Entrada x Saida) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Classificação de Operação *</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTipo('receita');
                      setCategoria('Serviço Executado');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${tipo === 'receita' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    + Entrada Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTipo('despesa');
                      setCategoria('Peças Reposição');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${tipo === 'despesa' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    - Gasto Despesa
                  </button>
                </div>
              </div>

              {/* Categorias personalizadas */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Categoria do Lançamento *</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as Transacao['categoria'])}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  {tipo === 'receita' ? (
                    <>
                      <option value="Serviço Executado">Serviço Executado (Oficina)</option>
                      <option value="Venda de Peça">Venda de Peça</option>
                      <option value="SaaS Assinatura">SaaS Assinatura</option>
                      <option value="Outros">Outras Entradas</option>
                    </>
                  ) : (
                    <>
                      <option value="Peças Reposição">Peças Reposição / Reposição de Estoque</option>
                      <option value="Aluguel">Aluguel do Galpão</option>
                      <option value="Salários">Folha de Salários / Funcionários</option>
                      <option value="Ferramentas">Ferramentas de Mecânica</option>
                      <option value="Outros">Outras Despesas</option>
                    </>
                  )}
                </select>
              </div>

              {/* Grid: Valor e Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Valor Reais (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    placeholder="0.00"
                    className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2 focus:border-blue-600 focus:bg-white focus:outline-none transition font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-705">Data Lançamento</label>
                  <input
                    type="date"
                    required
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-850 text-xs rounded-xl px-3.5 py-2 focus:border-blue-600 focus:bg-white focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Descricao */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Descrição Detalhada *</label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Compra de Óleo Castrol"
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 focus:border-blue-600 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-550 hover:text-slate-805 hover:bg-slate-50 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="submit-transaction-form"
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Gravar Lançamento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
