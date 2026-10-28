/**
 * Vishal Nagarajan - Main Application Script
 * Interactive UI, Canvas Visuals, Dynamic Projects, Experience, Certifications & Publications
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dynamic components
  initInteractiveCanvas();
  renderExperience();
  renderProjects('all');
  renderPublications();
  renderCertifications();
  renderSkills();
  initProjectFilters();
  initContactForm();
  initVCardDownload();
  initMobileNav();
  initTelemetryLiveClock();
  initDiscreetAdminTriggers();
});

// ==========================================================================
// INTERACTIVE CYBER-CANVAS BACKGROUND
// ==========================================================================
function initInteractiveCanvas() {
  const canvas = document.getElementById('interactive-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 22), 65);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.8,
      color: Math.random() > 0.3 ? '#1558C9' : '#D4FF24'
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(21, 88, 201, ${0.18 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 100) {
        p.x += (mdx / mdist) * 0.8;
        p.y += (mdy / mdist) * 0.8;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================================================
// DYNAMIC WORK EXPERIENCE RENDERING
// ==========================================================================
window.renderExperience = function() {
  const container = document.getElementById('experience-container');
  if (!container) return;

  const data = getStoredPortfolioData();
  const experiences = data.experience || [];

  if (experiences.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-family: var(--font-mono);">No experience records added yet.</p>`;
    return;
  }

  container.innerHTML = experiences.map(exp => `
    <div class="timeline-item" data-exp-id="${escapeHtml(exp.id)}">
      <div class="timeline-node"></div>
      <div class="timeline-card">
        <div class="timeline-head">
          <div>
            <h3 class="role-title">${escapeHtml(exp.role)}</h3>
            <div class="org-name">${escapeHtml(exp.organization)}${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}</div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            ${exp.badge ? `<span class="badge badge-cobalt" style="font-size: 0.72rem;">${escapeHtml(exp.badge)}</span>` : ''}
            <span class="period-badge">${escapeHtml(exp.period)}</span>
          </div>
        </div>

        <ul class="timeline-bullets">
          ${(exp.highlights || []).map(h => `
            <li>${escapeHtml(h)}</li>
          `).join('')}
        </ul>
      </div>
    </div>
  `).join('');
};

// ==========================================================================
// DYNAMIC PROJECTS RENDERING & FILTERING
// ==========================================================================
window.renderProjects = function(filterCategory = 'all') {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const data = getStoredPortfolioData();
  const projects = data.projects;

  const filtered = filterCategory === 'all'
    ? projects
    : projects.filter(p => p.category === filterCategory || (filterCategory === 'featured' && p.featured));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-surface-1); border-radius: var(--radius-md); border: 1px dashed var(--cobalt-border);">
        <p style="color: var(--text-muted); font-family: var(--font-mono);">No projects found under this filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <article class="project-card ${p.featured ? 'featured' : ''}" data-project-id="${p.id}">
      <div>
        <div class="project-top-row">
          <span class="badge ${p.featured ? 'badge-lime badge-glow' : 'badge-cobalt'}">
            ${escapeHtml(p.badge || p.categoryLabel || 'Engineering')}
          </span>
          <span class="project-date">${escapeHtml(p.date)}</span>
        </div>

        <h3 class="project-card-title">${escapeHtml(p.title)}</h3>
        <p class="project-card-desc">${escapeHtml(p.summary)}</p>

        <div class="project-specs">
          <div class="spec-line">
            <span class="spec-key">Hardware:</span>
            <div class="spec-tags">
              ${(p.hardware || []).map(h => `<span class="spec-chip">${escapeHtml(h)}</span>`).join('')}
            </div>
          </div>
          <div class="spec-line">
            <span class="spec-key">Protocols:</span>
            <div class="spec-tags">
              ${(p.protocols || []).map(pr => `<span class="spec-chip" style="color: var(--acid-lime);">${escapeHtml(pr)}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="project-card-footer">
        <button class="project-details-btn" onclick="openProjectModal('${p.id}')">
          View Technical Specs <span>→</span>
        </button>
        ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" rel="noopener noreferrer" class="badge badge-lime" style="font-size: 0.7rem;">DOI / Demo ↗</a>` : ''}
      </div>
    </article>
  `).join('');
};

function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderProjects(cat);
    });
  });
}

// ==========================================================================
// DYNAMIC PUBLICATIONS RENDERING
// ==========================================================================
window.renderPublications = function() {
  const container = document.getElementById('publications-container');
  if (!container) return;

  const data = getStoredPortfolioData();
  const publications = data.publications || [];

  if (publications.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-family: var(--font-mono);">No publications added yet.</p>`;
    return;
  }

  container.innerHTML = publications.map((pub, idx) => `
    <div class="publication-card" style="margin-bottom: ${idx < publications.length - 1 ? '2rem' : '0'};">
      <div class="pub-top-meta">
        <span class="badge badge-lime badge-glow">${escapeHtml(pub.journal || 'Peer-Reviewed')} • ${escapeHtml(pub.year || '2026')}</span>
        ${pub.volume ? `<span class="badge badge-cobalt">Volume ${escapeHtml(pub.volume)}${pub.pages ? `, Article ${escapeHtml(pub.pages)}` : ''}</span>` : ''}
        ${pub.doi ? `<span class="badge badge-lime">DOI: ${escapeHtml(pub.doi)}</span>` : ''}
      </div>

      <h3 class="pub-title">${escapeHtml(pub.title)}</h3>

      <div class="pub-authors">
        <strong>Authors:</strong> ${escapeHtml(pub.authors)}
      </div>

      <p class="pub-abstract">
        <strong>Abstract:</strong> ${escapeHtml(pub.abstract)}
      </p>

      <div class="pub-actions">
        ${pub.doiUrl || pub.doi ? `
          <a href="${escapeHtml(pub.doiUrl || 'https://doi.org/' + pub.doi)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <span>View Paper at DOI.org</span>
            <span>↗</span>
          </a>
        ` : ''}
        <button class="btn btn-outline btn-sm" onclick="copyCitation('${pub.id}')">
          <span>📋 Copy Citation</span>
        </button>
        <button class="btn btn-outline btn-sm" onclick="copyBibTeX('${pub.id}')">
          <span>📑 Copy BibTeX</span>
        </button>
      </div>
    </div>
  `).join('');
};

window.copyCitation = function(pubId) {
  const data = getStoredPortfolioData();
  const pub = (data.publications || []).find(p => p.id === pubId);
  if (!pub) return;

  const textToCopy = pub.citation || `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}. ${pub.doi ? 'DOI: ' + pub.doi : ''}`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast("✓ Citation copied to clipboard!");
  });
};

window.copyBibTeX = function(pubId) {
  const data = getStoredPortfolioData();
  const pub = (data.publications || []).find(p => p.id === pubId);
  if (!pub) return;

  const bibtex = pub.bibtex || `@article{${pub.id},\n  author = {${pub.authors}},\n  title = {${pub.title}},\n  journal = {${pub.journal}},\n  year = {${pub.year}}\n}`;
  navigator.clipboard.writeText(bibtex).then(() => {
    showToast("✓ BibTeX entry copied to clipboard!");
  });
};

// ==========================================================================
// DYNAMIC CERTIFICATIONS RENDERING
// ==========================================================================
window.renderCertifications = function() {
  const container = document.getElementById('certifications-container');
  if (!container) return;

  const data = getStoredPortfolioData();
  const certs = data.certifications || [];

  container.innerHTML = certs.map((c, idx) => `
    <div class="timeline-card" style="border-left: 3px solid ${idx % 2 === 0 ? 'var(--acid-lime)' : 'var(--cobalt-primary)'};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.5rem;">
        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; color: #fff;">${escapeHtml(c.title)}</h4>
        <span class="badge ${idx % 2 === 0 ? 'badge-lime' : 'badge-cobalt'}">${escapeHtml(c.issuer)}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-top: 0.4rem;">
        ${escapeHtml(c.skills || c.badge || '')}
      </p>
      ${c.url ? `
        <div style="margin-top: 0.5rem;">
          <a href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--acid-lime);">Verify Credential ↗</a>
        </div>
      ` : ''}
    </div>
  `).join('');
};

// ==========================================================================
// DYNAMIC SKILLS & SILICON ECOSYSTEM RENDERING
// ==========================================================================
window.renderSkills = function() {
  const data = getStoredPortfolioData();
  const skills = data.skills || DEFAULT_PORTFOLIO_DATA.skills;

  // 1. Programming / Firmware
  const progContainer = document.getElementById('skills-programming-list');
  if (progContainer && skills.programming) {
    progContainer.innerHTML = skills.programming.map(p => `
      <div class="skill-bar-item">
        <div class="skill-info">
          <span class="skill-name">${escapeHtml(p.name)}</span>
          <span class="skill-pct">${p.level || 90}%</span>
        </div>
        <div class="skill-track"><div class="skill-progress" style="width: ${p.level || 90}%;"></div></div>
      </div>
    `).join('');
  }

  // 2. Buses & Protocols
  const protoContainer = document.getElementById('skills-protocols-list');
  if (protoContainer && skills.protocols) {
    protoContainer.innerHTML = skills.protocols.map(p => `
      <div class="hardware-chip">
        <span class="chip-name">${escapeHtml(p.name)}</span>
        <span class="chip-desc">${escapeHtml(p.desc || '')}</span>
      </div>
    `).join('');
  }

  // 3. Silicon Platforms & Hardware Ecosystem
  const hwContainer = document.getElementById('skills-hardware-list');
  if (hwContainer && skills.hardware) {
    hwContainer.innerHTML = skills.hardware.map(h => `
      <div class="hardware-chip">
        <span class="chip-name">${escapeHtml(h.name)}</span>
        <span class="chip-desc">${escapeHtml(h.desc || '')}</span>
      </div>
    `).join('');
  }

  // 4. Tools & Lab Instruments
  const toolsContainer = document.getElementById('skills-tools-list');
  if (toolsContainer && skills.tools) {
    toolsContainer.innerHTML = skills.tools.map(t => {
      const toolName = typeof t === 'string' ? t : (t.name || '');
      return `<span class="spec-chip" style="padding: 0.45rem 0.75rem;">${escapeHtml(toolName)}</span>`;
    }).join('');
  }
};

// ==========================================================================
// PROJECT SPEC MODAL
// ==========================================================================
window.openProjectModal = function(projectId) {
  const data = getStoredPortfolioData();
  const project = data.projects.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('project-detail-modal');
  const content = document.getElementById('project-modal-content');

  content.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem;">
      <span class="badge badge-lime">${escapeHtml(project.badge || project.categoryLabel)}</span>
      <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim);">${escapeHtml(project.date)}</span>
    </div>

    <h2 style="font-family: var(--font-heading); font-size: 1.65rem; color: #fff; margin-bottom: 1rem; line-height: 1.25;">
      ${escapeHtml(project.title)}
    </h2>

    <p style="font-size: 0.98rem; color: #cbd5e1; line-height: 1.7; margin-bottom: 1.5rem;">
      ${escapeHtml(project.description || project.summary)}
    </p>

    <div style="background: var(--bg-surface-1); border: 1px solid var(--cobalt-border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
      <h4 style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--acid-lime); text-transform: uppercase; margin-bottom: 0.75rem;">
        // Engineering Highlights & Benchmarks
      </h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
        ${(project.highlights || []).map(h => `
          <li style="position: relative; padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
            <span style="position: absolute; left: 0; color: var(--acid-lime);">▸</span>
            ${escapeHtml(h)}
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: rgba(3, 4, 7, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.85rem; border-radius: var(--radius-sm);">
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--cobalt-light); display: block; margin-bottom: 0.35rem;">HARDWARE & SILICON</span>
        <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
          ${(project.hardware || []).map(h => `<span class="spec-chip">${escapeHtml(h)}</span>`).join('')}
        </div>
      </div>
      <div style="background: rgba(3, 4, 7, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.85rem; border-radius: var(--radius-sm);">
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--acid-lime); display: block; margin-bottom: 0.35rem;">BUSES & PROTOCOLS</span>
        <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
          ${(project.protocols || []).map(pr => `<span class="spec-chip" style="color: var(--acid-lime);">${escapeHtml(pr)}</span>`).join('')}
        </div>
      </div>
    </div>

    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.08);">
      ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">External Resource / DOI ↗</a>` : ''}
      <button class="btn btn-outline btn-sm" onclick="closeProjectModal()">Close</button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
  const modal = document.getElementById('project-detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// ==========================================================================
// CONTACT FORM & CRM CAPTURE
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const alertBox = document.getElementById('contact-form-alert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phoneInput = document.getElementById('contact-phone');
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const company = document.getElementById('contact-company').value.trim();
    const projectType = document.getElementById('contact-type').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alert("Please fill in Name, Email, and Message.");
      return;
    }

    // 1. Create Lead in LocalStorage CRM
    const newLead = {
      id: "lead-" + Date.now(),
      name,
      email,
      phone: phone || "Not Provided",
      company: company || "Direct Inquiry",
      type: projectType || "Firmware Development",
      budget: "Discuss upon Review",
      date: new Date().toISOString().split('T')[0],
      status: "New",
      notes: message
    };

    const existingLeads = getStoredLeads();
    existingLeads.unshift(newLead);
    saveLeadsData(existingLeads);

    // 2. Open email client prefilled
    const mailtoSubject = encodeURIComponent(`[Embedded Portfolio Inquiry] ${projectType} from ${name}`);
    const mailtoBody = encodeURIComponent(
      `Hi Vishal,\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}Company: ${company || 'N/A'}\nProject Type: ${projectType}\n\nMessage:\n${message}\n\nSent via Vishal Nagarajan Portfolio CRM.`
    );

    // 3. Update UI
    if (alertBox) {
      alertBox.textContent = `✓ Message saved to Vishal's CRM! Opening your email client to send direct copy to vishalnagarajan.work@gmail.com...`;
      alertBox.className = "form-alert success";
      alertBox.style.display = "block";
    }

    showToast("✓ Lead saved to CRM & Dispatching Email...");

    setTimeout(() => {
      window.location.href = `mailto:vishalnagarajan.work@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      form.reset();
    }, 1200);

    if (typeof refreshAdminCRMTable === 'function') {
      refreshAdminCRMTable();
    }
  });
}

// ==========================================================================
// DYNAMIC VCARD GENERATOR (Privacy-conscious, phone omitted)
// ==========================================================================
function initVCardDownload() {
  const vcardBtn = document.getElementById('download-vcard-btn');
  if (!vcardBtn) return;

  vcardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Vishal Nagarajan',
      'N:Nagarajan;Vishal;;;',
      'TITLE:Embedded Software Engineer',
      'ORG:Embedded Systems & Firmware Engineering',
      'EMAIL;TYPE=INTERNET:vishalnagarajan.work@gmail.com',
      'URL:https://linkedin.com/in/vakxee',
      'X-SOCIALPROFILE;type=instagram:https://instagram.com/vishalnagarajan_',
      'ADR;TYPE=WORK:;;Coimbatore;Tamil Nadu;;India',
      'NOTE:Embedded C/C++, STM32, ESP32, CAN Bus, MISRA C, Avionics TAWS experience at HAL. Multi-instrumentalist (bassist, keyboardist, flutist) with Sargam The Band.',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Vishal_Nagarajan_Embedded.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("✓ Contact Card (vCard) downloaded!");
  });
}

// ==========================================================================
// TELEMETRY LIVE TICKER
// ==========================================================================
function initTelemetryLiveClock() {
  const clockEl = document.getElementById('telemetry-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    clockEl.textContent = `TICK: ${timeStr} IST`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// ==========================================================================
// DISCREET / HIDDEN ADMIN PANEL ACCESS
// ==========================================================================
function initDiscreetAdminTriggers() {
  // 1. URL Hash check (e.g. index.html#admin)
  function checkHash() {
    if (window.location.hash === '#admin') {
      if (typeof openAdminModal === 'function') {
        openAdminModal();
      }
    }
  }
  checkHash();
  window.addEventListener('hashchange', checkHash);

  // 2. Secret click on Copyright name in footer
  const copyrightSymbol = document.getElementById('secret-admin-copyright');
  if (copyrightSymbol) {
    copyrightSymbol.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof openAdminModal === 'function') {
        openAdminModal();
      }
    });
  }
}

// ==========================================================================
// MOBILE NAVIGATION
// ==========================================================================
function initMobileNav() {
  const btn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!btn || !navLinks) return;

  btn.addEventListener('click', () => {
    const isVisible = navLinks.style.display === 'flex';
    navLinks.style.display = isVisible ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(3, 4, 7, 0.98)';
    navLinks.style.padding = '1.5rem';
    navLinks.style.borderBottom = '1px solid var(--cobalt-border)';
  });
}

// ==========================================================================
// TOAST UTILITY
// ==========================================================================
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'flex';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
