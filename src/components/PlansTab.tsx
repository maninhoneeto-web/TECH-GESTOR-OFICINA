/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, 
  Award, 
  HelpCircle, 
  Cpu, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  MessageSquare,
  DollarSign,
  X,
  Settings,
  ShieldAlert,
  Building2,
  Calendar,
  Lock,
  Unlock,
  AlertTriangle,
  Layers,
  Wrench,
  User,
  Key,
  Copy,
  Share2
} from 'lucide-react';
import { PlanoSaaS, AssinaturaSaaS } from '../types';
import { PLANOS_PADRAO } from '../data';

interface PlansTabProps {
  assinatura: AssinaturaSaaS;
  onChangeAssinatura: (novaAssinatura: AssinaturaSaaS) => void;
  resellerUsername?: string;
  resellerPassword?: string;
  onUpdateCredentials?: (user: string, pass: string) => void;
}

export default function PlansTab({ 
  assinatura, 
  onChangeAssinatura,
  resellerUsername = 'admin',
  resellerPassword = '123',
  onUpdateCredentials
}: PlansTabProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlano, setSelectedPlano] = useState<PlanoSaaS | null>(null);

  // Estados para feedback táctil de links de demonstração copied
  const [copiedClient, setCopiedClient] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);

  const handleCopyLink = (url: string, type: 'client' | 'admin') => {
    navigator.clipboard.writeText(url);
    if (type === 'client') {
      setCopiedClient(true);
      setTimeout(() => setCopiedClient(false), 2000);
    } else {
      setCopiedAdmin(true);
      setTimeout(() => setCopiedAdmin(false), 2000);
    }
  };

  // Estados dos inputs de configuração do revendedor
  const [resellerOficinaName, setResellerOficinaName] = useState(assinatura.nomeOficina);
  const [resellerStatus, setResellerStatus] = useState<AssinaturaSaaS['status']>(assinatura.status);
  const [resellerPlanoId, setResellerPlanoId] = useState(assinatura.planoAtivoId);
  const [resellerVencimento, setResellerVencimento] = useState(assinatura.dataVencimento);

  // Formulário para alterar login e senha do administrador
  const [newUsername, setNewUsername] = useState(resellerUsername);
  const [newPassword, setNewPassword] = useState(resellerPassword);
  const [showCredsFeedback, setShowCredsFeedback] = useState(false);

  // Formulário de simulação de compra SaaS pelo cliente
  const [nomeOficina, setNomeOficina] = useState(assinatura.nomeOficina);
  const [numeroCartao, setNumeroCartao] = useState('4444 •••• •••• 8888');
  const [nomeTitular, setNomeTitular] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Função para salvar configurações imediatas do revendedor
  const handleSaveResellerConfig = (
    name: string, 
    status: AssinaturaSaaS['status'], 
    planoId: string, 
    vencimento: string
  ) => {
    const updatedAssinatura: AssinaturaSaaS = {
      planoAtivoId: planoId,
      status: status,
      dataVencimento: vencimento,
      nomeOficina: name || 'Oficina Cliente Desconhecida',
      cartaoMascarado: assinatura.cartaoMascarado || 'Transação Dinâmica'
    };
    onChangeAssinatura(updatedAssinatura);
  };

  const handleOpenCheckout = (plano: PlanoSaaS) => {
    setSelectedPlano(plano);
    setNomeOficina(assinatura.nomeOficina);
    setIsCheckoutOpen(true);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeOficina.trim()) {
      alert('Por favor, informe o Nome da Oficina Mecânica.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCheckoutOpen(false);
      
      const novasInfos: AssinaturaSaaS = {
        planoAtivoId: selectedPlano?.id || 'p_pro',
        status: 'active',
        dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cartaoMascarado: numeroCartao,
        nomeOficina: nomeOficina
      };

      onChangeAssinatura(novasInfos);
      setResellerOficinaName(nomeOficina);
      setResellerStatus('active');
      setResellerPlanoId(selectedPlano?.id || 'p_pro');
      alert(`🎉 Licença comprada com sucesso para a oficina "${nomeOficina}" sob o plano "${selectedPlano?.nome}"!`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="plans-tab">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
          Painel de Venda & Licenciamento SaaS
        </h2>
        <p className="text-slate-500 text-sm">
          Gerencie o faturamento das oficinas e ative ou bloqueie o sistema dos seus clientes inadimplentes.
        </p>
      </div>

      {/* ================= SEÇÃO EXCLUSIVA DE MONETIZAÇÃO E CONTROLE DO CLIENTE (MN) ================= */}
      <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-md shadow-blue-500/5 relative overflow-hidden" id="reseller-saas-control">
        <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 text-blue-50 flex items-center justify-center">
          <Settings className="w-40 h-40 stroke-[0.5]" />
        </div>

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-xl">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  ⚙️ Painel de Controle do Revendedor SaaS
                </h3>
                <p className="text-xs text-slate-500">
                  Defina o nome da oficina do seu cliente, altere os planos e teste o bloqueio de mensalidades.
                </p>
              </div>
            </div>
            <span className="self-start sm:self-center px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-black uppercase rounded-full font-mono">
              ★ Módulo Administrador Comercial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Input para o Nome da Oficina */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Nome da Oficina Mecânica *
              </label>
              <input
                type="text"
                value={resellerOficinaName}
                onChange={(e) => {
                  setResellerOficinaName(e.target.value);
                  handleSaveResellerConfig(e.target.value, resellerStatus, resellerPlanoId, resellerVencimento);
                }}
                placeholder="Ex: Auto Mecânica Ramos Sp"
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white focus:outline-none transition font-sans"
              />
              <span className="text-[10px] text-slate-400">Modifica o nome da oficina no app todo!</span>
            </div>

            {/* Selector de Status (Bloquear / Ativar) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Status da Licença Comercial *
              </label>
              <select
                value={resellerStatus}
                onChange={(e) => {
                  const s = e.target.value as AssinaturaSaaS['status'];
                  setResellerStatus(s);
                  handleSaveResellerConfig(resellerOficinaName, s, resellerPlanoId, resellerVencimento);
                }}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border font-bold transition focus:outline-none ${
                  resellerStatus === 'bloqueado' 
                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                    : resellerStatus === 'trial' 
                    ? 'bg-amber-50 border-amber-200 text-amber-700' 
                    : 'bg-emerald-50 border-emerald-500 text-emerald-800'
                }`}
              >
                <option value="active">🟢 Licença Ativa (Acesso Total)</option>
                <option value="trial">🟡 Fase de Testes (Acesso Completo)</option>
                <option value="expired">🔴 Expirada / Pendente (Bloqueada)</option>
                <option value="bloqueado">🔴 Bloqueado Administrativamente</option>
              </select>
              <span className="text-[10px] text-slate-400">Gerencia a suspensão do uso do sistema.</span>
            </div>

            {/* Seletor de Plano de Aquisição */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Plano de Venda Ativo *
              </label>
              <select
                value={resellerPlanoId}
                onChange={(e) => {
                  setResellerPlanoId(e.target.value);
                  handleSaveResellerConfig(resellerOficinaName, resellerStatus, e.target.value, resellerVencimento);
                }}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white font-bold transition"
              >
                <option value="p_starter">Plano Mensal Completo (R$ 69,90/mês)</option>
                <option value="p_pro">Plano Anual Completo (R$ 599,90/ano)</option>
              </select>
              <span className="text-[10px] text-slate-400">Modula limites e preços contratados.</span>
            </div>

            {/* Data de Vencimento da Licença */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Vencimento do Contrato
              </label>
              <input
                type="date"
                value={resellerVencimento}
                onChange={(e) => {
                  setResellerVencimento(e.target.value);
                  handleSaveResellerConfig(resellerOficinaName, resellerStatus, resellerPlanoId, e.target.value);
                }}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Data de expiração da licença recorrente.</span>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between mt-1">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-normal">
                <strong>Simulação Prática de Atraso Financeiro:</strong> Altere a Licença Comercial para <strong>🔴 Bloqueado Administrativamente</strong>. O aplicativo exibirá imediatamente o bloqueio com orientações para pagamento e liberação das atividades!
              </p>
            </div>
          </div>

          {/* Seção Extra: Alterar Login e Senha Administrativa Secreta */}
          <div className="border-t border-slate-100 pt-5 mt-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              🔐 Segurança Mestra: Alterar Login e Senha do Revendedor
            </h4>
            <p className="text-[11px] text-slate-500 mb-4">
              Altere o usuário e a senha padrão de proteção para garantir que apenas você possa acessar as configurações de licenciamento e faturamento do SaaS, mesmo se enviar o link de homologação aos seus clientes operacionais.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateCredentials) {
                  onUpdateCredentials(newUsername, newPassword);
                  setShowCredsFeedback(true);
                  setTimeout(() => setShowCredsFeedback(false), 4000);
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" />
                  Novo Usuário de Revendedor
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white focus:outline-none transition font-medium"
                  placeholder="Ex: admin"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Key className="w-3 h-3 text-slate-500" />
                  Nova Senha Secreta
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white focus:outline-none transition font-sans font-medium"
                  placeholder="Ex: minhaSenhaSecreta"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  Salvar Novas Credenciais
                </button>
              </div>
            </form>

            {showCredsFeedback && (
              <div className="mt-3 p-2.5 bg-emerald-50 text-emerald-850 text-xs font-semibold rounded-xl border border-emerald-150 flex items-center gap-2 animate-fade-in">
                <span className="text-sm">✅</span> Credenciais salvas com sucesso! Agora utilize o usuário <strong className="font-bold underline">{newUsername}</strong> e a senha <strong className="font-bold underline">{newPassword}</strong> para fazer o login.
              </div>
            )}
          </div>

          {/* Sessão: Central de Geração e Distribuição de Links Comerciais */}
          <div className="border-t border-slate-100 pt-5 mt-4 text-left">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Share2 className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              🔗 Central de Links: Como Enviar para o Seu Cliente com Segurança
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mb-4">
              Cada link abaixo é gerado dinamicamente para o seu endereço atual. Use-os para demonstrar o software, homologar parceiros ou entregar o sistema final aos donos de oficinas mecânicas.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Box 1: Link do Cliente Final */}
              <div className="p-4 bg-slate-50/55 rounded-2xl border border-slate-150 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase rounded-full self-start font-mono border border-emerald-100 shadow-sm">
                    🔒 Link Seguro do Cliente (Oficina)
                  </span>
                  <p className="text-[11px] text-slate-600 leading-normal mt-1.5">
                    <strong>Blindagem Integrada:</strong> Envie este link para o dono da oficina mecânica. Ele abre diretamente no painel de trabalho dele, <strong>OCULTANDO</strong> todos os botões de faturamento SaaS, tabela de preços e configurações do revendedor.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 mt-1">
                  <span className="text-[10px] text-slate-400 font-mono select-all truncate flex-1 leading-none py-1 overflow-x-auto whitespace-nowrap">
                    {typeof window !== 'undefined' ? `${window.location.origin}/?role=oficina&hide_switcher=true` : 'https://.../?role=oficina&hide_switcher=true'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? `${window.location.origin}/?role=oficina&hide_switcher=true` : '';
                      if (url) handleCopyLink(url, 'client');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition flex items-center gap-1 cursor-pointer shrink-0 ${
                      copiedClient 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {copiedClient ? (
                      <>
                        <Check className="w-3 h-3" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Box 2: Link Administrativo do Revendedor */}
              <div className="p-4 bg-slate-50/55 rounded-2xl border border-slate-150 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[9px] font-black uppercase rounded-full self-start font-mono border border-blue-100 shadow-sm">
                    🔑 Link Administrativo (Você)
                  </span>
                  <p className="text-[11px] text-slate-600 leading-normal mt-1.5">
                    Utilize este endereço em sua máquina ou aba privada para gerenciar o faturamento e renovar os contratos de licenciamento comercial das oficinas. Requer seu login e senha mestre para desbloquear as funções.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 mt-1">
                  <span className="text-[10px] text-slate-400 font-mono select-all truncate flex-1 leading-none py-1 overflow-x-auto whitespace-nowrap">
                    {typeof window !== 'undefined' ? `${window.location.origin}/?role=reseller` : 'https://.../?role=reseller'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? `${window.location.origin}/?role=reseller` : '';
                      if (url) handleCopyLink(url, 'admin');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition flex items-center gap-1 cursor-pointer shrink-0 ${
                      copiedAdmin 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-slate-700 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {copiedAdmin ? (
                      <>
                        <Check className="w-3 h-3" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEGMENTO COMERCIAL: COMO VENDER ESTE SaaS E LUCRAR? */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm" id="saas-sales-playbook">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-blue-100/50 hover:text-blue-100 transition duration-500">
          <Cpu className="w-36 h-36" />
        </div>

        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full font-mono">
            Playbook do SaaS de Revenda
          </span>
          <h3 className="text-lg font-extrabold text-blue-950 mt-3 flex items-center gap-2">
            Como faturar revendendo o Tech Gestor Oficina?
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
            Este aplicativo foi projetado sob medida como um **Software as a Service (SaaS)** pronto para ser comercializado. Você pode cobrar mensalidades recorrentes recorrendo a estratégias clássicas de captação de clientes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs font-mono shadow-sm">
                01
              </div>
              <h4 className="text-xs font-bold text-slate-800">Preços Recorrentes</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Cobre **R$ 69,90 mensais** ou ofereça o plano anual por **R$ 599,90/ano** para as oficinas. Com apenas 20 oficinas clientes ativas, você garante um faturamento recorrente incrível e escalável.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs font-mono shadow-sm">
                02
              </div>
              <h4 className="text-xs font-bold text-slate-800">Gatilhos de Fechamento</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Venda focando na economia! Mostre ao dono da oficina que o controle de código de barras agiliza o atendimento e evita perdas financeiras em peças de alto valor.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs font-mono shadow-sm">
                03
              </div>
              <h4 className="text-xs font-bold text-slate-800">Alta Margem de Lucro</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                O custo para hospedar esta plataforma é baixíssimo. Todo o restante arrecadado com as mensalidades é lucro líquido para seu negócio SaaS.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EXIBIÇÃO DE PLANOS SAAS EM TABELAS MODERNAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto w-full gap-6" id="plans-grid">
        {PLANOS_PADRAO.map((plano) => {
          const isAtivo = assinatura.planoAtivoId === plano.id;
          return (
            <div 
              key={plano.id}
              id={`plan-card-${plano.id}`}
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between relative transition duration-300 ${plano.recomendado ? 'border-2 border-blue-600 shadow-[0_10px_30px_rgba(59,130,246,0.08)] scale-102 lg:-translate-y-1' : 'border-slate-200 hover:border-blue-300'}`}
            >
              {/* Tag Recomendado */}
              {plano.recomendado && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-wider font-mono shadow-md">
                  ★ MAIS VENDIDO ★
                </span>
              )}

              <div className="flex flex-col gap-5">
                {/* Nome do Plano */}
                <div>
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-1.5 font-sans leading-none">
                    {plano.nome}
                    {isAtivo && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{plano.desc}</p>
                </div>

                {/* Preço */}
                <div className="py-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono tracking-wider">
                    {plano.periodo === 'mensal' ? 'Assinatura Mensal Recorrente' : 'Assinatura Anual Recorrente'}
                  </span>
                  <div className="flex items-baseline mt-1 gap-1">
                    <span className="text-xs font-bold text-slate-500">R$</span>
                    <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">{plano.preco.toFixed(2).split('.')[0]}</span>
                    <span className="text-sm font-bold text-slate-500">, {plano.preco.toFixed(2).split('.')[1]}</span>
                    <span className="text-xs text-slate-400 font-mono font-bold">
                      /{plano.periodo === 'mensal' ? 'mês' : 'ano'}
                    </span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Recursos */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Recursos da Assinatura</span>
                  {plano.recursos.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Contratação */}
              <button
                onClick={() => handleOpenCheckout(plano)}
                className={`mt-8 w-full py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition shadow-sm cursor-pointer border ${isAtivo ? 'bg-slate-50 border-slate-200 text-blue-700 hover:bg-blue-50/50' : plano.recomendado ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                {isAtivo ? 'Sua Oficina Já Licenciada' : 'Simular Licenciamento (Checkout)'}
              </button>

            </div>
          );
        })}
      </div>

      {/* MODAL CHECKOUT DE SIMULAÇÃO SaaS */}
      {isCheckoutOpen && selectedPlano && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden" id="checkout-modal">
            
            <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <Sparkles className="w-4.5 h-4.5 text-blue-600" />
                Gateway de Ativação de Licença SaaS
              </h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPurchase} className="p-6 flex flex-col gap-4">
              
              {/* Resumo do Plano Contratado */}
              <div className="bg-blue-50/40 p-3.5 rounded-xl border border-blue-100/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-600 font-bold block uppercase tracking-wider font-mono">Plano de Aquisição</span>
                  <span className="text-sm font-bold text-slate-800">{selectedPlano.nome}</span>
                </div>
                <span className="text-sm font-black text-blue-700 font-mono">
                  R$ {selectedPlano.preco.toFixed(2)}/{selectedPlano.periodo === 'mensal' ? 'mês' : 'ano'}
                </span>
              </div>

              {/* Nome da Oficina Compradora */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Nome Oficial da Oficina Mecânica *</label>
                <input
                  type="text"
                  required
                  value={nomeOficina}
                  onChange={(e) => setNomeOficina(e.target.value)}
                  placeholder="Ex: Ramos Serviços Automotivos Ltda"
                  className="bg-slate-50 border border-slate-200 text-slate-850 text-sm rounded-xl px-3.5 py-2.5 focus:border-blue-600 focus:bg-white focus:outline-none transition"
                />
              </div>

              {/* Nome do Titular */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Nome do Proprietário / Responsável Técnico</label>
                <input
                  type="text"
                  required
                  value={nomeTitular}
                  onChange={(e) => setNomeTitular(e.target.value)}
                  placeholder="Ex: ROBERTO RAMOS SILVA"
                  className="bg-slate-50 border border-slate-200 text-slate-850 text-sm rounded-xl px-3.5 py-2.5 focus:border-blue-600 focus:bg-white focus:outline-none transition uppercase"
                />
              </div>

              {/* Dados do Cartão de Crédito Falso em Visual Hacker */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3 font-mono">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Forma de Pagamento (Cartão Simulado)</span>
                </div>
                <input
                  type="text"
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-lg text-center font-bold"
                />
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 text-center">
                  <div>Venc: 10/33</div>
                  <div>Código Segurança: 348</div>
                </div>
              </div>

              {/* Botões */}
              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3 font-semibold text-xs">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  id="btn-confirmar-fake-pay"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition shadow-md cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Processando...
                    </span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      Ativar e Liberar SaaS
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
