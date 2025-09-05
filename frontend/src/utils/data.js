import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';

// Team color mapping for consistent team colors across the app
export const teamColors = {
	Yellow: "#cccc00",
	Black: "#000000",
	Green: "#008000",
	Red: "#ff0000",
	Blue: "#0000ff",
	White: "#a5a5a5",
	Grey: "#808080",
};

// Team color filter options for the UI
export const teamFilters = [
	{ name: "All", color: "#ffffff", value: "all" },
	{ name: "Yellow", color: teamColors.Yellow, value: "Yellow" },
	{ name: "Black", color: teamColors.Black, value: "Black" },
	{ name: "Green", color: teamColors.Green, value: "Green" },
	{ name: "Red", color: teamColors.Red, value: "Red" },
	{ name: "Blue", color: teamColors.Blue, value: "Blue" },
	{ name: "White", color: teamColors.Grey, value: "Grey" },
];

// Get hex color code for team color name
export const getTeamColorHex = (colorName) => teamColors[colorName] || "#666666";

// Date formatting utilities for consistent date display
export const formatMatchDate = (dateTime) => new Date(dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const formatMatchTime = (dateTime) => new Date(dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

export const formatFullDate = (dateTime) => {
	const formatted = new Date(dateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	return formatted.replace(/(\w+),\s(\w+\s\d+),/, '$1 $2,');
};

export const formatFullDateTime = (dateTime) => {
	const date = new Date(dateTime);
	const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
	return `${dateStr.replace(',', '')} ${timeStr}`;
};

// API fetch functions
export const fetchAvailableSeasons = async () => {
	try {
		const response = await axiosInstance.get(API_PATHS.MATCH.GET_ALL_SEASONS);
		return response.data?.seasons || [];
	} catch (error) {
		console.error('Error fetching seasons:', error);
		return [];
	}
};

export const fetchSeasonMatches = async (season) => {
	if (!season) return [];

	try {
		const response = await axiosInstance.get(API_PATHS.MATCH.GET_BY_SEASON(season));
		return transformMatchData(response.data?.matches || []);
	} catch (error) {
		console.error('Error fetching matches:', error);
		return [];
	}
};

// Transform API response to consistent format for UI consumption
export const transformMatchData = (apiMatches) => {
	if (!Array.isArray(apiMatches)) return [];

	return apiMatches.map(match => {
		// Handle different date formats from API
		let dateTime;
		if (match.dateTime) {
			dateTime = new Date(match.dateTime);
		} else if (match.date && match.time) {
			dateTime = match.date.includes('-')
				? new Date(`${match.date}T${match.time}`)
				: new Date(`${match.date}, ${new Date().getFullYear()} ${match.time}`);
		}

		return {
			_id: match._id,
			matchId: match.matchId,
			dateTime: dateTime,
			season: match.season,
			isPlayoff: match.isPlayoff,
			homeTeam: match.homeTeam.team,
			homeColor: match.homeTeam.color,
			homeColorHex: getTeamColorHex(match.homeTeam.color),
			homeScore: match.homeTeam.score,
			awayTeam: match.awayTeam.team,
			awayColor: match.awayTeam.color,
			awayColorHex: getTeamColorHex(match.awayTeam.color),
			awayScore: match.awayTeam.score,
		};
	});
};

// Group matches by formatted date for display organization
export function groupMatchesByDate(matches) {
	if (!matches?.length) return [];

	const grouped = matches.reduce((acc, match) => {
		const dateKey = formatMatchDate(match.dateTime);
		if (!acc[dateKey]) acc[dateKey] = [];
		acc[dateKey].push(match);
		return acc;
	}, {});

	return Object.entries(grouped)
		.map(([date, matches]) => ({ date, matches: matches.sort((a, b) => a.dateTime - b.dateTime) }))
		.sort((a, b) => a.matches[0].dateTime - b.matches[0].dateTime);
}

// Filter matches by team color selection
export function filterMatchesByColor(matchesByDate, selectedColor) {
	if (!matchesByDate?.length || selectedColor === "all") return matchesByDate;

	return matchesByDate
		.map(({ date, matches }) => ({
			date,
			matches: matches.filter(match => match.homeColor === selectedColor || match.awayColor === selectedColor)
		}))
		.filter(({ matches }) => matches.length > 0);
}

// Calculate league standings from match results
export async function calculateStandings(matches, season) {
	// If season is provided but no matches, fetch them from the API
	let seasonMatches = matches;
	if (season && (!matches || matches.length === 0)) {
		seasonMatches = await fetchSeasonMatches(season);
	}

	if (!seasonMatches?.length) return [];

	const regularSeasonMatches = seasonMatches.filter(match => !match.isPlayoff);
	const teamStats = {};

	// Process each match to build team statistics
	regularSeasonMatches.forEach(match => {
		// Initialize team stats if not exists
		[match.homeTeam, match.awayTeam].forEach(teamName => {
			if (!teamStats[teamName]) {
				const isHome = teamName === match.homeTeam;
				teamStats[teamName] = {
					team: teamName,
					color: isHome ? match.homeColor : match.awayColor,
					colorHex: getTeamColorHex(isHome ? match.homeColor : match.awayColor),
					played: 0, wins: 0, losses: 0, draws: 0,
					goalsFor: 0, goalsAgainst: 0, points: 0
				};
			}
		});

		// Update match statistics
		const homeTeam = teamStats[match.homeTeam];
		const awayTeam = teamStats[match.awayTeam];
		const homeScore = Number(match.homeScore) || 0;
		const awayScore = Number(match.awayScore) || 0;

		// Update game counts and goals
		homeTeam.played++;
		awayTeam.played++;
		homeTeam.goalsFor += homeScore;
		homeTeam.goalsAgainst += awayScore;
		awayTeam.goalsFor += awayScore;
		awayTeam.goalsAgainst += homeScore;

		// Update wins/losses/draws and points
		if (homeScore > awayScore) {
			homeTeam.wins++;
			homeTeam.points += 3;
			awayTeam.losses++;
		} else if (awayScore > homeScore) {
			awayTeam.wins++;
			awayTeam.points += 3;
			homeTeam.losses++;
		} else {
			homeTeam.draws++;
			awayTeam.draws++;
			homeTeam.points += 1;
			awayTeam.points += 1;
		}
	});

	// Return sorted standings by points, then goal difference
	return Object.values(teamStats)
		.map(team => ({ ...team, goalDifference: team.goalsFor - team.goalsAgainst }))
		.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
}