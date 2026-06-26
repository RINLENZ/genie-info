//section hero et carousel
const slides = document.querySelectorAll('.carousel-slide');
const dots   = document.querySelectorAll('.carousel-dot');
let current  = 0;
let autoPlay;

function goToSlide(n) {
  slides[current].classList.remove('active');
  if (dots.length) dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  if (dots.length) dots[current].classList.add('active');
  resetAuto();
}
function resetAuto() {
  clearInterval(autoPlay);
  autoPlay = setInterval(() => goToSlide(current + 1), 7000);
}
resetAuto();

// Parallaxe hero
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (scrollY < hero.offsetHeight) {
    document.querySelectorAll('.slide-bg[data-parallax]').forEach(bg => {
      bg.style.transform = `translateY(${scrollY * 0.25}px)`;
    });
  }
}, { passive: true });

// Animation du titre au scroll
const fullText = "Forger l'excellence numérique, bâtir l'avenir technologique";
const typeEl   = document.getElementById('typeH1');
let charIdx = 0;
let typed = false;

function typeWrite() {
  if (typed || !typeEl) return;
  typed = true;
  typeEl.textContent = '';         
  typeEl.classList.add('typewriter');
  function tick() {
    if (charIdx < fullText.length) {
      typeEl.textContent += fullText[charIdx++];
      setTimeout(tick, charIdx < 10 ? 60 : 38);
    } else {
      typeEl.classList.remove('typewriter');
    }
  }
  setTimeout(tick, 700);
}
const heroEl = document.querySelector('.hero');
if (heroEl) {
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { typeWrite(); heroObserver.disconnect(); }
  }, { threshold: 0.4 });
  heroObserver.observe(heroEl);
}

// Modal functions
      
        function openAccountModal() {
            const modalElement = document.getElementById('accountModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        }

//compteur animé
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(start);
  }, 16);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(c =>
        animateCounter(c, parseInt(c.dataset.target)));
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-ribbon').forEach(el => counterObserver.observe(el));

//scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

//nabar scroll + back to top + mobile menu position
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
// Ajuste la position du menu mobile selon la hauteur de la navbar
  if (mobileMenu) {
    mobileMenu.style.top = scrolled ? '64px' : '72px';
  }
}, { passive: true });

function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  mobileMenu.classList.toggle('open');
}

// Active nav link au scroll
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

//filtre galerie
document.querySelectorAll('.gfilter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gfilter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.gallery-item').forEach(item => {
      const itemCat = item.dataset.cat || 'all';
      const show = cat === 'all' || itemCat === cat;
      item.style.display = show ? 'block' : 'none';
    });
  });
});

//box de la galerie pour les tofs
// Synchronisation avec des images zn locales
const galleryItems = document.querySelectorAll('.gallery-item[data-cat]');
const galleryData = [];
galleryItems.forEach(item => {
  const img = item.querySelector('img');
  const title = item.querySelector('.g-title')?.textContent || '';
  const cat   = item.querySelector('.g-cat')?.textContent  || '';
  galleryData.push({
    src:   img ? img.src   : '',
    title: title,
    sub:   item.dataset.sub || '',
    cat:   cat
  });
});

let lbCurrent = 0;

function openLightbox(idx) {
  // Recalcule l'index parmi les items visibles
  const allItems = [...document.querySelectorAll('.gallery-item[data-cat]')];
  lbCurrent = idx;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function lbNav(dir) {
  lbCurrent = (lbCurrent + dir + galleryData.length) % galleryData.length;
  renderLightbox();
}
function renderLightbox() {
  if (!galleryData.length) return;
  const d = galleryData[lbCurrent];
  const lbImg = document.getElementById('lbImg');
  lbImg.src = d.src;
  lbImg.alt = d.title;
  document.getElementById('lbTitle').textContent   = d.title;
  document.getElementById('lbSub').textContent     = d.sub   || '';
  document.getElementById('lbCat').textContent     = d.cat;
  document.getElementById('lbCounter').textContent = `${lbCurrent + 1} / ${galleryData.length}`;
}
function handleLbClick(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'Escape')     closeLightbox();
});
document.querySelectorAll('.gallery-item[data-cat]').forEach((item, i) => {
  item.setAttribute('onclick', `openLightbox(${i})`);
});

