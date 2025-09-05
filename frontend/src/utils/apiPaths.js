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
};