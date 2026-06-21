/**
 * Função de auditoria executada no contexto da página web ativa.
 * Esta função não compartilha escopo com o script.js do popup.
 *
 * @param {Array<string>} selectedCriteria - IDs dos critérios selecionados na UI.
 */
function runAccessibilityAudit(selectedCriteria) {
  const results = {};

  // Inicializa o objeto de resultados para cada critério selecionado
  selectedCriteria.forEach((cid) => {
    results[cid] = { passed: true, errors: [] };
  });

  // ==========================================
  // 1. TEXTO ALTERNATIVO EM IMAGENS (1.1.1)
  // ==========================================
  if (selectedCriteria.includes('criterio-texto-alt')) {
    const images = document.querySelectorAll('img');
    let errors = [];

    images.forEach((img) => {
      // Verifica se o atributo 'alt' está ausente
      if (!img.hasAttribute('alt')) {
        const src = img.src.length > 50 ? img.src.substring(0, 50) + '...' : img.src;
        errors.push(`A imagem (src: ${src || 'N/A'}) não possui o atributo 'alt'.`);
      }
    });

    if (errors.length > 0) {
      results['criterio-texto-alt'].passed = false;
      results['criterio-texto-alt'].errors = errors;
    }
  }

  // ==========================================
  // 2. CONTRASTE MÍNIMO / CORES (1.4.3 / 1.4.1)
  // ==========================================
  if (selectedCriteria.includes('criterio-contraste')) {
    const links = document.querySelectorAll('a');
    let errors = [];

    links.forEach((link) => {
      const style = window.getComputedStyle(link);
      const isBtn =
        link.classList.contains('btn') ||
        link.classList.contains('button') ||
        link.getAttribute('role') === 'button';
      const hasText = link.innerText.trim().length > 0;

      // Critério 1.4.1: Links textuais devem possuir sublinhado (ou outra marca visual clara além da cor)
      if (style.textDecorationLine.indexOf('underline') === -1 && !isBtn && hasText) {
        // Destaque visual temporário na página
        link.style.borderBottom = '3px dotted red';
        const text = link.innerText.trim().substring(0, 30);
        errors.push(`Link textual "${text}..." não possui sublinhado (critério de uso de cores 1.4.1). Destacado na página com borda pontilhada vermelha.`);
      }
    });

    if (errors.length > 0) {
      results['criterio-contraste'].passed = false;
      results['criterio-contraste'].errors = errors;
    }
  }

  // ==========================================
  // 3. NAVEGAÇÃO POR TECLADO E FOCO (2.1.1 / 2.4.7 / 4.1.2)
  // ==========================================
  if (selectedCriteria.includes('criterio-teclado')) {
    let errors = [];

    // 3.1. Clique em elementos não focáveis
    const nonInteractiveClickables = document.querySelectorAll(
      'div[onclick], span[onclick], p[onclick], img[onclick]'
    );
    nonInteractiveClickables.forEach((el) => {
      const tabIndex = el.getAttribute('tabindex');
      const isFocusable = tabIndex !== null && parseInt(tabIndex, 10) >= 0;
      const role = el.getAttribute('role');
      const isButtonRole = role === 'button' || role === 'link' || role === 'menuitem';

      if (!isFocusable && isButtonRole) {
        errors.push(
          `O elemento <${el.tagName.toLowerCase()}> com role="${role}" e evento 'onclick' não é focável (falta tabindex="0").`
        );
      } else if (!isFocusable && !isButtonRole) {
        errors.push(
          `O elemento <${el.tagName.toLowerCase()}> possui 'onclick' mas não é nativamente interativo nem possui tabindex="0" para teclado.`
        );
      }
    });

    // 3.2. Foco visível (2.4.7)
    const interactiveSelectors = `
      a[href],
      button,
      input,
      textarea,
      select,
      [role="button"],
      [role="link"],
      [tabindex]:not([tabindex="-1"])
    `;
    const interactiveElements = document.querySelectorAll(interactiveSelectors);

    function hasFocusStyle(el) {
      const elementTag = el.tagName.toLowerCase();
      const classes = [...el.classList];
      const ids = el.id ? [`#${el.id}`] : [];
      const possibleSelectors = [elementTag, ...classes.map((c) => `.${c}`), ...ids];

      for (const sheet of document.styleSheets) {
        let rules;
        try {
          rules = sheet.cssRules;
        } catch {
          continue; // Ignora problemas de CORS com arquivos externos
        }
        if (!rules) continue;

        for (const rule of rules) {
          if (rule.selectorText && rule.selectorText.includes(':focus')) {
            for (const baseSel of possibleSelectors) {
              const fullSelector = `${baseSel}:focus`;
              if (rule.selectorText.includes(fullSelector)) {
                return true; // possui estilo customizado de foco
              }
            }
          }
        }
      }
      return false;
    }

    interactiveElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const outlineNone = style.outlineStyle === 'none' || style.outlineWidth === '0px';
      const noBoxShadow = style.boxShadow === 'none' || !style.boxShadow;
      const hasCustomFocus = hasFocusStyle(el);

      if (outlineNone && noBoxShadow && !hasCustomFocus) {
        errors.push(
          `O elemento <${el.tagName.toLowerCase()}> não apresenta um estilo de foco perceptível quando navegado por teclado.`
        );
      }
    });

    // 3.3. Estilo exclusivo de hover (2.4.7 / 2.1.1)
    const hoverSelectors = [];
    const focusSelectors = new Set();

    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      if (!rules) continue;

      for (const rule of rules) {
        if (!rule.selectorText) continue;
        const selectors = rule.selectorText.split(',');
        selectors.forEach((sel) => {
          const s = sel.trim();
          if (s.includes(':hover')) {
            const base = s.replace(':hover', '').trim();
            hoverSelectors.push({ base, full: s });
          }
          if (s.includes(':focus') || s.includes(':focus-visible')) {
            const base = s
              .replace(':focus-visible', '')
              .replace(':focus', '')
              .trim();
            focusSelectors.add(base);
          }
        });
      }
    }

    hoverSelectors.forEach(({ base, full }) => {
      if (!focusSelectors.has(base)) {
        let affectedElements = [];
        try {
          affectedElements = document.querySelectorAll(base);
        } catch {
          return;
        }

        affectedElements.forEach((el) => {
          const preview = el.outerHTML.substring(0, 40).replace(/\n/g, '');
          errors.push(
            `O seletor "${full}" estiliza o hover, mas não há estilo equivalente de foco (:focus) para o elemento "${preview}...".`
          );
        });
      }
    });

    // 3.4. Botões com nome acessível (4.1.2)
    const buttons = document.querySelectorAll(
      'button, input[type="submit"], input[type="button"], input[type="image"], [role="button"]'
    );
    let nameErrorsCount = 0;

    buttons.forEach((btn) => {
      const isVisible = !!(btn.offsetWidth || btn.offsetHeight || btn.getClientRects().length);
      const style = window.getComputedStyle(btn);
      const isHidden = style.display === 'none' || style.visibility === 'hidden';

      if (!isVisible || isHidden) return;

      const hasText = btn.innerText && btn.innerText.trim().length > 0;
      const hasAriaLabel = btn.getAttribute('aria-label') && btn.getAttribute('aria-label').trim().length > 0;
      const hasAriaLabelledBy = btn.hasAttribute('aria-labelledby');
      const hasTitle = btn.getAttribute('title') && btn.getAttribute('title').trim().length > 0;

      const isInput = btn.tagName === 'INPUT';
      const hasValue = isInput && btn.value && btn.value.trim().length > 0;
      const hasAlt = isInput && btn.type === 'image' && btn.alt && btn.alt.trim().length > 0;

      let hasImgWithAlt = false;
      const childImg = btn.querySelector('img');
      if (childImg && childImg.alt && childImg.alt.trim().length > 0) {
        hasImgWithAlt = true;
      }

      if (
        !hasText &&
        !hasAriaLabel &&
        !hasAriaLabelledBy &&
        !hasTitle &&
        !hasValue &&
        !hasAlt &&
        !hasImgWithAlt
      ) {
        btn.style.outline = '5px solid #FF00FF';
        btn.style.outlineOffset = '2px';
        nameErrorsCount++;
      }
    });

    if (nameErrorsCount > 0) {
      errors.push(
        `Encontrados ${nameErrorsCount} botões visíveis sem nome acessível (critério 4.1.2). Destacados com borda roxa neon na página.`
      );
    }

    if (errors.length > 0) {
      results['criterio-teclado'].passed = false;
      results['criterio-teclado'].errors = errors;
    }
  }

  // ==========================================
  // 4. IDIOMA DA PÁGINA DEFINIDO (3.1.1)
  // ==========================================
  if (selectedCriteria.includes('criterio-idioma')) {
    const htmlLang = document.documentElement.lang;
    if (!htmlLang || htmlLang.trim() === '') {
      results['criterio-idioma'].passed = false;
      results['criterio-idioma'].errors.push(
        "A tag principal <html> da página não possui o atributo 'lang' definido."
      );
    }
  }

  // ==========================================
  // 5. HIERARQUIA DE TÍTULOS E ESTRUTURA (1.3.1)
  // ==========================================
  if (selectedCriteria.includes('criterio-titulos')) {
    let errors = [];

    // 5.1. Semântica básica de layout
    if (!document.querySelector('header')) {
      errors.push("A página não possui uma tag estrutural <header>.");
    }
    if (!document.querySelector('nav')) {
      errors.push("A página não possui uma tag estrutural <nav> para navegação principal.");
    }
    if (!document.querySelector('main')) {
      errors.push("A página não possui uma tag estrutural <main> para o conteúdo principal.");
    }
    if (!document.querySelector('footer')) {
      errors.push("A página não possui uma tag estrutural <footer>.");
    }

    // 5.2. Hierarquia de Títulos (h1-h6)
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      if (headings[0].tagName !== 'H1') {
        errors.push(
          `O primeiro título da página é <${headings[0].tagName.toLowerCase()}>, mas deveria ser obrigatoriamente um <h1>.`
        );
      }

      let lastLevel = parseInt(headings[0].tagName.substring(1), 10);
      for (let i = 1; i < headings.length; i++) {
        const currentLevel = parseInt(headings[i].tagName.substring(1), 10);
        if (currentLevel > lastLevel + 1) {
          errors.push(
            `Quebra de hierarquia estrutural: pulo de <h${lastLevel}> diretamente para <${headings[i].tagName.toLowerCase()}> (texto: "${headings[i].innerText.substring(0, 20)}...").`
          );
        }
        lastLevel = currentLevel;
      }
    }

    // 5.3. Links sem href ou não-navegáveis (2.4.4)
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      const text = link.innerText.trim().substring(0, 25) || '[vazio]';
      if (!link.hasAttribute('href')) {
        errors.push(`O link "${text}..." é uma tag <a> mas não possui atributo 'href'.`);
      } else {
        const href = link.getAttribute('href').trim();
        if (href === '' || href === '#' || href.startsWith('javascript:')) {
          errors.push(
            `O link "${text}..." possui um destino ('href') não navegável (valor: "${href}").`
          );
        }
      }
    });

    if (errors.length > 0) {
      results['criterio-titulos'].passed = false;
      results['criterio-titulos'].errors = errors;
    }
  }

  return results;
}

