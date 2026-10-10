from homeassistant import config_entries
import voluptuous as vol
from .const import DOMAIN

class SoccerLiveHubConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    def __init__(self):
        self._data = {}

    async def async_step_user(self, user_input=None):
        """Step 1: Choose data source (ESPN fixed as free default)."""
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_monitor()

        schema = vol.Schema({
            vol.Required("source", default="ESPN"): vol.In(["ESPN (grátis)"]),
        })

        return self.async_show_form(step_id="user", data_schema=schema)

    async def async_step_monitor(self, user_input=None):
        """Step 2: Choose what to monitor (Equipa vs Liga)."""
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_details()

        schema = vol.Schema({
            vol.Required("monitor_type", default="Equipa"): vol.In(["Equipa", "Liga"]),
        })

        return self.async_show_form(step_id="monitor", data_schema=schema)

    async def async_step_details(self, user_input=None):
        """Step 3: Enter Team or League name."""
        if user_input is not None:
            self._data.update(user_input)
            title = self._data.get("team") or self._data.get("league") or "Soccer Hub"
            return self.async_create_entry(title=title, data=self._data)

        is_team = self._data.get("monitor_type") == "Equipa"
        schema = vol.Schema({
            vol.Required("team" if is_team else "league", default="FC Porto" if is_team else "Portuguese Primeira Liga"): str,
        })

        return self.async_show_form(step_id="details", data_schema=schema)
