/**
 * Vishal Nagarajan - Embedded Admin Panel & CRM Module
 * Manages Projects, Work Experience, Certifications, Publications, Inbound Leads, and Google Sites Sync
 */

const DEFAULT_ADMIN_PASSCODE = "Vishal2004!";
let isAdminAuthenticated = false;

document.addEventListener('DOMContentLoaded', () => {
  initAdminTriggers();
});

// ==========================================================================
// AUTHENTICATION & MODAL TOGGLING
// ==========================================================================
function initAdminTriggers() {
  const modal = document.getElementById('admin-crm-modal');
  const closeBtn = document.getElementById('admin-modal-close');
  const lockBtn = document.getElementById('admin-header-lock-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeAdminModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAdminModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('active')) closeAdminModal();
    }
  });

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      isAdminAuthenticated = false;
      renderLockScreen();
      showToast("🔒 Admin console locked.");
    });
  }

  // Keyboard shortcut: Alt + A or Ctrl + Shift + A or Cmd + Shift + A
  window.addEventListener('keydown', (e) => {
    if ((e.altKey && e.key.toLowerCase() === 'a') || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a')) {
      e.preventDefault();
      toggleAdminModal();
    }
  });

  // Tab switching
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabTarget = btn.getAttribute('data-tab');

      document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
      const activePane = document.getElementById(`tab-${tabTarget}`);
      if (activePane) activePane.classList.add('active');
    });
  });

  // Auth unlock button
  const unlockBtn = document.getElementById('admin-unlock-btn');
  const passInput = document.getElementById('admin-passcode-input');
  if (unlockBtn && passInput) {
    unlockBtn.addEventListener('click', () => handleAdminLogin(passInput.value));
    passInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAdminLogin(passInput.value);
    });
  }

  // Form submit listeners
  const projectForm = document.getElementById('admin-project-form');
  if (projectForm) {
    projectForm.addEventListener('submit', handleSaveProject);
  }

  const expForm = document.getElementById('admin-exp-form');
  if (expForm) {
    expForm.addEventListener('submit', handleSaveExperience);
  }

  const certForm = document.getElementById('admin-cert-form');
  if (certForm) {
    certForm.addEventListener('submit', handleSaveCertification);
  }

  const skillForm = document.getElementById('admin-skill-form');
  if (skillForm) {
    skillForm.addEventListener('submit', handleSaveSkill);
  }

  const quickToolInput = document.getElementById('admin-quick-tool-input');
  if (quickToolInput) {
    quickToolInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addQuickToolFromInput();
      }
    });
  }

  const pubForm = document.getElementById('admin-pub-form');
  if (pubForm) {
    pubForm.addEventListener('submit', handleSavePublication);
  }

  const leadForm = document.getElementById('admin-manual-lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', handleAddManualLead);
  }
}

function handleAdminLogin(inputPasscode) {
  const errorEl = document.getElementById('admin-auth-error');
  if (inputPasscode === DEFAULT_ADMIN_PASSCODE) {
    isAdminAuthenticated = true;
    if (errorEl) errorEl.style.display = 'none';
    renderAdminDashboard();
  } else {
    if (errorEl) {
      errorEl.textContent = 'Incorrect Passcode. Access Denied.';
      errorEl.style.display = 'block';
    }
  }
}

window.openAdminModal = function() {
  const modal = document.getElementById('admin-crm-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Always force password authentication prompt on open
  isAdminAuthenticated = false;
  renderLockScreen();
};

window.closeAdminModal = function() {
  const modal = document.getElementById('admin-crm-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  isAdminAuthenticated = false;
  if (window.location.hash === '#admin') {
    history.replaceState(null, null, ' ');
  }
};

window.toggleAdminModal = function() {
  const modal = document.getElementById('admin-crm-modal');
  if (modal && modal.classList.contains('active')) {
    closeAdminModal();
  } else {
    openAdminModal();
  }
};

function renderLockScreen() {
  const lockScreen = document.getElementById('admin-lock-screen');
  const dashView = document.getElementById('admin-dashboard-view');
  if (lockScreen) lockScreen.style.display = 'block';
  if (dashView) dashView.style.display = 'none';

  const input = document.getElementById('admin-passcode-input');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 100);
  }
  const errorEl = document.getElementById('admin-auth-error');
  if (errorEl) errorEl.style.display = 'none';
}

function renderAdminDashboard() {
  const lockScreen = document.getElementById('admin-lock-screen');
  const dashView = document.getElementById('admin-dashboard-view');
  if (lockScreen) lockScreen.style.display = 'none';
  if (dashView) {
    dashView.style.display = 'flex';
    dashView.style.flexDirection = 'column';
    dashView.style.flex = '1';
    dashView.style.minHeight = '0';
    dashView.style.overflow = 'hidden';
  }

  refreshAdminProjectsTable();
  refreshAdminExperienceTable();
  refreshAdminSkillsView();
  refreshAdminCertificationsTable();
  refreshAdminPublicationsTable();
  refreshAdminCRMTable();
}

