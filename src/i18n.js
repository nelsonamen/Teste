// Complete i18n & Date Helpers for Soccer Live Hub

const TRANSLATIONS = {
  pt: {
    'card.team': 'Próximo Jogo',
    'card.standings': 'Classificação',
    'card.last_match': 'Último Jogo',
    'match.vs': 'VS',
    'match.draw': 'Empate',
    'time.now': 'Agora',
    'time.tomorrow': 'Amanhã',
    'time.in_n_min': 'em {n} min',
    'time.in_n_h': 'em {n} h',
    'time.in_n_d': 'em {n} dias',
    'time.in_duration': 'em {value}',
    'status.live': 'AO VIVO',
    'status.finished': 'Terminado',
    'status.scheduled': 'Agendado',
    'status.full_time': 'Fim do Jogo',
    'form.W': 'V',
    'form.D': 'E',
    'form.L': 'D',
    'team.top_scorer': 'Melhor Marcador',
    'team.possession': 'Posse de bola',
    'team.xg': 'Golos Esperados (xG)',
    'team.shots': 'Remates',
    'team.on_target': 'Remates à baliza',
    'team.fouls': 'Faltas',
    'team.form_trend': 'Forma',
    'team.previous_matches': 'Jogos Anteriores',
    'team.upcoming_matches': 'Próximos Jogos',
    'team.h2h': 'Confronto Direto (H2H)',
    'team.off_season': 'Período de inter-época',
    'popup.match_details': 'Detalhes do Jogo',
    'popup.h2h': 'Confronto Direto',
    'event.goal': 'Golo',
    'event.yellow_card': 'Cartão Amarelo',
    'event.red_card': 'Cartão Vermelho',
    'generic.close': 'Fechar',
    'col.pos': '#',
    'col.team': 'EQUIPA',
    'col.played': 'J',
    'col.wins': 'V',
    'col.draws': 'E',
    'col.losses': 'D',
    'col.gd': '+/-',
    'col.points': 'PTS',
    'col.goal_diff': 'DG',
    'col.form': 'Forma',
    'ui.loading': 'A carregar...',
    'ui.open_editor_to_configure': 'Abre o editor visual para configurar o cartão',
    'generic.unknown_entity': 'Entidade desconhecida',
    'ui.no_standings_data': 'Sem dados de classificação disponíveis',
    'ui.entity_not_found': 'Entidade não encontrada',
    'ui.sensor_unavailable': 'Sensor indisponível',
    'ui.sensor_unavailable_hint': 'O sensor de futebol não está a responder',
    'ui.loading_timeout': 'Tempo esgotado ao carregar',
    'ui.entity_not_responding': 'Entidade sem resposta',
    'ui.wrong_entity_type': 'Tipo de entidade incorreto',
    'ui.off_season': 'Fora de época',
    'standings.preseason': 'Época {season} (Pré-época)',
    'standings.stats': 'jogos disputados',
    'standings.goals': 'golos',
    'standings.compact_hidden': 'equipas ocultas',
    'editor.whole_card': 'Configurações Globais do Cartão',
    'editor.whole_card_desc': 'Estas opções aplicam-se a todos os módulos',
    'editor.card_title': 'Título do Cartão',
    'editor.layout_mode': 'Modo de Visualização',
    'editor.layout_tabs': 'Abas (Navegação Superior / Inferior)',
    'editor.layout_stack': 'Lista Vertical (Empilhado)',
    'editor.selected_content': 'Módulos Selecionados',
    'editor.selected_content_desc': 'Reordena, adiciona ou remove módulos',
    'editor.add_module': 'Adicionar Módulo',
    'editor.choose_content': 'Escolher conteúdo...',
    'editor.editing_module': 'A Editar Módulo {current} de {total}',
    'editor.editing_module_desc': 'Personaliza o título e entidade deste módulo',
    'editor.module_title': 'Título do Módulo',
    'editor.entity': 'Entidade (Sensor)',
    'editor.duplicate_module': 'Duplicar Módulo',
    'editor.remove_module': 'Remover Módulo',
    'skin.appearance_ha': 'Automático (Tema Home Assistant)',
    'skin.appearance_light': 'Claro (Light)',
    'skin.appearance_dark': 'Escuro (Dark)',
    'skin.palette_team': 'Cores Padrão',
    'skin.palette_blue': 'Azul Royal',
    'skin.palette_custom': 'Personalizado',
  },
  en: {
    'card.team': 'Next Match',
    'card.standings': 'Standings',
    'card.last_match': 'Last Match',
    'match.vs': 'VS',
    'match.draw': 'Draw',
    'time.now': 'Now',
    'time.tomorrow': 'Tomorrow',
    'time.in_n_min': 'in {n} min',
    'time.in_n_h': 'in {n} h',
    'time.in_n_d': 'in {n} days',
    'time.in_duration': 'in {value}',
    'status.live': 'LIVE',
    'status.finished': 'Finished',
    'status.scheduled': 'Scheduled',
    'status.full_time': 'Full Time',
    'form.W': 'W',
    'form.D': 'D',
    'form.L': 'L',
    'team.top_scorer': 'Top Scorer',
    'team.possession': 'Possession',
    'team.xg': 'Expected Goals (xG)',
    'team.shots': 'Shots',
    'team.on_target': 'Shots on target',
    'team.fouls': 'Fouls',
    'team.form_trend': 'Form',
    'team.previous_matches': 'Previous Matches',
    'team.upcoming_matches': 'Upcoming Matches',
    'team.h2h': 'Head-to-Head (H2H)',
    'team.off_season': 'Off season',
    'popup.match_details': 'Match Details',
    'popup.h2h': 'Head-to-Head',
    'event.goal': 'Goal',
    'event.yellow_card': 'Yellow Card',
    'event.red_card': 'Red Card',
    'generic.close': 'Close',
    'col.pos': '#',
    'col.team': 'TEAM',
    'col.played': 'P',
    'col.wins': 'W',
    'col.draws': 'D',
    'col.losses': 'L',
    'col.gd': '+/-',
    'col.points': 'PTS',
    'col.goal_diff': 'GD',
    'col.form': 'Form',
    'ui.loading': 'Loading...',
    'ui.open_editor_to_configure': 'Open the visual editor to configure the card',
    'generic.unknown_entity': 'Unknown entity',
    'ui.no_standings_data': 'No standings data available',
    'ui.entity_not_found': 'Entity not found',
    'ui.sensor_unavailable': 'Sensor unavailable',
    'ui.sensor_unavailable_hint': 'Soccer sensor is not responding',
    'ui.loading_timeout': 'Loading timeout',
    'ui.entity_not_responding': 'Entity not responding',
    'ui.wrong_entity_type': 'Incorrect entity type',
    'ui.off_season': 'Off season',
    'standings.preseason': 'Season {season} (Pre-season)',
    'standings.stats': 'matches played',
    'standings.goals': 'goals',
    'standings.compact_hidden': 'hidden teams',
    'editor.whole_card': 'Card Settings',
    'editor.whole_card_desc': 'These settings apply to every module',
    'editor.card_title': 'Card Title',
    'editor.layout_mode': 'Layout Mode',
    'editor.layout_tabs': 'Tabs (Two-tier Navigation)',
    'editor.layout_stack': 'Vertical Stack',
    'editor.selected_content': 'Selected Modules',
    'editor.selected_content_desc': 'Reorder, add, or remove modules',
    'editor.add_module': 'Add Module',
    'editor.choose_content': 'Choose content...',
    'editor.editing_module': 'Editing Module {current} of {total}',
    'editor.editing_module_desc': 'Customize title and entity for this module',
    'editor.module_title': 'Module Title',
    'editor.entity': 'Entity (Sensor)',
    'editor.duplicate_module': 'Duplicate Module',
    'editor.remove_module': 'Remove Module',
    'skin.appearance_ha': 'Automatic (Home Assistant Theme)',
    'skin.appearance_light': 'Light',
    'skin.appearance_dark': 'Dark',
    'skin.palette_team': 'Default Colors',
    'skin.palette_blue': 'Royal Blue',
    'skin.palette_custom': 'Custom',
  }
};

