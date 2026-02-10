import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Image, FileText, LogOut } from 'lucide-react';
import SliderManager from '../components/admin/SliderManager';
import ConteudoManager from '../components/admin/ConteudoManager';
import PaginaManager from '../components/admin/PaginaManager';
import DashboardOverview from '../components/admin/DashboardOverview';
import { createPageUrl } from '@/utils';

export default function admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Verificar autenticação
    const authenticated = localStorage.getItem('admin_authenticated');
    const user = localStorage.getItem('admin_username');
    
    if (authenticated === 'true') {
      setIsAuthenticated(true);
      setUsername(user || 'Admin');
    } else {
      // Redirecionar para login
      window.location.href = createPageUrl('Login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    window.location.href = createPageUrl('Login');
  };

  // Não renderizar nada até verificar autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Redesenhado */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            {/* Logo + Título */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-2 shadow-md">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/41d3da78c_2c27dee22_PERFIL_04.png"
                  alt="Conecta Jovem"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 title">Conecta Jovem</h1>
                <p className="text-sm text-gray-500 font-medium">Painel de Gerenciamento</p>
              </div>
            </div>
            
            {/* User Info + Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs text-gray-500 font-medium">Bem-vindo,</p>
                <p className="text-sm font-bold text-gray-900">{username}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="slider" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Slider
            </TabsTrigger>
            <TabsTrigger value="conteudo" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Conteúdos
            </TabsTrigger>
            <TabsTrigger value="paginas" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Páginas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="slider">
            <SliderManager />
          </TabsContent>

          <TabsContent value="conteudo">
            <ConteudoManager />
          </TabsContent>

          <TabsContent value="paginas">
            <PaginaManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}