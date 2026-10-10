import logging
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    await hass.config_entries.async_forward_entry_setups(entry, ["sensor"])

    # Register frontend static path for the Lovelace card bundle
    try:
        hass.http.async_register_static_path(
            f"/{DOMAIN}/soccer-live-hub.bundle.js",
            hass.config.path(f"custom_components/{DOMAIN}/soccer-live-hub.bundle.js")
        )
    except Exception as err:
        _LOGGER.debug("Could niet register static path: %s", err)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_entries(entry, ["sensor"])
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    return unload_ok
