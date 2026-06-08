/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wrench, 
  FileText, 
  DollarSign, 
  Award,
  Settings,
  Menu,
  X,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  ClipboardCheck,
  Car
} from 'lucide-react';
import { AssinaturaSaaS } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  assinatura: AssinaturaSaaS;
  adminUnlocked: boolean;
  onToggleAdmin: () => void;
  onSetStatus: (status: AssinaturaSaaS['status']) => void;
  viewRole: 'reseller' | 'oficina';
  isResellerAuthenticated: boolean;
  onTriggerResellerLogin: () => void;
  onLogoutReseller: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  assinatura,
  adminUnlocked,
  onToggleAdmin,
  onSetStatus,
  viewRole,
  isResellerAuthenticated,
  onTriggerResellerLogin,
  onLogoutReseller
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const rawMenuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'veiculos', label: 'Veículos', icon: Car },
    { id: 'checkin', label: 'Check-in & Out', icon: ClipboardCheck },
    { id: 'estoque', label: 'Estoque / Barcode', icon: Package },
    { id: 'servicos', label: 'Serviços Auto', icon: Wrench },
    { id: 'orcamentos', label: 'Orçamentos', icon: FileText },
    { id: 'financeiro', label: adminUnlocked ? 'Financeiro 🔓' : 'Financeiro 🔒', icon: DollarSign },
    { id: 'planos', label: 'SaaS Reseller Hub', icon: Award },
  ];

  const menuItems = (viewRole === 'oficina' && !isResellerAuthenticated)
    ? rawMenuItems.filter(item => item.id !== 'planos')
    : rawMenuItems;

  const logoUrl = "/src/assets/images/tech_gestor_logo_1780837017980.png";

  return (
    <>
      {/* Botão Responsivo para Mobile - Branco e Azul */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 p-1 border border-blue-500/20 flex items-center justify-center">
            <img 
              src={logoUrl} 
              alt="Tech Gestor Logo" 
              className="object-contain w-full h-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = "text-blue-600 font-bold text-lg";
                  fallback.innerText = "TG";
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <div>
            <h1 className="font-extrabold text-blue-900 text-md tracking-tight">Tech Gestor Oficina</h1>
            <p className="text-xs text-blue-600 font-mono">Plataforma SaaS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Locker rápido no Mobile */}
          <button
            onClick={onToggleAdmin}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${adminUnlocked ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
          >
            {adminUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {adminUnlocked ? 'Dono' : 'Mecânico'}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            id="toggle-sidebar"
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Corporativo - Branco e Azul */}
      <aside 
        id="app-sidebar"
        className={`fixed md:sticky top-0 left-0 h-screen w-80 bg-white text-slate-700 border-r border-slate-200 flex flex-col justify-between py-6 px-4 z-40 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:block focus:outline-none'}`}
      >
        <div className="flex flex-col gap-5">
          
          {/* Logo Cabeçalho Moderno - Branco e Azul */}
          <div className="flex items-center gap-4 px-2 pb-5 border-b border-slate-200">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 blur-md group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 p-1.5 border border-blue-500/30 flex items-center justify-center">
                <img 
                  src={logoUrl} 
                  alt="Tech Gestor Logo" 
                  className="object-contain w-full h-full"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = "text-blue-600 font-bold text-xl font-mono";
                      fallback.innerText = "TG";
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-base leading-tight tracking-tight uppercase">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">Tech Gestor</span>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent block">Oficina</span>
                <span className="block text-[10px] font-mono text-slate-400 tracking-wider font-normal">SISTEMA AUTOMOTIVO</span>
              </h1>
            </div>
          </div>

          {/* Nome da Oficina Cliente do SaaS - Customizável ao vender o app */}
          <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100 mx-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-[10px] text-blue-700 uppercase tracking-widest font-black font-mono">Oficina Licenciada</p>
              </div>
              <span className={`h-2 w-2 rounded-full ${assinatura.status === 'bloqueado' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            </div>
            
            <p className="text-sm font-black text-blue-905 truncate" title={assinatura.nomeOficina}>
              {assinatura.nomeOficina || 'Nova Oficina Cliente'}
            </p>

            <div className="mt-1 flex items-center justify-between text-[10px] font-mono border-t border-blue-100/50 pt-2">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-bold uppercase ${
                assinatura.status === 'bloqueado' 
                  ? 'bg-rose-100 text-rose-700' 
                  : assinatura.status === 'trial' 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {assinatura.status === 'bloqueado' ? '🔴 Bloqueado' : assinatura.status === 'trial' ? '🟡 Fase Testes' : '🟢 Ativo'}
              </span>
              <span className="text-slate-400">Venc: {assinatura.dataVencimento}</span>
            </div>
          </div>

          {/* Controle do Perfil: Proprietário (Dono) vs Operador (Todos) */}
          <div className="mx-1 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Nível de Acesso</span>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1.5">
                {adminUnlocked ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-bold text-slate-700">
                  {adminUnlocked ? 'Proprietário (Dono)' : 'Mecânico / Operador'}
                </span>
              </div>
              <button
                onClick={onToggleAdmin}
                id="toggle-admin-access"
                className={`text-[10px] font-bold font-mono px-2 py-1 rounded transition border cursor-pointer ${
                  adminUnlocked 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' 
                    : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
                }`}
              >
                {adminUnlocked ? 'Sair Admin' : 'Entrar (1234)'}
              </button>
            </div>
          </div>

          {/* Links de Navegação - Visual Azul e Branco */}
          <nav className="flex flex-col gap-1 mt-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 group text-left border ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
                      : 'border-transparent text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 hover:border-slate-100'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Informações da Licença para Revenda */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-200 mt-2">
          
          {/* Painel do Desenvolvedor (Controle de Bloqueio Rápido do SaaS) */}
          {viewRole === 'reseller' && (
            <div className="p-3 bg-blue-900 text-white rounded-xl border border-blue-950 flex flex-col gap-1.5 animate-fade-in shadow-inner">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-wider font-mono text-blue-300 flex items-center gap-1">
                  <Settings className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  SIMULADOR DE MONETIZAÇÃO
                </h4>
              </div>
              <p className="text-[10px] text-blue-100 leading-normal">
                Simule o que acontece se o cliente atrasar a fatura mensal. Bloqueie ou libere o app:
              </p>
              
              <div className="grid grid-cols-2 gap-1.5 mt-1 font-mono text-[9px] font-bold">
                <button
                  onClick={() => {
                    onSetStatus('bloqueado');
                    alert('🔒 O sistema foi simulado como BLOQUEADO por falta de pagamento. Acesse o sistema para ver a tela de aviso que o cliente veria.');
                  }}
                  className={`py-1 rounded text-center transition cursor-pointer ${assinatura.status === 'bloqueado' ? 'bg-rose-600 text-white border border-rose-500' : 'bg-slate-900 border border-slate-800 text-rose-450 hover:bg-slate-800'}`}
                >
                  🔴 BLOQUEAR
                </button>
                <button
                  onClick={() => {
                    onSetStatus('active');
                    alert('🟢 O sistema foi simulado como LIBERADO e ativo! Licença paga restabelecida.');
                  }}
                  className={`py-1 rounded text-center transition cursor-pointer ${assinatura.status === 'active' ? 'bg-emerald-600 text-white border border-emerald-500' : 'bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800'}`}
                >
                  🟢 ATIVAR APP
                </button>
              </div>
            </div>
          )}

          {/* Sessão administrativa SaaS do Revendedor */}
          <div className="border-t border-slate-100 pt-3 mt-1 flex flex-col gap-2">
            {!isResellerAuthenticated ? (
              <button
                type="button"
                onClick={onTriggerResellerLogin}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 rounded-xl text-[11px] font-bold text-slate-500 hover:text-blue-700 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Painel de Revenda SaaS
              </button>
            ) : (
              <div className="bg-blue-50/50 border border-blue-150 p-2 rounded-xl text-center flex flex-col gap-1 shadow-sm">
                <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Unlock className="w-3 h-3 text-blue-600" /> Sessão Admin Ativa
                </span>
                <div className="flex gap-2 justify-center mt-1 font-sans">
                  <button 
                    onClick={() => {
                      setActiveTab('planos');
                      setIsOpen(false);
                    }}
                    className="text-[9px] font-extrabold text-blue-700 hover:underline cursor-pointer"
                  >
                    Ir pro Painel
                  </button>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={onLogoutReseller}
                    className="text-[9px] font-extrabold text-rose-600 hover:underline cursor-pointer"
                  >
                    Sair Admin
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-slate-400 font-mono mt-2">
            &copy; 2026 Tech Gestor Oficina v1.1
          </div>
        </div>
      </aside>

      {/* Backdrop para mobile drawer */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 md:hidden z-30 backdrop-blur-sm"
        />
      )}
    </>
  );
}