// ==========================================================================
// TAB 1: WORK EXPERIENCE MANAGER
// ==========================================================================
function refreshAdminExperienceTable() {
  const tbody = document.getElementById('admin-exp-tbody');
  if (!tbody) return;

  const data = getStoredPortfolioData();
  const experiences = data.experience || [];

  if (experiences.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">No experience records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = experiences.map(exp => `
    <tr>
      <td>
        <strong style="color: #fff; display: block;">${escapeHtml(exp.role)}</strong>
        <span style="font-size: 0.74rem; color: var(--cobalt-light);">${escapeHtml(exp.organization)}${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}</span>
      </td>
      <td><span class="badge badge-lime">${escapeHtml(exp.period)}</span></td>
      <td><span class="badge badge-cobalt">${escapeHtml(exp.badge || 'Experience')}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="editExperience('${exp.id}')">Edit</button>
        <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; border-color: #ef4444; color: #f87171;" onclick="deleteExperience('${exp.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleSaveExperience(e) {
  e.preventDefault();
  const form = e.target;
  const editId = form.getAttribute('data-edit-id');

  const role = document.getElementById('exp-form-role').value.trim();
  const organization = document.getElementById('exp-form-org').value.trim();
  const location = document.getElementById('exp-form-location').value.trim();
  const period = document.getElementById('exp-form-period').value.trim();
  const badge = document.getElementById('exp-form-badge').value.trim();
  const highlightsStr = document.getElementById('exp-form-highlights').value.trim();

  const highlights = highlightsStr.split('\n').map(s => s.trim()).filter(Boolean);

  const data = getStoredPortfolioData();
  let experiences = data.experience || [];

  if (editId) {
    const idx = experiences.findIndex(exp => exp.id === editId);
    if (idx !== -1) {
      experiences[idx] = {
        ...experiences[idx],
        role,
        organization,
        location,
        period,
        badge,
        highlights
      };
    }
  } else {
    const newId = "exp-" + Date.now();
    experiences.unshift({
      id: newId,
      role,
      organization,
      location,
      period,
      badge,
      highlights
    });
  }

  saveExperienceData(experiences);
  form.reset();
  form.removeAttribute('data-edit-id');
  document.getElementById('exp-form-submit-btn').textContent = "Add Work Experience";
  document.getElementById('exp-form-cancel-btn').style.display = 'none';

  refreshAdminExperienceTable();
  if (typeof renderExperience === 'function') {
    renderExperience();
  }
  showToast("✓ Work experience saved and live portfolio updated!");
}

window.editExperience = function(expId) {
  const data = getStoredPortfolioData();
  const exp = (data.experience || []).find(e => e.id === expId);
  if (!exp) return;

  const form = document.getElementById('admin-exp-form');
  form.setAttribute('data-edit-id', exp.id);

  document.getElementById('exp-form-role').value = exp.role || '';
  document.getElementById('exp-form-org').value = exp.organization || '';
  document.getElementById('exp-form-location').value = exp.location || '';
  document.getElementById('exp-form-period').value = exp.period || '';
  document.getElementById('exp-form-badge').value = exp.badge || '';
  document.getElementById('exp-form-highlights').value = (exp.highlights || []).join('\n');

  document.getElementById('exp-form-submit-btn').textContent = "Update Experience";
  document.getElementById('exp-form-cancel-btn').style.display = 'inline-block';
  form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelExpEdit = function() {
  const form = document.getElementById('admin-exp-form');
  form.reset();
  form.removeAttribute('data-edit-id');
  document.getElementById('exp-form-submit-btn').textContent = "Add Work Experience";
  document.getElementById('exp-form-cancel-btn').style.display = 'none';
};

window.deleteExperience = function(expId) {
  if (!confirm("Are you sure you want to remove this work experience?")) return;

  const data = getStoredPortfolioData();
  const updated = (data.experience || []).filter(e => e.id !== expId);
  saveExperienceData(updated);

  refreshAdminExperienceTable();
  if (typeof renderExperience === 'function') {
    renderExperience();
  }
  showToast("✓ Work experience removed.");
};

// ==========================================================================
// TAB 2: PROJECTS MANAGER
// ==========================================================================
function refreshAdminProjectsTable() {
  const tableBody = document.getElementById('admin-projects-tbody');
  if (!tableBody) return;

  const data = getStoredPortfolioData();
  const projects = data.projects;

  tableBody.innerHTML = projects.map(p => `
    <tr>
      <td>
        <strong style="color: #ffffff; display: block;">${escapeHtml(p.title)}</strong>
        <span style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">${escapeHtml(p.id)}</span>
      </td>
      <td><span class="status-pill status-new">${escapeHtml(p.categoryLabel || p.category)}</span></td>
      <td>${escapeHtml(p.date)}</td>
      <td>
        <span style="color: ${p.featured ? 'var(--acid-lime)' : 'var(--text-dim)'}; font-family: var(--font-mono); font-size: 0.75rem;">
          ${p.featured ? '★ Featured' : 'Standard'}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="editProject('${p.id}')">Edit</button>
        <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; border-color: #ef4444; color: #f87171;" onclick="deleteProject('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleSaveProject(e) {
  e.preventDefault();
  const form = e.target;

  const editId = form.getAttribute('data-edit-id');
  const title = document.getElementById('proj-form-title').value.trim();
  const category = document.getElementById('proj-form-category').value;
  const categoryLabel = document.getElementById('proj-form-catlabel').value.trim() || category;
  const date = document.getElementById('proj-form-date').value.trim();
  const badge = document.getElementById('proj-form-badge').value.trim();
  const featured = document.getElementById('proj-form-featured').checked;
  const summary = document.getElementById('proj-form-summary').value.trim();
  const description = document.getElementById('proj-form-description').value.trim();
  const hardwareStr = document.getElementById('proj-form-hardware').value.trim();
  const protocolsStr = document.getElementById('proj-form-protocols').value.trim();
  const highlightsStr = document.getElementById('proj-form-highlights').value.trim();
  const demoUrl = document.getElementById('proj-form-url').value.trim();

  const hardware = hardwareStr.split(',').map(s => s.trim()).filter(Boolean);
  const protocols = protocolsStr.split(',').map(s => s.trim()).filter(Boolean);
  const highlights = highlightsStr.split('\n').map(s => s.trim()).filter(Boolean);

  const data = getStoredPortfolioData();
  let projects = data.projects;

  if (editId) {
    const idx = projects.findIndex(p => p.id === editId);
    if (idx !== -1) {
      projects[idx] = {
        ...projects[idx],
        title,
        category,
        categoryLabel,
        date,
        badge,
        featured,
        summary,
        description,
        hardware,
        protocols,
        highlights,
        demoUrl
      };
    }
  } else {
    const newId = "proj-" + title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) + '-' + Date.now().toString().slice(-4);
    projects.unshift({
      id: newId,
      title,
      category,
      categoryLabel,
      date,
      badge,
      featured,
      summary,
      description,
      hardware,
      protocols,
      highlights,
      demoUrl
    });
  }

  saveProjectsData(projects);
  form.reset();
  form.removeAttribute('data-edit-id');
  document.getElementById('proj-form-submit-btn').textContent = "Add Project to Portfolio";
  document.getElementById('proj-form-cancel-btn').style.display = 'none';

  refreshAdminProjectsTable();
  if (typeof renderProjects === 'function') {
    renderProjects('all');
  }

  showToast("✓ Project saved and live portfolio updated!");
}

window.editProject = function(projectId) {
  const data = getStoredPortfolioData();
  const p = data.projects.find(proj => proj.id === projectId);
  if (!p) return;

  const form = document.getElementById('admin-project-form');
  form.setAttribute('data-edit-id', p.id);

  document.getElementById('proj-form-title').value = p.title || '';
  document.getElementById('proj-form-category').value = p.category || 'robotics';
  document.getElementById('proj-form-catlabel').value = p.categoryLabel || '';
  document.getElementById('proj-form-date').value = p.date || '';
  document.getElementById('proj-form-badge').value = p.badge || '';
  document.getElementById('proj-form-featured').checked = !!p.featured;
  document.getElementById('proj-form-summary').value = p.summary || '';
  document.getElementById('proj-form-description').value = p.description || '';
  document.getElementById('proj-form-hardware').value = (p.hardware || []).join(', ');
  document.getElementById('proj-form-protocols').value = (p.protocols || []).join(', ');
  document.getElementById('proj-form-highlights').value = (p.highlights || []).join('\n');
  document.getElementById('proj-form-url').value = p.demoUrl || '';

  document.getElementById('proj-form-submit-btn').textContent = "Update Project";
  document.getElementById('proj-form-cancel-btn').style.display = 'inline-block';
  form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelProjectEdit = function() {
  const form = document.getElementById('admin-project-form');
  form.reset();
  form.removeAttribute('data-edit-id');
  document.getElementById('proj-form-submit-btn').textContent = "Add Project to Portfolio";
  document.getElementById('proj-form-cancel-btn').style.display = 'none';
};

window.deleteProject = function(projectId) {
  if (!confirm(`Are you sure you want to remove project "${projectId}"?`)) return;

  const data = getStoredPortfolioData();
  const updated = data.projects.filter(p => p.id !== projectId);
  saveProjectsData(updated);

  refreshAdminProjectsTable();
  if (typeof renderProjects === 'function') {
    renderProjects('all');
  }
  showToast("✓ Project removed from portfolio.");
};

// ==========================================================================
// TAB: SKILLS & SILICON ECOSYSTEM MANAGER
// ==========================================================================
function refreshAdminSkillsView() {
  const data = getStoredPortfolioData();
  const skills = data.skills || DEFAULT_PORTFOLIO_DATA.skills;

  // 1. Silicon Platforms & Hardware
  const hwTbody = document.getElementById('admin-hardware-tbody');
  const hwCount = document.getElementById('admin-hardware-count');
  const hardware = skills.hardware || [];
  if (hwCount) hwCount.textContent = `${hardware.length} items`;
  if (hwTbody) {
    if (hardware.length === 0) {
      hwTbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-dim); padding: 1.25rem;">No hardware platforms listed.</td></tr>`;
    } else {
      hwTbody.innerHTML = hardware.map((h, idx) => `
        <tr>
          <td><strong style="color: #fff;">${escapeHtml(h.name)}</strong></td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${escapeHtml(h.desc || '')}</td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="editSkill('hardware', ${idx})">Edit</button>
              <button type="button" class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; border-color: #ef4444; color: #f87171;" onclick="deleteSkill('hardware', ${idx})">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // 2. Protocols & Buses
  const protoTbody = document.getElementById('admin-protocols-tbody');
  const protoCount = document.getElementById('admin-protocols-count');
  const protocols = skills.protocols || [];
  if (protoCount) protoCount.textContent = `${protocols.length} items`;
  if (protoTbody) {
    if (protocols.length === 0) {
      protoTbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-dim); padding: 1.25rem;">No protocols listed.</td></tr>`;
    } else {
      protoTbody.innerHTML = protocols.map((p, idx) => `
        <tr>
          <td><strong style="color: #fff;">${escapeHtml(p.name)}</strong></td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${escapeHtml(p.desc || '')}</td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="editSkill('protocols', ${idx})">Edit</button>
              <button type="button" class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; border-color: #ef4444; color: #f87171;" onclick="deleteSkill('protocols', ${idx})">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // 3. Firmware & Low-Level Languages
  const progTbody = document.getElementById('admin-programming-tbody');
  const progCount = document.getElementById('admin-programming-count');
  const programming = skills.programming || [];
  if (progCount) progCount.textContent = `${programming.length} items`;
  if (progTbody) {
    if (programming.length === 0) {
      progTbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-dim); padding: 1.25rem;">No languages listed.</td></tr>`;
    } else {
      progTbody.innerHTML = programming.map((p, idx) => `
        <tr>
          <td><strong style="color: #fff;">${escapeHtml(p.name)}</strong></td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="flex: 1; max-width: 140px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                <div style="width: ${p.level || 90}%; height: 100%; background: var(--acid-lime);"></div>
              </div>
              <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--acid-lime);">${p.level || 90}%</span>
            </div>
          </td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="editSkill('programming', ${idx})">Edit</button>
              <button type="button" class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; border-color: #ef4444; color: #f87171;" onclick="deleteSkill('programming', ${idx})">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // 4. Tools & Lab Instruments
  const toolsContainer = document.getElementById('admin-tools-tags-container');
  const toolsCount = document.getElementById('admin-tools-count');
  const tools = skills.tools || [];
  if (toolsCount) toolsCount.textContent = `${tools.length} items`;
  if (toolsContainer) {
    if (tools.length === 0) {
      toolsContainer.innerHTML = `<span style="color: var(--text-dim); font-size: 0.8rem;">No tools added yet.</span>`;
    } else {
      toolsContainer.innerHTML = tools.map((t, idx) => {
        const toolName = typeof t === 'string' ? t : (t.name || '');
        return `
          <span class="spec-chip" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.7rem; font-size: 0.82rem;">
            <span>${escapeHtml(toolName)}</span>
            <button type="button" onclick="deleteTool(${idx})" style="background: none; border: none; color: #f87171; cursor: pointer; padding: 0; font-size: 0.9rem; line-height: 1;" title="Remove tool">✕</button>
          </span>
        `;
      }).join('');
    }
  }
}

function handleSaveSkill(e) {
  e.preventDefault();
  const cat = document.getElementById('skill-form-category').value;
  const name = document.getElementById('skill-form-name').value.trim();
  const desc = document.getElementById('skill-form-desc').value.trim();
  const level = parseInt(document.getElementById('skill-form-level').value, 10) || 90;
  const index = parseInt(document.getElementById('skill-form-index').value, 10);
  const origCat = document.getElementById('skill-form-orig-cat').value;

  if (!name) return;

  const data = getStoredPortfolioData();
  const skills = data.skills || JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA.skills));

  // If editing an existing item and category changed, remove from old category first
  if (index >= 0 && origCat && skills[origCat]) {
    skills[origCat].splice(index, 1);
  }

  if (cat === 'tools') {
    if (!skills.tools) skills.tools = [];
    skills.tools.push(name);
  } else if (cat === 'programming') {
    if (!skills.programming) skills.programming = [];
    const entry = { name, level: Math.min(100, Math.max(10, level)), tag: "Mastery" };
    if (index >= 0 && origCat === cat) {
      skills.programming[index] = entry;
    } else {
      skills.programming.push(entry);
    }
  } else if (cat === 'protocols') {
    if (!skills.protocols) skills.protocols = [];
    const entry = { name, desc, level };
    if (index >= 0 && origCat === cat) {
      skills.protocols[index] = entry;
    } else {
      skills.protocols.push(entry);
    }
  } else { // hardware / silicon platforms
    if (!skills.hardware) skills.hardware = [];
    const entry = { name, desc };
    if (index >= 0 && origCat === cat) {
      skills.hardware[index] = entry;
    } else {
      skills.hardware.push(entry);
    }
  }

  saveSkillsData(skills);
  cancelSkillEdit();
  refreshAdminSkillsView();
  if (typeof renderSkills === 'function') renderSkills();
  showToast("✓ Skill & Silicon Ecosystem updated!");
}

window.editSkill = function(category, index) {
  const data = getStoredPortfolioData();
  const skills = data.skills || DEFAULT_PORTFOLIO_DATA.skills;
  const list = skills[category] || [];
  const item = list[index];
  if (!item) return;

  document.getElementById('skill-form-category').value = category;
  document.getElementById('skill-form-name').value = item.name || '';
  document.getElementById('skill-form-desc').value = item.desc || '';
  document.getElementById('skill-form-level').value = item.level || 90;
  document.getElementById('skill-form-index').value = index;
  document.getElementById('skill-form-orig-cat').value = category;

  document.getElementById('skill-form-heading').textContent = "Edit Skill / Platform";
  document.getElementById('skill-form-submit-btn').textContent = "Update Skill";
  document.getElementById('skill-form-cancel-btn').style.display = 'inline-block';

  document.getElementById('admin-skill-form').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

window.cancelSkillEdit = function() {
  const form = document.getElementById('admin-skill-form');
  if (form) form.reset();
  document.getElementById('skill-form-index').value = "-1";
  document.getElementById('skill-form-orig-cat').value = "";
  document.getElementById('skill-form-heading').textContent = "Add / Edit Skill or Silicon Platform";
  document.getElementById('skill-form-submit-btn').textContent = "Add to Silicon Ecosystem";
  document.getElementById('skill-form-cancel-btn').style.display = 'none';
};

window.deleteSkill = function(category, index) {
  if (!confirm("Are you sure you want to remove this skill from your Silicon Ecosystem?")) return;

  const data = getStoredPortfolioData();
  const skills = data.skills || JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA.skills));
  if (skills[category] && skills[category][index] !== undefined) {
    skills[category].splice(index, 1);
    saveSkillsData(skills);
    refreshAdminSkillsView();
    if (typeof renderSkills === 'function') renderSkills();
    showToast("✓ Skill removed from ecosystem.");
  }
};

window.addQuickToolFromInput = function() {
  const input = document.getElementById('admin-quick-tool-input');
  if (!input) return;
  const toolName = input.value.trim();
  if (!toolName) return;

  const data = getStoredPortfolioData();
  const skills = data.skills || JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA.skills));
  if (!skills.tools) skills.tools = [];

  skills.tools.push(toolName);
  saveSkillsData(skills);
  input.value = '';
  refreshAdminSkillsView();
  if (typeof renderSkills === 'function') renderSkills();
  showToast(`✓ Tool "${toolName}" added to ecosystem!`);
};

window.deleteTool = function(index) {
  const data = getStoredPortfolioData();
  const skills = data.skills || JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA.skills));
  if (!skills.tools || skills.tools[index] === undefined) return;

  skills.tools.splice(index, 1);
  saveSkillsData(skills);
  refreshAdminSkillsView();
  if (typeof renderSkills === 'function') renderSkills();
  showToast("✓ Tool removed.");
};

// ==========================================================================
// TAB 3: CERTIFICATIONS MANAGER
// ==========================================================================
function refreshAdminCertificationsTable() {
  const tbody = document.getElementById('admin-certs-tbody');
  if (!tbody) return;

  const data = getStoredPortfolioData();
  const certs = data.certifications || [];

  tbody.innerHTML = certs.map(c => `
    <tr>
      <td>
        <strong style="color: #fff; display: block;">${escapeHtml(c.title)}</strong>
        <span style="font-size: 0.74rem; color: var(--acid-lime);">${escapeHtml(c.skills || '')}</span>
      </td>
      <td><span class="badge badge-lime">${escapeHtml(c.issuer)}</span></td>
      <td>${escapeHtml(c.date || '')}</td>
      <td>
        <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="editCertification('${c.id}')">Edit</button>
        <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; border-color: #ef4444; color: #f87171;" onclick="deleteCertification('${c.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleSaveCertification(e) {
  e.preventDefault();
  const form = e.target;
  const editId = form.getAttribute('data-edit-id');

  const title = document.getElementById('cert-form-title').value.trim();
  const issuer = document.getElementById('cert-form-issuer').value.trim();
  const date = document.getElementById('cert-form-date').value.trim();
  const badge = document.getElementById('cert-form-badge').value.trim();
  const skills = document.getElementById('cert-form-skills').value.trim();
  const url = document.getElementById('cert-form-url').value.trim();

  const data = getStoredPortfolioData();
  let certs = data.certifications || [];

  if (editId) {
    const idx = certs.findIndex(c => c.id === editId);
    if (idx !== -1) {
      certs[idx] = { ...certs[idx], title, issuer, date, badge, skills, url };
    }
  } else {
    const newId = "cert-" + Date.now();
    certs.push({ id: newId, title, issuer, date, badge, skills, url });
  }

  saveCertificationsData(certs);
  form.reset();
  form.removeAttribute('data-edit-id');
  document.getElementById('cert-form-submit-btn').textContent = "Add Certification";
  document.getElementById('cert-form-cancel-btn').style.display = 'none';

  refreshAdminCertificationsTable();
  if (typeof renderCertifications === 'function') {
    renderCertifications();
  }
  showToast("✓ Certification saved and portfolio updated!");
}

window.editCertification = function(certId) {
  const data = getStoredPortfolioData();
  const c = (data.certifications || []).find(item => item.id === certId);
  if (!c) return;

  const form = document.getElementById('admin-cert-form');
  form.setAttribute('data-edit-id', c.id);

  document.getElementById('cert-form-title').value = c.title || '';
  document.getElementById('cert-form-issuer').value = c.issuer || '';
  document.getElementById('cert-form-date').value = c.date || '';
  document.getElementById('cert-form-badge').value = c.badge || '';
  document.getElementById('cert-form-skills').value = c.skills || '';
  document.getElementById('cert-form-url').value = c.url || '';

  document.getElementById('cert-form-submit-btn').textContent = "Update Certification";
  document.getElementById('cert-form-cancel-btn').style.display = 'inline-block';
  form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelCertEdit = function() {
  const form = document.getElementById('admin-cert-form');
  form.reset();
  form.removeAttribute('data-edit-id');
  document.getElementById('cert-form-submit-btn').textContent = "Add Certification";
  document.getElementById('cert-form-cancel-btn').style.display = 'none';
};

window.deleteCertification = function(certId) {
  if (!confirm("Are you sure you want to remove this certification?")) return;

  const data = getStoredPortfolioData();
  const updated = (data.certifications || []).filter(c => c.id !== certId);
  saveCertificationsData(updated);

  refreshAdminCertificationsTable();
  if (typeof renderCertifications === 'function') {
    renderCertifications();
  }
  showToast("✓ Certification removed.");
};

// ==========================================================================
// TAB 4: PUBLICATIONS MANAGER
// ==========================================================================
function refreshAdminPublicationsTable() {
  const tbody = document.getElementById('admin-pubs-tbody');
  if (!tbody) return;

  const data = getStoredPortfolioData();
  const pubs = data.publications || [];

  tbody.innerHTML = pubs.map(p => `
    <tr>
      <td>
        <strong style="color: #fff; display: block;">${escapeHtml(p.title)}</strong>
        <span style="font-size: 0.74rem; color: var(--text-dim);">${escapeHtml(p.authors)}</span>
      </td>
      <td><span class="badge badge-cobalt">${escapeHtml(p.journal || '')}</span></td>
      <td>${escapeHtml(p.year || '')}</td>
      <td>
        <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="editPublication('${p.id}')">Edit</button>
        <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; border-color: #ef4444; color: #f87171;" onclick="deletePublication('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleSavePublication(e) {
  e.preventDefault();
  const form = e.target;
  const editId = form.getAttribute('data-edit-id');

  const title = document.getElementById('pub-form-title').value.trim();
  const authors = document.getElementById('pub-form-authors').value.trim();
  const journal = document.getElementById('pub-form-journal').value.trim();
  const year = document.getElementById('pub-form-year').value.trim();
  const volume = document.getElementById('pub-form-volume').value.trim();
  const pages = document.getElementById('pub-form-pages').value.trim();
  const doi = document.getElementById('pub-form-doi').value.trim();
  const doiUrl = document.getElementById('pub-form-url').value.trim();
  const abstract = document.getElementById('pub-form-abstract').value.trim();
  const citation = document.getElementById('pub-form-citation').value.trim();
  const bibtex = document.getElementById('pub-form-bibtex').value.trim();

  const data = getStoredPortfolioData();
  let pubs = data.publications || [];

  if (editId) {
    const idx = pubs.findIndex(p => p.id === editId);
    if (idx !== -1) {
      pubs[idx] = {
        ...pubs[idx],
        title, authors, journal, year, volume, pages, doi, doiUrl, abstract, citation, bibtex
      };
    }
  } else {
    const newId = "pub-" + Date.now();
    pubs.unshift({
      id: newId,
      title, authors, journal, year, volume, pages, doi, doiUrl, abstract, citation, bibtex
    });
  }

  savePublicationsData(pubs);
  form.reset();
  form.removeAttribute('data-edit-id');
  document.getElementById('pub-form-submit-btn').textContent = "Add Publication";
  document.getElementById('pub-form-cancel-btn').style.display = 'none';

  refreshAdminPublicationsTable();
  if (typeof renderPublications === 'function') {
    renderPublications();
  }
  showToast("✓ Publication saved and portfolio updated!");
}

window.editPublication = function(pubId) {
  const data = getStoredPortfolioData();
  const p = (data.publications || []).find(item => item.id === pubId);
  if (!p) return;

  const form = document.getElementById('admin-pub-form');
  form.setAttribute('data-edit-id', p.id);

  document.getElementById('pub-form-title').value = p.title || '';
  document.getElementById('pub-form-authors').value = p.authors || '';
  document.getElementById('pub-form-journal').value = p.journal || '';
  document.getElementById('pub-form-year').value = p.year || '';
  document.getElementById('pub-form-volume').value = p.volume || '';
  document.getElementById('pub-form-pages').value = p.pages || '';
  document.getElementById('pub-form-doi').value = p.doi || '';
  document.getElementById('pub-form-url').value = p.doiUrl || '';
  document.getElementById('pub-form-abstract').value = p.abstract || '';
  document.getElementById('pub-form-citation').value = p.citation || '';
  document.getElementById('pub-form-bibtex').value = p.bibtex || '';

  document.getElementById('pub-form-submit-btn').textContent = "Update Publication";
  document.getElementById('pub-form-cancel-btn').style.display = 'inline-block';
  form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelPubEdit = function() {
  const form = document.getElementById('admin-pub-form');
  form.reset();
  form.removeAttribute('data-edit-id');
  document.getElementById('pub-form-submit-btn').textContent = "Add Publication";
  document.getElementById('pub-form-cancel-btn').style.display = 'none';
};

window.deletePublication = function(pubId) {
  if (!confirm("Are you sure you want to remove this publication?")) return;

  const data = getStoredPortfolioData();
  const updated = (data.publications || []).filter(p => p.id !== pubId);
  savePublicationsData(updated);

  refreshAdminPublicationsTable();
  if (typeof renderPublications === 'function') {
    renderPublications();
  }
  showToast("✓ Publication removed.");
};

// ==========================================================================
// TAB 5: CLIENT & LEAD CRM (Production clean)
// ==========================================================================
window.refreshAdminCRMTable = function() {
  const tableBody = document.getElementById('admin-crm-tbody');
  const countEl = document.getElementById('crm-lead-count');
  if (!tableBody) return;

  const leads = getStoredLeads();
  if (countEl) countEl.textContent = `${leads.length} Leads`;

  if (leads.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem 1rem; color: var(--text-dim); font-family: var(--font-mono);">
          <div style="font-size: 1.6rem; margin-bottom: 0.5rem;">📥</div>
          <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;">No Inbound Leads Yet</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Messages submitted through your portfolio contact form will be recorded here automatically.</div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = leads.map(l => {
    let statusClass = 'status-new';
    if (l.status === 'In Progress') statusClass = 'status-progress';
    if (l.status === 'Closed' || l.status === 'Completed') statusClass = 'status-closed';

    return `
      <tr>
        <td>
          <strong style="color: #fff; display: block;">${escapeHtml(l.name)}</strong>
          <span style="font-size: 0.74rem; color: var(--acid-lime);">${escapeHtml(l.company || 'Direct')}</span>
        </td>
        <td>
          <a href="mailto:${escapeHtml(l.email)}" style="display: block; font-family: var(--font-mono); font-size: 0.78rem;">${escapeHtml(l.email)}</a>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">${escapeHtml(l.phone || 'No phone')}</span>
        </td>
        <td><span class="badge badge-cobalt" style="font-size: 0.68rem;">${escapeHtml(l.type)}</span></td>
        <td>
          <select class="form-control" style="padding: 0.2rem 0.4rem; font-size: 0.72rem;" onchange="updateLeadStatus('${l.id}', this.value)">
            <option value="New" ${l.status === 'New' ? 'selected' : ''}>New</option>
            <option value="In Progress" ${l.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Interview Scheduled" ${l.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
            <option value="Closed" ${l.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td>
          <span style="font-size: 0.78rem; color: var(--text-muted); display: block; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(l.notes)}">
            ${escapeHtml(l.notes)}
          </span>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" style="padding: 0.2rem 0.45rem; font-size: 0.7rem; border-color: #ef4444; color: #f87171;" onclick="deleteLead('${l.id}')">✕</button>
        </td>
      </tr>
    `;
  }).join('');
};

window.updateLeadStatus = function(leadId, newStatus) {
  const leads = getStoredLeads();
  const idx = leads.findIndex(l => l.id === leadId);
  if (idx !== -1) {
    leads[idx].status = newStatus;
    saveLeadsData(leads);
    showToast(`✓ Lead status updated to: ${newStatus}`);
  }
};

window.deleteLead = function(leadId) {
  if (!confirm("Delete this lead from CRM?")) return;
  const leads = getStoredLeads();
  const updated = leads.filter(l => l.id !== leadId);
  saveLeadsData(updated);
  refreshAdminCRMTable();
  showToast("✓ Lead deleted.");
};

function handleAddManualLead(e) {
  e.preventDefault();
  const name = document.getElementById('manual-lead-name').value.trim();
  const email = document.getElementById('manual-lead-email').value.trim();
  const phone = document.getElementById('manual-lead-phone').value.trim();
  const company = document.getElementById('manual-lead-company').value.trim();
  const type = document.getElementById('manual-lead-type').value.trim();
  const notes = document.getElementById('manual-lead-notes').value.trim();

  if (!name) return;

  const newLead = {
    id: "lead-" + Date.now(),
    name,
    email: email || "N/A",
    phone: phone || "N/A",
    company: company || "Manual Entry",
    type: type || "Embedded Project",
    budget: "N/A",
    date: new Date().toISOString().split('T')[0],
    status: "New",
    notes: notes || "Added manually via CRM."
  };

  const leads = getStoredLeads();
  leads.unshift(newLead);
  saveLeadsData(leads);

  e.target.reset();
  refreshAdminCRMTable();
  showToast("✓ New lead added to CRM!");
}

window.exportLeadsCSV = function() {
  const leads = getStoredLeads();
  if (leads.length === 0) {
    alert("No leads to export.");
    return;
  }

  const headers = ["ID", "Name", "Email", "Phone", "Company", "Project Type", "Budget", "Date", "Status", "Notes"];
  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.company || '').replace(/"/g, '""')}"`,
    `"${(l.type || '').replace(/"/g, '""')}"`,
    `"${(l.budget || '').replace(/"/g, '""')}"`,
    `"${l.date || ''}"`,
    `"${l.status || ''}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vishal_Portfolio_CRM_Leads_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("✓ Leads exported as CSV file!");
};

// ==========================================================================
// TAB 6: BACKUP, RESTORE & GOOGLE SITES SYNC
// ==========================================================================
window.exportSystemBackup = function() {
  const currentData = getStoredPortfolioData();
  const data = {
    exportedAt: new Date().toISOString(),
    profile: currentData.profile,
    experience: currentData.experience,
    publications: currentData.publications,
    projects: currentData.projects,
    certifications: currentData.certifications,
    skills: currentData.skills,
    leads: getStoredLeads()
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vishal_Portfolio_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("✓ Full JSON Backup downloaded!");
};

window.importSystemBackup = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.projects && Array.isArray(parsed.projects)) {
        saveProjectsData(parsed.projects);
      }
      if (parsed.experience && Array.isArray(parsed.experience)) {
        saveExperienceData(parsed.experience);
      }
      if (parsed.publications && Array.isArray(parsed.publications)) {
        savePublicationsData(parsed.publications);
      }
      if (parsed.certifications && Array.isArray(parsed.certifications)) {
        saveCertificationsData(parsed.certifications);
      }
      if (parsed.skills && typeof parsed.skills === 'object') {
        saveSkillsData(parsed.skills);
      }
      if (parsed.leads && Array.isArray(parsed.leads)) {
        saveLeadsData(parsed.leads);
      }
      refreshAdminProjectsTable();
      refreshAdminExperienceTable();
      refreshAdminSkillsView();
      refreshAdminCertificationsTable();
      refreshAdminPublicationsTable();
      refreshAdminCRMTable();
      if (typeof renderProjects === 'function') renderProjects('all');
      if (typeof renderExperience === 'function') renderExperience();
      if (typeof renderPublications === 'function') renderPublications();
      if (typeof renderCertifications === 'function') renderCertifications();
      if (typeof renderSkills === 'function') renderSkills();
      showToast("✓ System backup successfully restored!");
    } catch (err) {
      alert("Error parsing backup JSON: " + err.message);
    }
  };
  reader.readAsText(file);
};

window.resetToFactoryDefaults = function() {
  if (!confirm("Are you sure you want to reset all data to default baseline? This cannot be undone unless you made a backup!")) return;

  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.EXPERIENCE);
  localStorage.removeItem(STORAGE_KEYS.PUBLICATIONS);
  localStorage.removeItem(STORAGE_KEYS.CERTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.SKILLS);
  localStorage.removeItem(STORAGE_KEYS.LEADS);

  refreshAdminProjectsTable();
  refreshAdminExperienceTable();
  refreshAdminSkillsView();
  refreshAdminCertificationsTable();
  refreshAdminPublicationsTable();
  refreshAdminCRMTable();
  if (typeof renderProjects === 'function') renderProjects('all');
  if (typeof renderExperience === 'function') renderExperience();
  if (typeof renderPublications === 'function') renderPublications();
  if (typeof renderCertifications === 'function') renderCertifications();
  if (typeof renderSkills === 'function') renderSkills();
  showToast("✓ Portfolio reset to default initial state.");
};

window.copyGoogleSitesEmbedSnippet = function() {
  const snippet = `<iframe src="https://vishalnagarajan.github.io/portfolio/" width="100%" height="950" frameborder="0" style="border:none; border-radius:12px; width:100%; min-height:850px;" allowfullscreen></iframe>`;
  navigator.clipboard.writeText(snippet).then(() => {
    showToast("✓ Google Sites iframe embed code copied to clipboard!");
  });
};
