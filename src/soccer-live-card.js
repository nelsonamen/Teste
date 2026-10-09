import { LitElement, html, css } from 'lit';
import { t, resolveLang } from './i18n.js';
import { blendHassSources } from "./cards/shared-source-blend.js";
import { applyEditorProfile, EDITOR_PROFILES } from './cards/editor-profiles.js';
import { discoverSoccerModels, discoverSoccerTeams, renderAppearanceControl } from './cards/editor-helper.js';
import { applySkin } from './skins.js';

// Card elements stay eagerly registered for backwards-compatible direct YAML
import './cards/Team/soccer-live-team.js';
import './cards/Standings/soccer-live-standings.js';
import './cards/Tutte/soccer-live-matches.js';
import './cards/Countdown/soccer-live-countdown.js';
import './cards/News/soccer-live-news.js';
import './cards/Bracket/soccer-live-bracket.js';
import './cards/MiniStandings/soccer-live-mini-standings.js';
import './cards/Scorers/soccer-live-scorers.js';
import './cards/MultiTeam/soccer-live-multi-team.js';
import './cards/TeamCompetitions/soccer-live-team-competitions.js';
import './cards/MatchCenter/soccer-live-match-center.js';
import './cards/TeamForm/soccer-live-team-form.js';
import './cards/Club/soccer-live-club.js';
import './cards/Diagnostics/soccer-live-diagnostics.js';
import './cards/Ticker/soccer-live-ticker.js';
import './cards/Lineup/soccer-live-lineup.js';
import './cards/Timeline/soccer-live-timeline.js';
import './cards/Schedule/soccer-live-schedule.js';
import './cards/Matchday/soccer-live-matchday.js';
import './cards/Archive/soccer-live-archive.js';
import './cards/LastMatch/soccer-live-last-match.js';

// ─── Card type registry ───────────────────────────────────────────────────────

const CARD_MODULES = {
  team: { editor: () => import('./cards/Team/soccer-live-team-editor.js') },
  standings: { editor: () => import('./cards/Standings/soccer-live-standings-editor.js') },
  matches: { editor: () => import('./cards/Tutte/soccer-live-matches-editor.js') },
  countdown: { editor: () => import('./cards/Countdown/soccer-live-countdown-editor.js') },
  news: { editor: () => import('./cards/News/soccer-live-news-editor.js') },
  bracket: { editor: () => import('./cards/Bracket/soccer-live-bracket-editor.js') },
  'mini-standings': { editor: () => import('./cards/MiniStandings/soccer-live-mini-standings-editor.js') },
  scorers: { editor: () => import('./cards/Scorers/soccer-live-scorers-editor.js') },
  'multi-team': { editor: () => import('./cards/MultiTeam/soccer-live-multi-team-editor.js') },
  'team-competitions': { editor: () => import('./cards/TeamCompetitions/soccer-live-team-competitions-editor.js') },
  'match-center': { editor: () => import('./cards/MatchCenter/soccer-live-match-center-editor.js') },
  hub: { editor: () => import('./cards/MatchCenter/soccer-live-match-center-editor.js') },
  'team-form': { editor: () => import('./cards/TeamForm/soccer-live-team-form-editor.js') },
  club: { editor: () => import('./cards/Club/soccer-live-club-editor.js') },
  diagnostics: { editor: () => import('./cards/Diagnostics/soccer-live-diagnostics-editor.js') },
  ticker: { editor: () => import('./cards/Ticker/soccer-live-ticker-editor.js') },
  lineup: { editor: () => import('./cards/Lineup/soccer-live-lineup-editor.js') },
  timeline: { editor: () => import('./cards/Timeline/soccer-live-timeline-editor.js') },
  minimal: { editor: () => import('./cards/Schedule/soccer-live-schedule-editor.js') },
  matchday: { editor: () => import('./cards/Insights/soccer-live-insights-editor.js') },
  archive: { editor: () => import('./cards/Insights/soccer-live-insights-editor.js') },
  'last-match': { editor: () => import('./cards/LastMatch/soccer-live-last-match-editor.js') },
};

