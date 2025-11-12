// Lasy Console Bridge - Template para injeção no sandbox
// Este arquivo será processado pelo apply-lasy-branding.sh

(function setupLasyConsoleBridge() {
  // Evitar múltiplas inicializações
  if (window.__lasyBridgeInitialized) return;
  window.__lasyBridgeInitialized = true;

  const TARGET_ORIGIN = '*'; // Será validado no parent
  let logCounter = 0;
  let bridgeInitialized = false;

  // Função para notificar que bridge está pronto
  function notifyBridgeReady() {
    try {
      window.parent?.postMessage({ 
        __lasy: true, 
        type: 'lasy-bridge-ready' 
      }, TARGET_ORIGIN);
      console.debug('[Lasy Bridge] Ready signal sent to parent');
    } catch (error) {
      console.debug('Lasy bridge ready signal failed:', error);
    }
  }

  const publish = (evt) => {
    try {
      // Adicionar ID único e timestamp
      evt.id = 'log_' + Date.now() + '_' + (++logCounter);
      evt.timestamp = Date.now();
      
      // Sanitizar objetos grandes
      if (evt.args) {
        evt.args = evt.args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              const str = JSON.stringify(arg);
              return str.length > 1000 ? str.substring(0, 1000) + '...[truncated]' : arg;
            } catch {
              return '[Object - could not serialize]';
            }
          }
          return arg;
        });
      }
      
      // Enviar para parent via postMessage
      window.parent?.postMessage({ 
        __lasy: true, 
        type: 'sandbox-log', 
        payload: evt 
      }, TARGET_ORIGIN);
    } catch (error) {
      // Falha silenciosa para evitar loops
    }
  };

  // Função para inicializar bridge
  function initializeLasyBridge() {
    if (bridgeInitialized) return;
    bridgeInitialized = true;
    
    console.debug('[Lasy Bridge] Initializing...');
    
    // 1. CHAIN com console methods
    const consoleMethods = ['log', 'warn', 'error', 'info', 'debug'];
    consoleMethods.forEach(method => {
      const existingFunction = console[method];
      console[method] = function(...args) {
        try {
          publish({
            source: 'client-console',
            level: method,
            args: args.map(arg => {
              if (typeof arg === 'object' && arg !== null) {
                try {
                  return JSON.parse(JSON.stringify(arg));
                } catch {
                  return String(arg);
                }
              }
              return arg;
            }),
            message: args.map(arg => String(arg)).join(' '),
            type: 'console-call',
            interceptedBy: 'lasy-chain'
          });
        } catch {
          // Falha silenciosa
        }
        
        // Executar função existente
        return existingFunction.apply(console, args);
      };
    });

    // 2. CHAIN com window.onerror
    const existingWindowOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      try {
        publish({
          source: 'global-error',
          level: 'error',
          message: String(message),
          stack: error?.stack,
          url: source,
          line: lineno,
          column: colno,
          args: [String(message)],
          type: 'window-onerror',
          interceptedBy: 'lasy-chain'
        });
      } catch {
        // Falha silenciosa
      }
      
      if (existingWindowOnError) {
        return existingWindowOnError.call(window, message, source, lineno, colno, error);
      }
      return false;
    };

    // 3. Listener adicional para erros
    window.addEventListener('error', (e) => {
      try {
        publish({
          source: 'client-error',
          level: 'error',
          message: e.message,
          stack: e.error?.stack,
          url: e.filename,
          line: e.lineno,
          column: e.colno,
          args: [e.message],
          type: 'javascript-error',
          interceptedBy: 'lasy-chain'
        });
      } catch {
        // Falha silenciosa
      }
    });

    // 4. CHAIN com unhandledrejection
    const existingUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (e) => {
      const reason = e.reason;
      
      try {
        publish({
          source: 'client-promise',
          level: 'error',
          message: reason?.message || String(reason),
          stack: reason?.stack,
          args: [reason?.message || String(reason)],
          type: 'promise-rejection',
          interceptedBy: 'lasy-chain'
        });
      } catch {
        // Falha silenciosa
      }
      
      if (existingUnhandledRejection) {
        return existingUnhandledRejection.call(window, e);
      }
    };

    // 5. Listener adicional para promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      const reason = e.reason;
      try {
        publish({
          source: 'client-promise-listener',
          level: 'error',
          message: reason?.message || String(reason),
          stack: reason?.stack,
          args: [reason?.message || String(reason)],
          type: 'promise-rejection-listener',
          interceptedBy: 'lasy-chain'
        });
      } catch {
        // Falha silenciosa
      }
    });

    // 6. Log de inicialização
    publish({
      source: 'lasy-bridge',
      level: 'info',
      message: 'Lasy console logs conectado',
      args: ['Lasy console logs conectado'],
      type: 'bridge-initialized'
    });
    
    // 7. Enviar sinal de pronto para parent
    notifyBridgeReady();
    
    // 8. Enviar sinal adicional com delay para garantir que parent esteja escutando
    setTimeout(() => {
      console.log('[Lasy Bridge] Sending delayed ready signal...');
      notifyBridgeReady();
    }, 1000);
    
    console.debug('[Lasy Bridge] Initialization completed');
  }

  // Aguardar hidratação antes de inicializar
  if (document.readyState === 'loading') {
    // Aguardar DOM estar pronto
    document.addEventListener('DOMContentLoaded', () => {
      // Aguardar um pouco mais para garantir hidratação
      setTimeout(initializeLasyBridge, 250);
    });
  } else {
    // DOM já está pronto, aguardar um pouco para hidratação
    setTimeout(initializeLasyBridge, 100);
  }

  // ===== ELEMENT SELECTOR FUNCTIONALITY =====
  let elementSelectorActive = false;
  let selectorStyle = null;
  let mouseMoveHandler = null;
  let clickHandler = null;

  // Função para gerar seletor CSS único
  function generateSelector(element) {
    if (!element) return '';
    
    // Prioridade: ID > classe única > tag + posição
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      // Garantir que className seja tratado como string
      const classNameStr = typeof element.className === 'string' 
        ? element.className 
        : element.className.toString();
      const classes = classNameStr.split(' ').filter(c => c.trim() && !c.includes('lasy-highlight'));
      if (classes.length > 0) {
        return `.${classes.join('.')}`;
      }
    }
    
    // Fallback: tag + nth-child
    const tag = element.tagName.toLowerCase();
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(el => el.tagName === element.tagName);
      const index = siblings.indexOf(element) + 1;
      return `${tag}:nth-child(${index})`;
    }
    
    return tag;
  }

  // Ativar seletor de elementos (com verificações de segurança)
  function activateElementSelector() {
    console.log('[Lasy Element Selector] activateElementSelector() called');
    console.log('[Lasy Element Selector] Current state - elementSelectorActive:', elementSelectorActive, 'bridgeInitialized:', bridgeInitialized, 'document.readyState:', document.readyState);
    
    if (elementSelectorActive) {
      console.log('[Lasy Element Selector] Already active');
      return;
    }
    
    // Verificação básica de DOM - mais permissiva
    if (document.readyState === 'loading') {
      console.log('[Lasy Element Selector] Waiting for DOM to be ready...');
      setTimeout(activateElementSelector, 300);
      return;
    }
    
    // Verificação adicional de segurança - se bridge ainda não inicializou, aguardar mais um pouco
    if (!bridgeInitialized) {
      console.log('[Lasy Element Selector] Bridge not ready, waiting...');
      setTimeout(activateElementSelector, 200);
      return;
    }
    
    console.log('[Lasy Element Selector] Activating...');
    elementSelectorActive = true;
    
    // Criar estilos para highlight
    selectorStyle = document.createElement('style');
    selectorStyle.id = 'lasy-selector-style';
    selectorStyle.textContent = `
      .lasy-highlight {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
        position: relative !important;
      }
      .lasy-highlight::after {
        content: attr(data-lasy-selector);
        position: absolute;
        top: -30px;
        left: 0;
        background: #3b82f6;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
      }
    `;
    document.head.appendChild(selectorStyle);
    
    // Handler para mouseover
    mouseMoveHandler = (e) => {
      e.stopPropagation();
      
      // Remover highlight anterior
      document.querySelectorAll('.lasy-highlight').forEach(el => {
        el.classList.remove('lasy-highlight');
        el.removeAttribute('data-lasy-selector');
      });
      
      // Adicionar highlight ao elemento atual
      const selector = generateSelector(e.target);
      e.target.classList.add('lasy-highlight');
      e.target.setAttribute('data-lasy-selector', selector);
    };
    
    // Handler para click
    clickHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const selector = generateSelector(e.target);
      const elementInfo = {
        selector: selector,
        tagName: e.target.tagName.toLowerCase(),
        id: e.target.id || null,
        className: e.target.className || null,
        textContent: e.target.textContent?.substring(0, 100) || null,
        attributes: Array.from(e.target.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {})
      };
      
      // Enviar elemento selecionado para parent
      window.parent?.postMessage({
        __lasy: true,
        type: 'element-selected',
        payload: elementInfo
      }, TARGET_ORIGIN);
      
      console.log('[Lasy Element Selector] Element selected:', elementInfo);
      
      // Desativar seletor após seleção
      deactivateElementSelector();
    };
    
    // Adicionar event listeners
    document.addEventListener('mouseover', mouseMoveHandler, true);
    document.addEventListener('click', clickHandler, true);
    
    console.log('[Lasy Element Selector] Activated successfully');
  }

  // Desativar seletor de elementos
  function deactivateElementSelector() {
    if (!elementSelectorActive) return;
    
    console.log('[Lasy Element Selector] Deactivating...');
    elementSelectorActive = false;
    
    // Remover event listeners
    if (mouseMoveHandler) {
      document.removeEventListener('mouseover', mouseMoveHandler, true);
      mouseMoveHandler = null;
    }
    
    if (clickHandler) {
      document.removeEventListener('click', clickHandler, true);
      clickHandler = null;
    }
    
    // Remover highlights
    document.querySelectorAll('.lasy-highlight').forEach(el => {
      el.classList.remove('lasy-highlight');
      el.removeAttribute('data-lasy-selector');
    });
    
    // Remover estilos
    if (selectorStyle) {
      selectorStyle.remove();
      selectorStyle = null;
    }
    
    console.log('[Lasy Element Selector] Deactivated');
  }

  // Escutar comandos de ativação/desativação do parent
  window.addEventListener('message', (event) => {
    console.log('[Lasy Element Selector] Received message:', event.data.type, event.data);
    
    if (event.data.type === 'lasy-element-selector') {
      const action = event.data.action;
      console.log('[Lasy Element Selector] Processing action:', action);
      
      if (action === 'activate') {
        console.log('[Lasy Element Selector] Scheduling activation with 500ms delay...');
        // Delay para garantir hidratação completa - usuário já viu a página funcionando
        setTimeout(() => {
          console.log('[Lasy Element Selector] Executing delayed activation...');
          activateElementSelector();
        }, 500);
      } else if (action === 'deactivate') {
        console.log('[Lasy Element Selector] Deactivating immediately...');
        deactivateElementSelector();
      }
    }
    
    // Responder a pedidos de status do bridge
    if (event.data.type === 'lasy-bridge-status-request') {
      console.log('[Lasy Bridge] Status requested, sending ready signal...');
      notifyBridgeReady();
    }
  });

  console.log('[Lasy Element Selector] Initialized and ready');

  // ===== URL CHANGE DETECTION + ROUTE DISCOVERY =====
  let currentUrl = window.location.href;
  let discoveredRoutes = new Set(['/']);
  let scanTimeout = null;

  function notifyUrlChange() {
    const newUrl = window.location.href;
    if (newUrl === currentUrl) return;
    
    currentUrl = newUrl;
    const pathname = window.location.pathname;
    
    // Adicionar nova rota às descobertas
    discoveredRoutes.add(pathname);
    
    // Enviar mudança de URL
    window.parent?.postMessage({
      __lasy: true,
      type: 'url-change',
      payload: {
        fullUrl: newUrl,
        pathname: pathname,
        search: window.location.search,
        hash: window.location.hash,
        discoveredRoutes: Array.from(discoveredRoutes)
      }
    }, TARGET_ORIGIN);
    
    console.log('[Lasy URL Tracker] URL changed to:', pathname);
    
    // Agendar scan de links após mudança
    clearTimeout(scanTimeout);
    scanTimeout = setTimeout(scanPageLinks, 500);
  }

  function scanPageLinks() {
    try {
      const newRoutes = new Set();
      
      // Buscar todos os links internos na página
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '/' && !href.includes('#')) {
          // Extrair pathname limpo
          const pathname = href.split('?')[0];
          newRoutes.add(pathname);
        }
      });
      
      // Buscar links do Next.js (Link components)
      document.querySelectorAll('[href^="/"]').forEach(element => {
        const href = element.getAttribute('href');
        if (href && href !== '/' && !href.includes('#')) {
          const pathname = href.split('?')[0];
          newRoutes.add(pathname);
        }
      });
      
      // Adicionar novas rotas descobertas
      let foundNewRoutes = false;
      newRoutes.forEach(route => {
        if (!discoveredRoutes.has(route)) {
          discoveredRoutes.add(route);
          foundNewRoutes = true;
        }
      });
      
      // Notificar parent se encontrou novas rotas
      if (foundNewRoutes) {
        window.parent?.postMessage({
          __lasy: true,
          type: 'routes-discovered',
          payload: {
            discoveredRoutes: Array.from(discoveredRoutes),
            newRoutes: Array.from(newRoutes)
          }
        }, TARGET_ORIGIN);
        
        console.log('[Lasy Route Discovery] Found new routes:', Array.from(newRoutes));
      }
    } catch (error) {
      console.debug('[Lasy Route Discovery] Error scanning links:', error);
    }
  }

  // Observer para mudanças de URL (SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      notifyUrlChange();
    }
  }).observe(document, { subtree: true, childList: true });

  // Listener para popstate (back/forward)
  window.addEventListener('popstate', notifyUrlChange);

  // Scan inicial de links após carregamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(scanPageLinks, 1000);
    });
  } else {
    setTimeout(scanPageLinks, 1000);
  }

  console.log('[Lasy URL Tracker] Initialized');
})();