//validation des formulaire
function validateField(field) {
  const rules = {
    nom:   { el: 'fNom',   grp: 'fg-nom',   test: v => v.trim().length >= 2 },
    email: { el: 'fEmail', grp: 'fg-email', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    sujet: { el: 'fSujet', grp: 'fg-sujet', test: v => v !== '' },
    msg:   { el: 'fMsg',   grp: 'fg-msg',   test: v => v.trim().length >= 20 },
  };
  const r = rules[field];
  if (!r) return;
  const el  = document.getElementById(r.el);
  const grp = document.getElementById(r.grp);
  if (!el || !grp) return;
  const valid = r.test(el.value);
  el.classList.toggle('valid',  valid);
  el.classList.toggle('error', !valid && el.value.length > 0);
  grp.classList.toggle('has-error', !valid && el.value.length > 0);
  updateProgress();
}

function updateProgress() {
  const checks = {
    nom:   () => document.getElementById('fNom')?.value.trim().length >= 2,
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('fEmail')?.value || ''),
    sujet: () => (document.getElementById('fSujet')?.value || '') !== '',
    msg:   () => document.getElementById('fMsg')?.value.trim().length >= 20,
  };
  Object.keys(checks).forEach((f, i) => {
    document.getElementById('fs' + (i + 1))?.classList.toggle('done', checks[f]());
  });
}

function submitForm() {
  ['nom','email','sujet','msg'].forEach(f => validateField(f));
  const ok = [
    document.getElementById('fNom')?.value.trim().length >= 2,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('fEmail')?.value || ''),
    (document.getElementById('fSujet')?.value || '') !== '',
    document.getElementById('fMsg')?.value.trim().length >= 20,
  ].every(Boolean);

  if (ok) {
    document.getElementById('contactForm').style.display   = 'none';
    document.getElementById('formProgress').style.display  = 'none';
    document.getElementById('formSuccess').style.display   = 'block';
  }
}

//Langue
function setLang(lang) {
  document.querySelectorAll('.lang-switcher button').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(
    `.lang-switcher button:${lang === 'fr' ? 'first' : 'last'}-child`
  );
  if (btn) btn.classList.add('active');
}

