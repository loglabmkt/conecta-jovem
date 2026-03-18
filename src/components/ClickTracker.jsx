import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Gera ou recupera session_id único por sessão de navegação
function getSessionId() {
  let sid = sessionStorage.getItem('cj_session_id');
  if (!sid) {
    sid = 'cj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('cj_session_id', sid);
  }
  return sid;
}

// Detecta o tipo de dispositivo
function getDeviceType(width) {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Detecta a seção com base na posição Y absoluta
function detectSection(y) {
  const sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'elegibilidade', label: 'Requisitos' },
    { id: 'beneficios', label: 'Benefícios' },
    { id: 'inscricao', label: 'Inscrição' },
  ];
  for (const s of sections) {
    const el = document.getElementById(s.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      const absBottom = absTop + rect.height;
      if (y >= absTop && y <= absBottom) return s.label;
    }
  }
  return 'Outros';
}

// Classifica o tipo de evento com base no elemento clicado
function classifyEvent(target) {
  const text = (target.innerText || target.textContent || '').trim().toLowerCase();
  const cls = target.className || '';
  const id = target.id || '';

  // Sobe na árvore para pegar o elemento mais relevante
  let el = target;
  for (let i = 0; i < 5; i++) {
    const t = (el.innerText || el.textContent || '').trim().toLowerCase();
    if (t.includes('inscreva') || t.includes('inscrição') || id.includes('cta-primary')) {
      return 'CTA_PRIMARY';
    }
    if (t.includes('saiba mais') || t.includes('ver mais') || t.includes('saiba')) {
      return 'CTA_SECONDARY';
    }
    if (el.closest('nav') || el.tagName === 'NAV' || cls.includes('nav')) {
      return 'NAV_CLICK';
    }
    if (el.closest('[data-card]') || cls.includes('card') || cls.includes('feature')) {
      return 'CARD_CLICK';
    }
    if (!el.parentElement) break;
    el = el.parentElement;
  }

  const tag = target.tagName?.toLowerCase();
  if (tag === 'a' || tag === 'button') return 'GENERAL_CLICK';
  return 'GENERAL_CLICK';
}

// Resumo do user agent
function summarizeUA(ua) {
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
  const systems = ['Windows', 'Mac OS', 'Linux', 'Android', 'iOS'];
  const browser = browsers.find(b => ua.includes(b)) || 'Unknown';
  const os = systems.find(s => ua.includes(s)) || 'Unknown';
  return `${browser}/${os}`;
}

export default function ClickTracker() {
  useEffect(() => {
    const sessionId = getSessionId();

    const handleClick = async (e) => {
      const target = e.target;
      if (!target) return;

      // Ignora cliques dentro do painel admin
      if (window.location.pathname.includes('/admin') || window.location.search.includes('admin=true')) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const pageWidth = document.documentElement.scrollWidth;

      const xAbs = e.pageX || (e.touches?.[0]?.pageX ?? 0);
      const yAbs = e.pageY || (e.touches?.[0]?.pageY ?? 0);

      const payload = {
        session_id: sessionId,
        event_type: classifyEvent(target),
        element_tag: target.tagName?.toLowerCase() || '',
        element_text: (target.innerText || target.textContent || '').trim().slice(0, 100),
        element_id: target.id || '',
        element_class: (typeof target.className === 'string' ? target.className : '').slice(0, 200),
        x_absolute: Math.round(xAbs),
        y_absolute: Math.round(yAbs),
        x_percent: pageWidth > 0 ? parseFloat(((xAbs / pageWidth) * 100).toFixed(2)) : 0,
        y_percent: pageHeight > 0 ? parseFloat(((yAbs / pageHeight) * 100).toFixed(2)) : 0,
        viewport_width: vw,
        viewport_height: vh,
        device_type: getDeviceType(vw),
        user_agent: summarizeUA(navigator.userAgent),
        section: detectSection(yAbs),
        created_at: new Date().toISOString(),
      };

      // Fire-and-forget: não bloqueia o clique
      base44.entities.ClickEvent.create(payload).catch(() => {});
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null; // componente invisível
}