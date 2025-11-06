export const API_PATHS = {
	AUTH: {
		REGISTER: "/api/auth/register",
		LOGIN: "/api/auth/login",
		GET_PROFILE: "/api/auth/profile",
	},

	MATCH: {
		CREATE: "/api/match/create",
		UPDATE: (id) => `/api/match/${id}/update`,
		GET_ALL_SEASONS: '/api/match/seasons',
		GET_BY_SEASON: (season) => `/api/match/season?season=${season}`,
		GET_BY_MATCH_ID: (id) => `/api/match/${id}`,
	},

	PLAYER: {
		GET_ALL: "/api/player",
		GET_BY_TEAM: (team) => `/api/player/team?team=${team}`,
		GET_BY_ID: (id) => `/api/player/${id}`,
		CREATE: "/api/player/create",
		UPDATE: (id) => `/api/player/${id}/update`,
		DELETE: (id) => `/api/player/${id}/delete`,
	},
};