export function resolveLang(hass, config) {
  if (config && config.language) return config.language.toLowerCase();
  const haLang = hass?.locale?.language || hass?.language || 'pt';
  return haLang.split('-')[0].toLowerCase();
}

export function t(key, lang = 'pt', vars = {}) {
  const l = TRANSLATIONS[lang] ? lang : (TRANSLATIONS['pt'] ? 'pt' : 'en');
  let str = TRANSLATIONS[l]?.[key] || TRANSLATIONS['en']?.[key] || key;
  if (str === key) {
    if (key === 'match.vs') return 'VS';
    if (key === 'time.in_n_h') return 'em {n} h';
    if (key === 'time.in_n_min') return 'em {n} min';
    if (key === 'time.in_n_d') return 'em {n} dias';
    if (key === 'time.now') return 'Agora';
    if (key === 'time.tomorrow') return 'Amanhã';
    if (key === 'time.in_duration') return 'em {value}';
    if (key === 'status.live') return 'AO VIVO';
    if (key === 'status.finished') return 'Terminado';
    if (key === 'status.scheduled') return 'Agendado';
  }
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return str;
}

export function parseMatchDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDateOnly(dateStr, lang = 'pt') {
  const d = parseMatchDate(dateStr);
  if (!d) return dateStr || '';
  return d.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatMatchDate(dateStr, lang = 'pt') {
  const d = parseMatchDate(dateStr);
  if (!d) return dateStr || '';
  const day = d.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${day} ${time}`;
}

export function formatMatchDateFull(dateStr, lang = 'pt') {
  const d = parseMatchDate(dateStr);
  if (!d) return dateStr || '';
  const weekday = d.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US', { weekday: 'long' });
  const date = d.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${weekday} ${date} ${time}`;
}
