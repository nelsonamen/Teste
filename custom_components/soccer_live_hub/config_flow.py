from homeassistant import config_entries
import voluptuous as vol
from .const import DOMAIN

LEAGUES = [
    "Portuguese Primeira Liga",
    "English Premier League",
    "Spanish La Liga",
    "Italian Serie A",
    "German Bundesliga",
    "French Ligue 1",
    "UEFA Champions League",
    "UEFA Europa League",
]

TEAMS = [
    "FC Porto",
    "Sporting CP",
    "Benfica",
    "Braga",
    "Portugal",
    "Spain",
    "France",
    "England",
    "Real Madrid",
    "Barcelona",
]

class SoccerLiveHubConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    def __init__(self):
        self._data = {}

    async def async_step_user(self, user_input=None):
        """Step 1: Choose what to monitor (Equipa vs Liga) — ESPN free is default."""
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_select_target()

        schema = vol.Schema({
            vol.Required("monitor_type", default="Equipa"): vol.In(["Equipa", "Liga"]),
        })

        return self.async_show_form(step_id="user", data_schema=schema)

    async def async_step_select_target(self, user_input=None):
        """Step 2: Dropdown selector for Team or League matching user screenshots."""
        if user_input is not None:
            self._data.update(user_input)
            title = self._data.get("team") or self._data.get("league") or "Soccer Hub"
            return self.async_create_entry(title=title, data=self._data)

        is_team = self._data.get("monitor_type") == "Equipa"
        schema = vol.Schema({
            vol.Required("team" if is_team else "league", default="FC Porto" if is_team else "Portuguese Primeira Liga"): vol.In(TEAMS if is_team else LEAGUES),
        })

        return self.async_show_form(step_id="select_target", data_schema=schema)
