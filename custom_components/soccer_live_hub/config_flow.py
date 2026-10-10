from homeassistant import config_entries
import voluptuous as vol
from .const import DOMAIN

class SoccerLiveHubConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Allow configuring any team or league name freely, just like the official integration."""
        if user_input is not None:
            title = user_input.get("team") or user_input.get("league") or "Soccer Hub"
            return self.async_create_entry(title=title, data=user_input)

        schema = vol.Schema({
            vol.Required("monitor_type", default="Equipa"): vol.In([
                "Equipa",
                "Liga",
                "Todos os jogos de hoje",
                "Notícias",
                "Entrada manual"
            ]),
            vol.Required("team", default="FC Porto"): str,
        })

        return self.async_show_form(step_id="user", data_schema=schema)