//chatbot
(function buildChat() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Chat Toggle Button ── */
    #chatToggle {
      position: fixed; bottom: 84px; right: 28px; z-index: 1100;
      width: 54px; height: 54px; border-radius: 16px;
      background: linear-gradient(135deg, #0b1f3a, #1a7a4e);
      color: #fff; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
      box-shadow: 0 8px 30px rgba(11,31,58,0.4);
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    #chatToggle:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 14px 40px rgba(11,31,58,0.5); }
    #chatToggle .chat-notif {
      position: absolute; top: -4px; right: -4px;
      width: 14px; height: 14px; background: #22a864;
      border-radius: 50%; border: 2px solid #fff;
      animation: pulse-dot 2s ease-in-out infinite;
    }
    @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:0.7} }

    /* ── Chat Panel ── */
    #chatPanel {
      position: fixed; bottom: 152px; right: 28px; z-index: 1099;
      width: 360px; max-height: 520px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(11,31,58,0.22);
      border: 1px solid rgba(11,31,58,0.08);
      display: flex; flex-direction: column;
      transform: scale(0.9) translateY(20px); opacity: 0;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      pointer-events: none;
      overflow: hidden;
    }
    #chatPanel.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

    /* Header */
    .chat-header {
      background: linear-gradient(135deg, #0b1f3a, #122d52);
      padding: 18px 20px;
      display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    .chat-avatar {
      width: 40px; height: 40px; border-radius: 12px;
      background: linear-gradient(135deg, #1a7a4e, #22a864);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; color: #fff; flex-shrink: 0;
    }
    .chat-header-info { flex: 1; }
    .chat-header-name { font-family: 'DM Sans', sans-serif; font-weight: 600; color: #fff; font-size: 0.95rem; }
    .chat-header-status {
      display: flex; align-items: center; gap: 5px;
      font-size: 0.72rem; color: rgba(255,255,255,0.55);
      font-family: 'DM Mono', monospace;
      margin-top: 2px;
    }
    .chat-header-status::before {
      content: ''; width: 7px; height: 7px; border-radius: 50%;
      background: #22a864; display: inline-block;
      animation: pulse-dot 2s ease-in-out infinite;
    }
    .chat-close-btn {
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
      color: rgba(255,255,255,0.7); width: 30px; height: 30px;
      border-radius: 8px; cursor: pointer; font-size: 0.85rem;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    .chat-close-btn:hover { background: #e74c3c; border-color: #e74c3c; color: #fff; }

    /* Messages */
    .chat-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      scroll-behavior: smooth;
      background: #f7f5f0;
    }
    .chat-messages::-webkit-scrollbar { width: 4px; }
    .chat-messages::-webkit-scrollbar-thumb { background: rgba(11,31,58,0.15); border-radius: 4px; }

    .chat-msg { display: flex; flex-direction: column; max-width: 80%; animation: msgIn 0.3s ease; }
    @keyframes msgIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
    .chat-msg.bot { align-self: flex-start; }
    .chat-msg.user { align-self: flex-end; }

    .chat-bubble {
      padding: 10px 14px; border-radius: 14px;
      font-size: 0.87rem; line-height: 1.55;
      font-family: 'DM Sans', sans-serif;
    }
    .chat-msg.bot .chat-bubble {
      background: #fff; color: #1a1f2e;
      border: 1px solid #ece9e2;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 8px rgba(11,31,58,0.06);
    }
    .chat-msg.user .chat-bubble {
      background: linear-gradient(135deg, #0b1f3a, #1a4a7a);
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .chat-time {
      font-family: 'DM Mono', monospace;
      font-size: 0.62rem; color: #9ca3af; margin-top: 4px;
      padding: 0 2px;
    }
    .chat-msg.user .chat-time { text-align: right; }

    /* Quick replies */
    .chat-quick-wrap {
      padding: 8px 16px 0;
      display: flex; flex-wrap: wrap; gap: 6px;
      background: #f7f5f0;
    }
    .chat-quick {
      background: #fff; border: 1.5px solid rgba(11,31,58,0.12);
      color: #0b1f3a; font-size: 0.75rem; padding: 6px 14px;
      border-radius: 100px; cursor: pointer; font-family: 'DM Sans', sans-serif;
      font-weight: 500; transition: all 0.2s; white-space: nowrap;
    }
    .chat-quick:hover { background: #0b1f3a; color: #fff; border-color: #0b1f3a; }

    /* Typing indicator */
    .chat-typing { display: flex; gap: 5px; align-items: center; padding: 10px 14px; }
    .chat-typing span {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(11,31,58,0.25);
      animation: typing 1.2s ease-in-out infinite;
    }
    .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:0.3} 30%{transform:translateY(-6px);opacity:1} }

    /* Input */
    .chat-input-area {
      padding: 12px 14px;
      border-top: 1px solid #ece9e2;
      display: flex; gap: 8px; align-items: flex-end;
      background: #fff;
      flex-shrink: 0;
    }
    #chatInput {
      flex: 1; border: 1.5px solid #ece9e2; border-radius: 12px;
      padding: 10px 14px; font-size: 0.87rem;
      font-family: 'DM Sans', sans-serif; color: #1a1f2e;
      resize: none; outline: none; max-height: 100px;
      transition: border-color 0.2s; background: #f7f5f0;
      line-height: 1.4;
    }
    #chatInput:focus { border-color: #0b1f3a; background: #fff; }
    #chatInput::placeholder { color: #9ca3af; }
    #chatSend {
      width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
      background: #0b1f3a; color: #fff; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.95rem; transition: all 0.2s;
    }
    #chatSend:hover { background: #1a7a4e; transform: scale(1.05); }
    #chatSend:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    /* Responsive chat */
    @media (max-width: 480px) {
      #chatPanel { width: calc(100vw - 32px); right: 16px; bottom: 140px; }
      #chatToggle { right: 16px; bottom: 76px; }
    }
  `;
  document.head.appendChild(style);

  // HTML du widget
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button id="chatToggle" title="Chat avec nous" aria-label="Ouvrir le chat">
      <i class="fas fa-comment-dots"></i>
      <div class="chat-notif"></div>
    </button>
    <div id="chatPanel" role="dialog" aria-label="Chat du département">
      <div class="chat-header">
        <div class="chat-avatar"><i class="fas fa-robot"></i></div>
        <div class="chat-header-info">
          <div class="chat-header-name">Assistant GI · ENSET Ebolowa</div>
          <div class="chat-header-status">En ligne · Répond instantanément</div>
        </div>
        <button class="chat-close-btn" onclick="toggleChat()" aria-label="Fermer"><i class="fas fa-times"></i></button>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-quick-wrap" id="chatQuickReplies"></div>
      <div class="chat-input-area">
        <textarea id="chatInput" rows="1" placeholder="Posez votre question…" aria-label="Message"></textarea>
        <button id="chatSend" aria-label="Envoyer"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // Données du chatbot
  const FAQ = [
    {
      keys: ['admission','inscrip','candidat','dossier','postul'],
      answer: 'Les inscriptions 2025–2026 sont ouvertes jusqu\'au <strong>30 juin 2025</strong>. Vous pouvez déposer votre dossier directement au secrétariat du département ou par email à <strong>depginfo@enset-ebolowa.cm</strong>. Les pièces requises : relevés de notes, acte de naissance, lettre de motivation.'
    },
    {
      keys: ['formation','programme','dipet','bts','master','licence','tic'],
      answer: 'Nous proposons <strong>6 formations</strong> : DIPET 1 (Info. Fondamentale & Industrielle), DIPET 2, BTS Informatique, Licence Pro Informatique Industrielle, TIC, et Master Recherche. Consultez la section Formations pour les détails complets.'
    },
    {
      keys: ['frais','scolarit','cout','prix','tarif','payer'],
      answer: ' Les frais de scolarité varient selon le niveau et le statut (public/privé). Pour les détails officiels, contactez le secrétariat au <strong>+237 692 581 157</strong> ou par email. Des bourses sont disponibles pour les étudiants méritants.'
    },
    {
      keys: ['contact','telephone','email','adresse','lieu','localisation'],
      answer: 'Vous pouvez nous joindre :\n<strong>Tél :</strong> +237 692 581 157\n<strong>Email :</strong> depginfo@enset-ebolowa.cm\n<strong>Adresse :</strong> ENSET d\'Ebolowa, Sud-Cameroun\n<strong>Horaires :</strong> Lun–Ven 08h–17h'
    },
    {
      keys: ['equipe','enseignant','professeur','chef','departement'],
      answer: 'Notre corps enseignant est composé de docteurs et maîtres de conférences spécialisés en IA, systèmes embarqués, réseaux, bases de données et génie logiciel. Le département est dirigé par <strong>Pr. Olle Olle Daniel</strong>, expert en Data Analysis et IA.'
    },
    {
      keys: ['labo','laboratoire','equipement','salle','tp'],
      answer: 'Nos laboratoires sont équipés pour : systèmes embarqués & IoT, réseaux informatiques, développement logiciel, robotique, et intelligence artificielle. Les TPs sont organisés en petits groupes pour un apprentissage efficace.'
    },
    {
      keys: ['master','recherche','these','doctorat'],
      answer: 'Le Master Recherche en Informatique prépare aux métiers de chercheur et ingénieur R&D. Durée : 2 ans (M1 + M2). Seulement <strong>7 places</strong> disponibles. Les thématiques couvrent l\'IA, l\'IoT, les systèmes distribués et la robotique.'
    },
    {
      keys: ['bourse','aide','financement','boursier'],
      answer: 'Des aides financières sont disponibles : bourses d\'excellence sur critères académiques, aides sociales, et partenariats avec des entreprises locales. Renseignez-vous auprès du secrétariat du département.'
    },
    {
      keys: ['stage','emploi','insertion','entreprise','travail'],
      answer: ' Notre taux d\'insertion professionnelle est supérieur à 80%. Nous avons des partenariats avec des entreprises du secteur numérique et industriel. Le département organise chaque année des forums emploi et facilite les stages en entreprise.'
    },
  ];

  const quickReplies = [
    { label: 'Admissions', text: 'Comment faire une admission ?' },
    { label: 'Formations', text: 'Quelles formations proposez-vous ?' },
    { label: 'Frais', text: 'Quels sont les frais de scolarité ?' },
    { label: 'Contact', text: 'Comment vous contacter ?' },
    { label: 'Stages', text: 'Y a-t-il des stages disponibles ?' },
  ];

  let chatOpen = false;
  let typingTimeout;

  function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  }

  function addMessage(text, who, typing = false) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `chat-msg ${who}`;
    if (typing) {
      div.innerHTML = `<div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>`;
      div.id = 'chatTyping';
    } else {
      div.innerHTML = `<div class="chat-bubble">${text}</div><div class="chat-time">${getTime()}</div>`;
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function botReply(userText) {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    input.disabled = true;
    sendBtn.disabled = true;

    const lower = userText.toLowerCase();
    let answer = 'Je n\'ai pas bien compris votre question. Essayez de préciser, ou contactez-nous directement au <strong>+237 692 581 157</strong> ou à <strong>depginfo@enset-ebolowa.cm</strong>.';

    for (const item of FAQ) {
      if (item.keys.some(k => lower.includes(k))) {
        answer = item.answer;
        break;
      }
    }

// imite le bot qui "tape" sa réponse
addMessage('', 'bot', true);
const delay = 800 + Math.random() * 600;
typingTimeout = setTimeout(() => {
      document.getElementById('chatTyping')?.remove();
      addMessage(answer.replace(/\n/g, '<br>'), 'bot');
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }, delay);
  }

  function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('chatQuickReplies').innerHTML = '';
    botReply(text);
  }

  window.toggleChat = function() {
    chatOpen = !chatOpen;
    document.getElementById('chatPanel').classList.toggle('open', chatOpen);
    const notif = document.querySelector('#chatToggle .chat-notif');
    if (chatOpen) {
      if (notif) notif.style.display = 'none';
      document.getElementById('chatInput').focus();
    }
  };

  // Bouton toggle
  document.getElementById('chatToggle').addEventListener('click', toggleChat);

  // Send button
  document.getElementById('chatSend').addEventListener('click', sendMessage);

  // Enter to send (Shift+Enter = newline)
  document.getElementById('chatInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  document.getElementById('chatInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });

  // Quick replies
  const qr = document.getElementById('chatQuickReplies');
  quickReplies.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'chat-quick';
    btn.textContent = q.label;
    btn.addEventListener('click', () => {
      document.getElementById('chatInput').value = q.text;
      qr.innerHTML = '';
      sendMessage();
    });
    qr.appendChild(btn);
  });

// Message de bienvenue
  setTimeout(() => {
    addMessage('He yBonjour ! Je suis l\'assistant virtuel du Département de Génie Informatique de l\'ENSET d\'Ebolowa.<br><br>Je peux vous renseigner sur les <strong>formations</strong>, <strong>admissions</strong>, <strong>frais</strong> ou tout autre sujet. Posez votre question !', 'bot');
  }, 600);
})();
        window.openAccountModal = openAccountModal;