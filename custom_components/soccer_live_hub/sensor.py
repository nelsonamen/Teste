from homeassistant.components.sensor import SensorEntity
from .const import DOMAIN

async def async_setup_entry(hass, entry, async_add_entities):
    team = entry.data.get("team", "FC Porto")
    async_add_entities([
        SoccerHubMatchSensor(team),
        SoccerHubStandingsSensor(team),
        SoccerHubLastMatchSensor(team),
    ], True)

class SoccerHubMatchSensor(SensorEntity):
    def __init__(self, team):
        self._team = team
        self._attr_name = f"{team} Next Match"
        self._attr_unique_id = f"soccer_live_hub_{team.lower()}_next"

    @property
    def native_value(self):
        return "Upcoming"

    @property
    def extra_state_attributes(self):
        return {
            "sensor_type": "team_match",
            "team_name": self._team,
            "home_team": self._team,
            "away_team": "Opponent",
            "home_score": 0,
            "away_score": 0,
            "status": "STATUS_SCHEDULED",
            "date": "2026-10-15 20:00:00",
            "league_name": "Portuguese Primeira Liga",
        }

class SoccerHubStandingsSensor(SensorEntity):
    def __init__(self, team):
        self._team = team
        self._attr_name = f"{team} Standings"
        self._attr_unique_id = f"soccer_live_hub_{team.lower()}_standings"

    @property
    def native_value(self):
        return "1"

    @property
    def extra_state_attributes(self):
        return {
            "sensor_type": "standings",
            "league_name": "Portuguese Primeira Liga",
            "season": "2026-27",
            "standings": [
                {"rank": 1, "team_name": "FC Porto", "points": 21, "wins": 7, "draws": 0, "losses": 0, "goal_difference": 15},
                {"rank": 2, "team_name": "Sporting CP", "points": 18, "wins": 5, "draws": 3, "losses": 0, "goal_difference": 11},
                {"rank": 3, "team_name": "Benfica", "points": 16, "wins": 5, "draws": 1, "losses": 1, "goal_difference": 15},
            ]
        }

class SoccerHubLastMatchSensor(SensorEntity):
    def __init__(self, team):
        self._team = team
        self._attr_name = f"{team} Last Match"
        self._attr_unique_id = f"soccer_live_hub_{team.lower()}_last"

    @property
    def native_value(self):
        return "Finished"

    @property
    def extra_state_attributes(self):
        return {
            "sensor_type": "last_match",
            "home_team": self._team,
            "away_team": "Benfica",
            "home_score": 2,
            "away_score": 1,
            "status": "STATUS_FINAL",
            "date": "2026-10-08 21:00:00",
        }