const MODULE_PROMISES = new Map();
function loadCardModule(type, kind) {
  const normalized = type === 'schedule' ? 'minimal' : type;
  const loader = CARD_MODULES[normalized]?.[kind];
  if (!loader) return Promise.resolve();
  const key = `${normalized}:${kind}`;
  if (!MODULE_PROMISES.has(key)) MODULE_PROMISES.set(key, loader());
  return MODULE_PROMISES.get(key);
}

const CARD_REGISTRY = [
  { value: 'team',              element: 'soccer-live-team',              label: '⚽ Próximo Jogo / Ao Vivo', description: 'Placar ao vivo, relógio, alinhamento e tempo' },
  { value: 'standings',         element: 'soccer-live-standings',         label: '📊 Classificação',         description: 'Tabela classificativa da liga' },
  { value: 'last-match',        element: 'soccer-live-last-match',        label: '⏪ Último Jogo',            description: 'Resultado do último jogo terminado' },
  { value: 'scorers',           element: 'soccer-live-scorers',           label: '🥇 Melhores Marcadores',   description: 'Tabela dos melhores marcadores' },
  { value: 'news',              element: 'soccer-live-news',              label: '📰 Notícias',              description: 'Feed de artigos e notícias' },
  { value: 'bracket',           element: 'soccer-live-bracket',           label: '🏆 Taça / Eliminatórias',  description: 'Árvore de eliminatórias e taças' },
  { value: 'club',              element: 'soccer-live-club',              label: '🏢 Perfil do Clube',       description: 'Perfil completo com plantel e transferências' },
  { value: 'countdown',         element: 'soccer-live-countdown',         label: '⏱️ Contagem Decrescente',  description: 'Temporizador até ao jogo' },
  { value: 'matches',           element: 'soccer-live-matches',           label: '📋 Lista de Jogos',        description: 'Lista de jogos por dia/jornada' },
  { value: 'match-center',      element: 'soccer-live-match-center',      label: '🏟️ Central do Jogo',       description: 'Vista em abas do jogo, stats e timeline' },
];

const TYPE_TO_ELEMENT = Object.fromEntries(CARD_REGISTRY.map(c => [c.value, c.element]));
const LEGACY_ELEMENTS = new Set(CARD_REGISTRY.map(c => c.element));
const CARD_TYPES      = CARD_REGISTRY.map(({ value, label, description }) => ({ value, label, description }));
const CARD_EDITORS    = Object.fromEntries(CARD_REGISTRY.filter(c => c.editor).map(c => [c.value, c.editor]));

function resolveElement(cardType) {
  const t = cardType === 'schedule' ? 'minimal' : cardType;
  return TYPE_TO_ELEMENT[t] || (LEGACY_ELEMENTS.has(t) ? t : null);
}

const MODULE_TYPE_ICONS = {
  team: '⚽',
  standings: '📊',
  'last-match': '⏪',
  scorers: '🥇',
  news: '📰',
  bracket: '🏆',
  club: '🏢',
  countdown: '⏱️',
  matches: '📋',
  'match-center': '🏟️',
};

const WRAPPER_TYPE = 'custom:soccer-live-hub';

// ─── Wrapper card (Modular Main Card) ─────────────────────────────────────────

class SoccerLiveCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = {};
    this._activeModuleId = null;
    this._tabBar = null;
    this._contentContainer = null;
    this._childElements = new Map();
  }

  set hass(hass) {
    this._hass = hass;
    for (const [id, child] of this._childElements.entries()) {
      const mod = this._getModules().find(m => m.id === id);
      if (mod && child) {
        const resolvedEntity = this._resolveModuleEntity(mod);
        const modConfig = { skin: this._config.skin, language: this._config.language, ...mod, entity: resolvedEntity, card_type: mod.type };
        child.hass = blendHassSources(hass, modConfig);
        child._isLoading = false;
      }
    }
  }

  _getModules() {
    if (Array.isArray(this._config?.modules) && this._config.modules.length > 0) {
      return this._config.modules.filter(Boolean);
    }
    const models = discoverSoccerModels(this._hass, this._config);
    const defaults = [];
    if (models.match_model) defaults.push({ id: 'mod_match', type: 'team', title: 'Próximo Jogo', entity: models.match_model });
    if (models.standings_model) defaults.push({ id: 'mod_standings', type: 'standings', title: 'Classificação', entity: models.standings_model });
    if (models.last_match_model) defaults.push({ id: 'mod_last', type: 'last-match', title: 'Último Jogo', entity: models.last_match_model });
    if (models.scorers_model) defaults.push({ id: 'mod_scorers', type: 'scorers', title: 'Melhores Marcadores', entity: models.scorers_model });
    if (models.bracket_model) defaults.push({ id: 'mod_bracket', type: 'bracket', title: 'Taças', entity: models.bracket_model });
    if (models.club_model) defaults.push({ id: 'mod_club', type: 'club', title: 'Clube', entity: models.club_model });

    if (!defaults.length && this._config?.entity) {
      defaults.push({ id: 'mod_default', type: this._config.card_type || 'team', title: 'Futebol', entity: this._config.entity });
    }
    return defaults;
  }

  _getGroupedModules() {
    const modules = this._getModules();
    const groups = new Map();
    if (!Array.isArray(modules)) return groups;
    for (const mod of modules) {
      if (!mod) continue;
      const teamName = mod.team || this._config.team || 'Geral';
      if (!groups.has(teamName)) groups.set(teamName, []);
      const list = groups.get(teamName);
      if (list) list.push(mod);
    }
    return groups;
  }

  _resolveModuleEntity(mod) {
    if (mod.entity && this._hass?.states?.[mod.entity]) {
      const stateObj = this._hass.states[mod.entity];
      const sensorType = stateObj?.attributes?.sensor_type;
      if (sensorType) {
        if (mod.type === 'team' && ['team_match', 'team_matches_mixed', 'team_matches'].includes(sensorType)) return mod.entity;
        if (mod.type === 'standings' && sensorType === 'standings') return mod.entity;
        if (mod.type === 'scorers' && sensorType === 'top_scorers') return mod.entity;
        if (mod.type === 'last-match' && (sensorType === 'last_match' || mod.entity.includes('last'))) return mod.entity;
        if (mod.type === 'news' && sensorType === 'news') return mod.entity;
        if (mod.type === 'bracket' && sensorType === 'bracket') return mod.entity;
        if (mod.type === 'club' && sensorType === 'club') return mod.entity;
      } else {
        return mod.entity;
      }
    }
    const models = discoverSoccerModels(this._hass, this._config);
    if (mod.type === 'team' || mod.type === 'match-center') return models.match_model || mod.entity;
    if (mod.type === 'standings') return models.standings_model || mod.entity;
    if (mod.type === 'scorers') return models.scorers_model || mod.entity;
    if (mod.type === 'last-match') return models.last_match_model || mod.entity;
    if (mod.type === 'news') return models.news_model || mod.entity;
    if (mod.type === 'bracket') return models.bracket_model || mod.entity;
    if (mod.type === 'club') return models.club_model || mod.entity;
    return mod.entity || models.match_model;
  }

  setConfig(config) {
    this._config = config || {};
    applySkin(this, this._config);
    this._renderCard();
  }

  _renderCard() {
    const modules = this._getModules();
    const layout = this._config.layout || 'tabs';
    applySkin(this, this._config);

    if (!modules.length) {
      this.innerHTML = '';
      this.appendChild(this._placeholder());
      return;
    }

    if (layout === 'stack') {
      this.innerHTML = '';
      this._tabBar = null;
      const stackWrapper = document.createElement('div');
      stackWrapper.className = 'soccer-live-stack-wrapper';
      stackWrapper.style.cssText = 'display:flex;flex-direction:column;gap:12px;';

      for (const mod of modules) {
        const modCard = this._createModuleElement(mod);
        if (modCard) stackWrapper.appendChild(modCard);
      }
      this.appendChild(stackWrapper);
      return;
    }

    if (!this._tabBar) {
      this.innerHTML = '';
      const wrapper = document.createElement('ha-card');
      wrapper.className = 'soccer-live-hub-wrapper';
      wrapper.style.cssText = 'border-radius: 20px; overflow: hidden; padding: 0;';

      if (this._config.title) {
        const header = document.createElement('div');
        header.className = 'soccer-live-card-title';
        header.style.cssText = 'font-size:16px;font-weight:700;padding:12px 16px 4px;color:var(--primary-text-color,#fff);';
        header.textContent = this._config.title;
        wrapper.appendChild(header);
      }

      this._tabBar = document.createElement('div');
      this._tabBar.className = 'soccer-live-hub-tab-bar';
      this._tabBar.style.cssText = 'display:flex;flex-direction:column;background:var(--card-background-color,rgba(0,0,0,0.03));border-bottom:1px solid var(--divider-color,rgba(0,0,0,0.08));';

      this._contentContainer = document.createElement('div');
      this._contentContainer.className = 'soccer-live-hub-content';

      wrapper.appendChild(this._tabBar);
      wrapper.appendChild(this._contentContainer);
      this.appendChild(wrapper);
    }

    const groups = this._getGroupedModules();
    const teams = [...groups.keys()];
    if (!this._activeTeam || !groups.has(this._activeTeam)) {
      this._activeTeam = teams[0];
    }
    const teamModules = groups.get(this._activeTeam) || [];
    let activeMod = teamModules.find(m => m.id === this._activeModuleId);
    if (!activeMod) {
      activeMod = teamModules[0];
      this._activeModuleId = activeMod?.id;
    }

    this._updateTabBar(modules);

    this._contentContainer.innerHTML = '';
    const activeEl = activeMod ? this._createModuleElement(activeMod) : null;
    if (activeEl) this._contentContainer.appendChild(activeEl);
  }

  _updateTabBar(modules) {
    if (!this._tabBar) return;
    this._tabBar.innerHTML = '';

    const groups = this._getGroupedModules();
    const teams = [...groups.keys()];

    if (!this._activeTeam || !groups.has(this._activeTeam)) {
      this._activeTeam = teams[0];
    }

    const teamModules = groups.get(this._activeTeam) || [];
    let activeMod = teamModules.find(m => m.id === this._activeModuleId);
    if (!activeMod) {
      activeMod = teamModules[0];
      this._activeModuleId = activeMod?.id;
    }

    // ─── TIER 1: Teams Selector (F1 Style Top Row) ───────────────────────────
    if (teams.length > 1) {
      const teamsRow = document.createElement('div');
      teamsRow.style.cssText = 'display:flex;gap:16px;padding:12px 16px;background:var(--card-background-color,rgba(0,0,0,0.05));border-bottom:1px solid var(--divider-color,rgba(0,0,0,0.1));overflow-x:auto;scrollbar-width:none;';
      for (const team of teams) {
        const isTeamActive = team === this._activeTeam;
        const btn = document.createElement('button');
        btn.style.cssText = `
          background: ${isTeamActive ? 'var(--card-background-color, #ffffff)' : 'transparent'};
          color: var(--primary-text-color);
          border: none;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          border-bottom: 3px solid ${isTeamActive ? 'var(--primary-color, #03a9f4)' : 'transparent'};
          box-shadow: ${isTeamActive ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'};
          transition: all 0.2s ease;
          white-space: nowrap;
        `;
        btn.textContent = team;
        btn.addEventListener('click', () => {
          this._activeTeam = team;
          const firstModOfTeam = groups.get(team)?.[0];
          this._activeModuleId = firstModOfTeam?.id;
          this._renderCard();
        });
        teamsRow.appendChild(btn);
      }
      this._tabBar.appendChild(teamsRow);
    }

    // ─── TIER 2: Modules Selector (Bottom Row for Active Team) ────────────────
    const modulesRow = document.createElement('div');
    modulesRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;padding:10px 16px;background:var(--card-background-color,rgba(0,0,0,0.01));';
    for (const mod of teamModules) {
      const isModActive = mod.id === this._activeModuleId;
      const btn = document.createElement('button');
      btn.style.cssText = `
        background: ${isModActive ? '#111111' : 'var(--card-background-color, #ffffff)'};
        color: ${isModActive ? '#ffffff' : 'var(--primary-text-color, #000000)'};
        border: 1px solid ${isModActive ? '#111111' : 'var(--divider-color, rgba(0,0,0,0.15))'};
        border-radius: 10px;
        padding: 8px 14px;
        font-size: 12px;
        font-weight: ${isModActive ? '700' : '500'};
        text-transform: uppercase;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        transition: all 0.2s ease;
      `;
      btn.textContent = mod.title || mod.type;
      btn.addEventListener('click', () => {
        this._activeModuleId = mod.id;
        this._renderCard();
      });
      modulesRow.appendChild(btn);
    }
    this._tabBar.appendChild(modulesRow);
  }

  _createModuleElement(mod) {
    const type = mod.type || 'team';
    const elementName = resolveElement(type);
    if (!elementName || !customElements.get(elementName)) {
      return this._errorCard(`Módulo desconhecido: ${type}`);
    }

    let el = this._childElements.get(mod.id);
    if (!el || el.tagName.toLowerCase() !== elementName) {
      el = document.createElement(elementName);
      this._childElements.set(mod.id, el);
    }

    const resolvedEntity = this._resolveModuleEntity(mod);

    const modConfig = {
      skin: this._config.skin,
      appearance: this._config.appearance,
      palette: this._config.palette,
      language: this._config.language,
      ...mod,
      entity: resolvedEntity,
      card_type: type,
    };

    try {
      el.setConfig(modConfig);
    } catch (e) {
      if (modConfig.entity) console.warn(`SoccerLiveCard: setConfig failed for module ${mod.id}:`, e);
    }
    if (this._hass) {
      el.hass = blendHassSources(this._hass, modConfig);
      el._isLoading = false;
    }

    setTimeout(() => {
      if (el.shadowRoot) {
        const styleId = 'soccer-live-hub-flatten';
        if (!el.shadowRoot.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            ha-card {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          `;
          el.shadowRoot.appendChild(style);
        }
      }
    }, 50);

    return el;
  }

  _placeholder() {
    const el = document.createElement('ha-card');
    el.style.cssText = 'padding:24px;text-align:center;color:#94a3b8;font-size:13px;';
    const lang = this._hass ? (this._hass.language || 'en').split('-')[0] : 'en';
    el.textContent = t('ui.open_editor_to_configure', lang);
    return el;
  }

  _errorCard(message) {
    const el = document.createElement('ha-card');
    el.style.cssText = 'padding:24px;text-align:center;color:#ef4444;font-size:13px;border:1px solid rgba(239,68,68,0.3);';
    el.textContent = message;
    return el;
  }

  getCardSize() { return 8; }

  static getConfigElement() {
    return document.createElement('soccer-live-hub-editor');
  }

  static getStubConfig() { return { title: 'Futebol', layout: 'tabs', modules: [] }; }
}

if (!customElements.get('soccer-live-hub')) {
  customElements.define('soccer-live-hub', SoccerLiveCard);
}

// ─── Modular Visual Editor ─────────────────────────────────────────────────────

class SoccerLiveCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
      _selectedModuleIndex: { type: Number },
    };
  }

  constructor() {
    super();
    this._config = {};
    this._selectedModuleIndex = 0;
  }

  setConfig(config) {
    this._config = { ...(config || {}) };
    if (!Array.isArray(this._config.modules) || this._config.modules.length === 0) {
      const models = discoverSoccerModels(this.hass, this._config);
      const defaults = [];
      if (models.match_model) defaults.push({ id: 'mod_match', type: 'team', title: 'Próximo Jogo', entity: models.match_model });
      if (models.standings_model) defaults.push({ id: 'mod_standings', type: 'standings', title: 'Classificação', entity: models.standings_model });
      if (models.last_match_model) defaults.push({ id: 'mod_last', type: 'last-match', title: 'Último Jogo', entity: models.last_match_model });
      if (models.scorers_model) defaults.push({ id: 'mod_scorers', type: 'scorers', title: 'Melhores Marcadores', entity: models.scorers_model });
      if (models.bracket_model) defaults.push({ id: 'mod_bracket', type: 'bracket', title: 'Taças', entity: models.bracket_model });
      if (models.club_model) defaults.push({ id: 'mod_club', type: 'club', title: 'Clube', entity: models.club_model });

      this._config.modules = defaults;
    }
    this.requestUpdate();
  }

  _t(key, vars) {
    return t(key, resolveLang(this.hass, this._config), vars);
  }

  _dispatch(config) {
    const nextConfig = { ...config, type: WRAPPER_TYPE };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: nextConfig },
      bubbles: true,
      composed: true,
    }));
  }

  _moveModule(index, direction) {
    const modules = [...(this._config.modules || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= modules.length) return;
    const temp = modules[index];
    modules[index] = modules[targetIdx];
    modules[targetIdx] = temp;
    this._selectedModuleIndex = targetIdx;
    this._dispatch({ ...this._config, modules });
  }

  _addModule(type) {
    if (!type) return;
    const item = CARD_REGISTRY.find(c => c.value === type);
    const title = item ? item.label.replace(/^[^\w\s]+\s*/, '') : type;
    const models = discoverSoccerModels(this.hass, this._config);

    let defaultEntity = '';
    if (type === 'team') defaultEntity = models.match_model;
    else if (type === 'standings') defaultEntity = models.standings_model;
    else if (type === 'scorers') defaultEntity = models.scorers_model;
    else if (type === 'last-match') defaultEntity = models.last_match_model;
    else if (type === 'news') defaultEntity = models.news_model;
    else if (type === 'bracket') defaultEntity = models.bracket_model;
    else if (type === 'club') defaultEntity = models.club_model;

    const newMod = {
      id: `mod_${Date.now()}`,
      type,
      title,
      entity: defaultEntity,
    };
    const modules = [...(this._config.modules || []), newMod];
    this._selectedModuleIndex = modules.length - 1;
    this._dispatch({ ...this._config, modules });
  }

  _duplicateModule(index) {
    const modules = [...(this._config.modules || [])];
    const source = modules[index];
    if (!source) return;
    const cloned = { ...source, id: `mod_${Date.now()}`, title: `${source.title} (Cópia)` };
    modules.splice(index + 1, 0, cloned);
    this._selectedModuleIndex = index + 1;
    this._dispatch({ ...this._config, modules });
  }

  _removeModule(index) {
    const modules = [...(this._config.modules || [])];
    modules.splice(index, 1);
    this._selectedModuleIndex = Math.max(0, index - 1);
    this._dispatch({ ...this._config, modules });
  }

  _updateSelectedModule(key, value) {
    const modules = (this._config.modules || []).map((mod, idx) => {
      if (idx !== this._selectedModuleIndex) return mod;
      const nextMod = { ...mod };
      if (value === '' || value === null || value === undefined) {
        delete nextMod[key];
      } else {
        nextMod[key] = value;
      }
      return nextMod;
    });
    this._dispatch({ ...this._config, modules });
  }

  _moduleTeamChanged(teamName) {
    const modules = (this._config.modules || []).map((mod, idx) => {
      if (idx !== this._selectedModuleIndex) return mod;
      const nextMod = { ...mod, team: teamName };
      if (!teamName) delete nextMod.team;
      const models = discoverSoccerModels(this.hass, { ...this._config, team: teamName || this._config.team });
      if (mod.type === 'team' || mod.type === 'match-center') nextMod.entity = models.match_model || mod.entity;
      else if (mod.type === 'standings') nextMod.entity = models.standings_model || mod.entity;
      else if (mod.type === 'scorers') nextMod.entity = models.scorers_model || mod.entity;
      else if (mod.type === 'last-match') nextMod.entity = models.last_match_model || mod.entity;
      else if (mod.type === 'bracket') nextMod.entity = models.bracket_model || mod.entity;
      else if (mod.type === 'club') nextMod.entity = models.club_model || mod.entity;
      return nextMod;
    });
    this._dispatch({ ...this._config, modules });
  }

  _teamChanged(teamName) {
    if (!teamName) {
      const next = { ...this._config };
      delete next.team;
      this._dispatch(next);
      return;
    }

    const models = discoverSoccerModels(this.hass, { ...this._config, team: teamName });
    const modules = (this._config.modules || []).map(mod => {
      const updated = { ...mod };
      if (mod.type === 'team' || mod.type === 'match-center') updated.entity = models.match_model || mod.entity;
      else if (mod.type === 'standings') updated.entity = models.standings_model || mod.entity;
      else if (mod.type === 'scorers') updated.entity = models.scorers_model || mod.entity;
      else if (mod.type === 'last-match') updated.entity = models.last_match_model || mod.entity;
      else if (mod.type === 'bracket') updated.entity = models.bracket_model || mod.entity;
      else if (mod.type === 'club') updated.entity = models.club_model || mod.entity;
      return updated;
    });

    const title = (!this._config.title || this._config.title === 'Futebol') ? teamName : this._config.title;
    this._dispatch({
      ...this._config,
      team: teamName,
      title,
      modules,
    });
  }

  render() {
    const modules = this._config.modules || [];
    const selectedIdx = Math.min(this._selectedModuleIndex, Math.max(0, modules.length - 1));
    const selectedMod = modules[selectedIdx] || null;
    const availableTeams = discoverSoccerTeams(this.hass);

    return html`
      <!-- WHOLE CARD SECTION -->
      <div class="editor-box card-box">
        <div class="box-header">
          <span class="badge badge-card">CARD</span>
          <div class="box-title-group">
            <span class="box-title">${this._t('editor.whole_card')}</span>
            <span class="box-subtitle">${this._t('editor.whole_card_desc')}</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">${this._t('editor.card_title')}</label>
          <input
            type="text"
            .value=${this._config.title || ''}
            placeholder="ex. Futebol"
            @change=${e => this._dispatch({ ...this._config, title: e.target.value })}
          >
        </div>

        <div class="field-group">
          <label class="field-label">${this._t('editor.layout_mode')}</label>
          <select
            .value=${this._config.layout || 'tabs'}
            @change=${e => this._dispatch({ ...this._config, layout: e.target.value })}
          >
            <option value="tabs" ?selected=${(this._config.layout || 'tabs') === 'tabs'}>${this._t('editor.layout_tabs')}</option>
            <option value="stack" ?selected=${this._config.layout === 'stack'}>${this._t('editor.layout_stack')}</option>
          </select>
        </div>

        <div class="field-group" style="margin-top: 16px; border-top: 1px solid var(--divider-color, rgba(0,0,0,0.1)); padding-top: 12px;">
          ${renderAppearanceControl(this, this._config, k => this._t(k))}
        </div>
      </div>

      <!-- MODULES MANAGEMENT SECTION -->
      <div class="editor-box module-box">
        <div class="box-header">
          <span class="badge badge-module">MODULE</span>
          <div class="box-title-group">
            <span class="box-title">${this._t('editor.selected_content')}</span>
            <span class="box-subtitle">${this._t('editor.selected_content_desc')}</span>
          </div>
        </div>

        <div class="modules-list">
          ${modules.map((mod, index) => {
            const isSelected = index === selectedIdx;
            const numStr = String(index + 1).padStart(2, '0');
            return html`
              <div
                class="module-item ${isSelected ? 'selected' : ''}"
                @click=${() => { this._selectedModuleIndex = index; this.requestUpdate(); }}
              >
                <span class="module-num">${numStr}</span>
                <span class="module-title">${mod.title || mod.type}</span>
                <div class="module-arrows" @click=${e => e.stopPropagation()}>
                  <button
                    class="arrow-btn"
                    ?disabled=${index === 0}
                    @click=${() => this._moveModule(index, -1)}
                  >↑</button>
                  <button
                    class="arrow-btn"
                    ?disabled=${index === modules.length - 1}
                    @click=${() => this._moveModule(index, 1)}
                  >↓</button>
                </div>
              </div>
            `;
          })}
        </div>

        <div class="add-module-wrap">
          <label class="field-label">${this._t('editor.add_module')}</label>
          <select @change=${e => { this._addModule(e.target.value); e.target.value = ''; }}>
            <option value="">${this._t('editor.choose_content')}</option>
            ${CARD_REGISTRY.map(c => html`<option value=${c.value}>${c.label}</option>`)}
          </select>
        </div>
      </div>

      <!-- EDITING SELECTED MODULE SECTION -->
      ${selectedMod ? html`
        <div class="editor-box editing-box">
          <div class="box-header">
            <span class="badge badge-editing">${selectedIdx + 1}</span>
            <div class="box-title-group">
              <span class="box-title">${this._t('editor.editing_module', { current: selectedIdx + 1, total: modules.length })}</span>
              <span class="box-subtitle">${this._t('editor.editing_module_desc')}</span>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Equipa do Módulo</label>
            <select
              .value=${selectedMod.team || this._config.team || ''}
              @change=${e => this._moduleTeamChanged(e.target.value)}
            >
              <option value="">— Herdar equipa do cartão (${this._config.team || 'Geral'}) —</option>
              ${availableTeams.map(t => html`
                <option value=${t.name} ?selected=${(selectedMod.team || this._config.team) === t.name}>${t.name}</option>
              `)}
            </select>
          </div>

          <div class="field-group">
            <label class="field-label">${this._t('editor.module_title')}</label>
            <input
              type="text"
              .value=${selectedMod.title || ''}
              @change=${e => this._updateSelectedModule('title', e.target.value)}
            >
          </div>

          <div class="field-group">
            <label class="field-label">${this._t('editor.entity')}</label>
            <ha-entity-picker
              .key=${selectedMod.entity || ''}
              .hass=${this.hass}
              .value=${selectedMod.entity || ''}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${e => this._updateSelectedModule('entity', e.detail?.value || '')}
            ></ha-entity-picker>
          </div>

          <div class="module-actions">
            <button class="btn btn-secondary" @click=${() => this._duplicateModule(selectedIdx)}>${this._t('editor.duplicate_module')}</button>
            <button class="btn btn-danger" @click=${() => this._removeModule(selectedIdx)}>${this._t('editor.remove_module')}</button>
          </div>
        </div>
      ` : ''}
    `;
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .editor-box {
        border-radius: 12px;
        padding: 16px;
        background: var(--card-background-color, #ffffff);
        border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
      }
      .card-box {
        border: 2px solid #0284c7;
        background: rgba(2, 132, 199, 0.03);
      }
      .module-box, .editing-box {
        border: 2px solid #dc2626;
        background: rgba(220, 38, 38, 0.03);
      }
      .box-header {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 14px;
      }
      .badge {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.05em;
        padding: 3px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        display: inline-block;
      }
      .badge-card {
        border: 1.5px solid #0284c7;
        color: #0284c7;
      }
      .badge-module {
        border: 1.5px solid #dc2626;
        color: #dc2626;
      }
      .badge-editing {
        border: 1.5px solid #dc2626;
        color: #dc2626;
        padding: 2px 8px;
      }
      .box-title-group {
        display: flex;
        flex-direction: column;
      }
      .box-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--primary-text-color);
      }
      .box-subtitle {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 2px;
      }
      .field-group {
        margin-bottom: 12px;
      }
      .field-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 4px;
        color: var(--secondary-text-color);
      }
      input[type="text"], select {
        box-sizing: border-box;
        width: 100%;
        padding: 10px 12px;
        font-size: 14px;
        border-radius: 8px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.15));
        background: var(--card-background-color, #ffffff);
        color: var(--primary-text-color);
      }
      ha-entity-picker {
        display: block;
        width: 100%;
      }
      .modules-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 14px;
      }
      .module-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 10px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
        background: var(--card-background-color, #ffffff);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .module-item.selected {
        border: 2px solid #dc2626;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
      }
      .module-num {
        font-size: 12px;
        font-weight: 700;
        color: var(--secondary-text-color);
      }
      .module-icon {
        font-size: 14px;
      }
      .module-title {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .module-arrows {
        display: flex;
        gap: 4px;
      }
      .arrow-btn {
        width: 30px;
        height: 30px;
        border-radius: 6px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.15));
        background: var(--card-background-color, #f8fafc);
        color: var(--primary-text-color);
        font-size: 13px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .arrow-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .add-module-wrap {
        margin-top: 10px;
      }
      .module-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }
      .btn {
        padding: 8px 16px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        border: 1px solid transparent;
      }
      .btn-secondary {
        background: var(--card-background-color, #f1f5f9);
        color: var(--primary-text-color);
        border-color: var(--divider-color, #cbd5e1);
      }
      .btn-danger {
        background: rgba(220, 38, 38, 0.1);
        color: #dc2626;
        border-color: rgba(220, 38, 38, 0.3);
      }
    `;
  }
}

if (!customElements.get('soccer-live-hub-editor')) {
  customElements.define('soccer-live-hub-editor', SoccerLiveCardEditor);
}

// ─── Custom Card Registration ───────────────────────────────────────────────

window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'soccer-live-hub')) {
  window.customCards.push({
    type: 'soccer-live-hub',
    name: 'Soccer Live Hub Card (Modular)',
    description: 'Modular football hub card with reorderable modules, tabs or stack layout.',
    preview: false,
    documentationURL: 'https://github.com/nelsonamen/Teste',
  });
}
