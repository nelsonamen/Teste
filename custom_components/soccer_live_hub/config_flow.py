from homeassistant import config_entries
import voluptuous as vol
from .const import DOMAIN

LEAGUES_MAP = {
    "Portuguese Primeira Liga": [
        "FC Porto", "Sporting CP", "Benfica", "Braga", "Vitória de Guimarães",
        "Moreirense", "Famalicão", "Casa Pia", "Rio Ave", "Estoril",
        "Gil Vicente", "Boavista", "Farense", "Arouca", "Estrela Amadora",
        "AVS", "Santa Clara", "Nacional"
    ],
    "English Premier League": [
        "Manchester City", "Arsenal", "Liverpool", "Manchester United",
        "Chelsea", "Tottenham Hotspur", "Newcastle United", "Aston Villa",
        "West Ham United", "Brighton", "Crystal Palace", "Brentford"
    ],
    "Spanish La Liga": [
        "Real Madrid", "Barcelona", "Atletico Madrid", "Real Sociedad",
        "Athletic Club", "Real Betis", "Villarreal", "Valencia", "Sevilla"
    ],
    "Italian Serie A": [
        "Inter Milan", "AC Milan", "Juventus", "Napoli", "Atalanta",
        "Roma", "Lazio", "Fiorentina", "Bologna", "Torino"
    ],
    "UEFA Champions League": [
        "Real Madrid", "Manchester City", "Bayern Munich", "Paris Saint-Germain",
        "Inter Milan", "Barcelona", "Arsenal", "Leverkusen", "Atletico Madrid"
    ]
}

class SoccerLiveHubConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    def __init__(self):
        self._data = {}

    async def async_step_user(self, user_input=None):
        """Step 1: Choose what to monitor (Equipa, Liga, Todos os jogos, Notícias)."""
        if user_input is not None:
            self._data.update(user_input)
            monitor = user_input.get("monitor_type")
            if monitor == "Equipa":
                return await self.async_step_select_league()
            elif monitor == "Liga":
                return await self.async_step_select_league_only()
            return self.async_create_entry(title=monitor, data=self._data)

        schema = vol.Schema({
            vol.Required("monitor_type", default="Equipa"): vol.In([
                "Equipa",
                "Liga",
                "Todos os jogos de hoje",
                "Notícias"
            ]),
        })

        return self.async_show_form(step_id="user", data_schema=schema)

    async def async_step_select_league(self, user_input=None):
        """Step 2A: Select competition/league (Equipa — selecionar liga)."""
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_select_team()

        schema = vol.Schema({
            vol.Required("league", default="Portuguese Primeira Liga"): vol.In(list(LEAGUES_MAP.keys())),
        })

        return self.async_show_form(step_id="select_league", data_schema=schema)

    async def async_step_select_team(self, user_input=None):
        """Step 2B: Select team from the chosen league."""
        if user_input is not None:
            self._data.update(user_input)
            team = self._data.get("team", "FC Porto")
            return self.async_create_entry(title=team, data=self._data)

        league = self._data.get("league", "Portuguese Primeira Liga")
        teams = LEAGUES_MAP.get(league, ["FC Porto", "Benfica", "Sporting CP"])

        schema = vol.Schema({
            vol.Required("team", default=teams[0]): vol.In(teams),
        })

        return self.async_show_form(step_id="select_team", data_schema=schema)

    async def async_step_select_league_only(self, user_input=None):
        """Step 3: Select league when monitoring league mode."""
        if user_input is not None:
            self._data.update(user_input)
            league = self._data.get("league", "Portuguese Primeira Liga")
            return self.async_create_entry(title=league, data=self._data)

        schema = vol.Schema({
            vol.Required("league", default="Portuguese Primeira Liga"): vol.In(list(LEAGUES_MAP.keys())),
        })

        return self.async_show_form(step_id="select_league_only", data_schema=schema)