// =========================================================
// Lógica de controle da extensão (Popup)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('.lista-verificacao input[type="checkbox"]');
  const auditButton = document.getElementById('auditButton');
  const progressValueEl = document.getElementById('rotulo-progresso');
  const progressBarEl = document.getElementById('barra-progresso');
  const resultsContainer = document.getElementById('container-resultados-dinamicos');

  // Atualiza o contador de progresso na inicialização e ao alterar seleções
  function updateProgressUI() {
    const checkedCount = document.querySelectorAll('.lista-verificacao input[type="checkbox"]:checked').length;
    progressValueEl.textContent = `0 / ${checkedCount}`;
    progressBarEl.value = 0;
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener('change', updateProgressUI);
  });

  updateProgressUI();

  // Executa o processo de análise ao clicar no botão
  auditButton.addEventListener('click', async () => {
    const selectedCheckboxes = Array.from(checkboxes).filter((cb) => cb.checked);
    const selectedIds = selectedCheckboxes.map((cb) => cb.id);

    if (selectedIds.length === 0) {
      resultsContainer.innerHTML = `
        <div class="result-item error" style="margin-top: 10px;">
          <div class="result-title">Erro</div>
          <div class="result-message">Selecione pelo menos um critério WCAG da lista acima para realizar a análise.</div>
        </div>
      `;
      return;
    }

    // Desabilita interface durante a verificação
    auditButton.disabled = true;
    auditButton.textContent = 'Analisando...';
    checkboxes.forEach((cb) => (cb.disabled = true));

    // Exibe indicador de carregamento nos resultados
    resultsContainer.innerHTML = `
      <div class="loading-results">
        <div class="spinner"></div>
        <div>Injetando scripts e coletando dados da página...</div>
      </div>
    `;

    try {
      // Recupera a aba do navegador atualmente ativa
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Injeta e executa a função de auditoria na página web
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: runAccessibilityAudit,
        args: [selectedIds],
      });

      const auditData = results[0].result;

      // Executa micro-animação passo a passo para simular a análise dos critérios selecionados
      let currentStep = 0;
      progressValueEl.textContent = `0 / ${selectedCheckboxes.length}`;
      progressBarEl.value = 0;

      async function runVisualSimulation() {
        if (currentStep < selectedCheckboxes.length) {
          const activeCb = selectedCheckboxes[currentStep];
          const liElement = activeCb.closest('.item-verificacao');

          // Destaque visual no item atual
          liElement.classList.add('analyzing');
          liElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          // Aguarda um pequeno delay para a simulação ficar fluida e premium
          await new Promise((resolve) => setTimeout(resolve, 500));

          liElement.classList.remove('analyzing');
          currentStep++;

          // Atualiza progresso e valor
          progressValueEl.textContent = `${currentStep} / ${selectedCheckboxes.length}`;
          progressBarEl.value = (currentStep / selectedCheckboxes.length) * 100;

          // Processa o próximo item
          runVisualSimulation();
        } else {
          // Finaliza e renderiza os resultados estruturados
          renderAuditResults(auditData, selectedIds);
          reEnableUI();
        }
      }

      // Inicia a animação sequencial
      runVisualSimulation();
    } catch (err) {
      console.error(err);
      resultsContainer.innerHTML = `
        <div class="result-item error" style="margin-top: 10px;">
          <div class="result-title">Erro na Auditoria</div>
          <div class="result-message">
            Não foi possível analisar a aba ativa.<br/>
            <strong>Motivo:</strong> A página pode ser protegida pelo sistema (ex: urls chrome://, chrome web store) ou precisa ser atualizada.
          </div>
        </div>
      `;
      reEnableUI();
    }
  });

  // Renderiza os dados finais de pontuação e os cards detalhados
  function renderAuditResults(data, selectedIds) {
    resultsContainer.innerHTML = '';

    // Calcula a pontuação com base nos critérios que passaram
    let passedCriteria = 0;
    selectedIds.forEach((id) => {
      if (data[id] && data[id].passed) {
        passedCriteria++;
      }
    });

    const score = Math.round((passedCriteria / selectedIds.length) * 100);
    const isPerfect = score === 100;

    // Placar Geral (Score Card)
    const scoreCard = document.createElement('div');
    scoreCard.className = `score-card ${isPerfect ? 'success-score' : 'error-score'}`;
    scoreCard.innerHTML = `
      <div class="score-value">${score}%</div>
      <div class="score-text">${passedCriteria} de ${selectedIds.length} critérios atendidos</div>
    `;
    resultsContainer.appendChild(scoreCard);

    // Lista Detalhada
    const resultsList = document.createElement('ul');
    resultsList.className = 'results-list';

    selectedIds.forEach((id) => {
      const labelText = document.getElementById(`${id}-rotulo`).textContent.trim();
      const critResult = data[id];

      const item = document.createElement('li');
      item.className = `result-item ${critResult.passed ? 'success' : 'error'}`;

      if (critResult.passed) {
        item.innerHTML = `
          <div class="result-title">✔ ${labelText}</div>
          <div class="result-message">Nenhum problema de acessibilidade foi detectado neste critério.</div>
        `;
      } else {
        const errorLines = critResult.errors
          .map((err) => `<li>${err}</li>`)
          .join('');

        item.innerHTML = `
          <div class="result-title">✘ ${labelText}</div>
          <div class="result-message" style="margin-top: 6px;">
            <ul style="padding-left: 18px; margin: 0; display: flex; flex-direction: column; gap: 6px;">
              ${errorLines}
            </ul>
          </div>
        `;
      }

      resultsList.appendChild(item);
    });

    resultsContainer.appendChild(resultsList);
  }

  // Reabilita os elementos de controle da UI
  function reEnableUI() {
    auditButton.disabled = false;
    auditButton.textContent = 'Analisar';
    checkboxes.forEach((cb) => (cb.disabled = false));
  }
});
