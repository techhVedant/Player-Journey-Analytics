const BASE_URL = "http://127.0.0.1:8000";

export const getMaps = () => fetch(`${BASE_URL}/maps`).then(r => r.json());

export const getMatches = (map) =>
  fetch(`${BASE_URL}/matches?map_id=${map}`).then(r => r.json());

export const getMatchData = (matchId) =>
  fetch(`${BASE_URL}/match/${matchId}`).then(r => r.json());