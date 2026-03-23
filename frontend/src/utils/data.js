import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

// Team color mapping
export const teamColors = {
    Yellow: "#cccc00",
    Black: "#000000",
    Green: "#008000",
    Red: "#ff0000",
    Blue: "#0000ff",
    White: "#a5a5a5",
    Grey: "#c4c4c4",
};

// Team color filter options for UI
export const teamFilters = [
    { name: "All", color: "#ffffff", value: "all" },
    { name: "Yellow", color: teamColors.Yellow, value: "Yellow" },
    { name: "Black", color: teamColors.Black, value: "Black" },
    { name: "Green", color: teamColors.Green, value: "Green" },
    { name: "Red", color: teamColors.Red, value: "Red" },
    { name: "Blue", color: teamColors.Blue, value: "Blue" },
    { name: "White", color: teamColors.Grey, value: "Grey" },
];

// Utility functions
export const getTeamColorHex = (colorName) => teamColors[colorName] || "#666666";

export function isMatchPlayed(match) {
    return match.homeScore !== null && match.awayScore !== null;
}

// Date formatting utilities
export const formatMatchDate = (dateTime) => new Date(dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const formatMatchTime = (dateTime) => new Date(dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

export const formatFullDate = (dateTime) => {
    const formatted = new Date(dateTime).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return formatted.replace(/(\w+),\s(\w+\s\d+),/, "$1 $2,");
};

export const formatFullDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const dateStr = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return `${dateStr.replace(",", "")} ${timeStr}`;
};

// API functions
export const fetchAvailableSeasons = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.MATCH.GET_ALL_SEASONS);
        return response.data?.seasons || [];
    } catch (error) {
        console.error("Error fetching seasons:", error);
        return [];
    }
};

export const fetchSeasonMatches = async (season) => {
    if (!season) return [];

    try {
        const response = await axiosInstance.get(API_PATHS.MATCH.GET_BY_SEASON(season));
        return transformMatchData(response.data?.matches || [], season);
    } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
    }
};

// Helper: resolve seeded placeholders and get team info
const getTeamByPosition = (position, standings) => {
    const index = { "1st": 0, "2nd": 1, "3rd": 2, "4th": 3, "5th": 4, "6th": 5 }[position];
    return standings[index] || { team: "TBD" };
};

const SEED_POSITIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

// Helper: extract winner from a match and resolve seeded placeholders
const getWinner = (match, standings) => {
    if (!match || match.homeScore === null || match.awayScore === null) return null;
    const homeScore = Number(match.homeScore) || 0;
    const awayScore = Number(match.awayScore) || 0;

    let winnerTeam, winnerColor, winnerColorHex;
    if (homeScore > awayScore) {
        winnerTeam = match.homeTeam;
        winnerColor = match.homeColor;
        winnerColorHex = match.homeColorHex;
    } else if (awayScore > homeScore) {
        winnerTeam = match.awayTeam;
        winnerColor = match.awayColor;
        winnerColorHex = match.awayColorHex;
    } else {
        return null;
    }

    // Resolve seeded placeholders to actual team names
    if (SEED_POSITIONS.includes(winnerTeam)) {
        const team = getTeamByPosition(winnerTeam, standings);
        return { team: team.team, color: team.color, colorHex: team.colorHex };
    }

    return { team: winnerTeam, color: winnerColor, colorHex: winnerColorHex };
};

// Helper: resolve seed placeholders in a single team field
const resolveSeedPlaceholder = (teamValue, standings) => {
    if (!SEED_POSITIONS.includes(teamValue)) return null;
    return getTeamByPosition(teamValue, standings);
};

// Simple playoff team updates
function updatePlayoffTeams(matches, standings) {
    if (!matches?.length || !standings?.length || standings.length < 6) return matches;

    // First pass: update seeded placeholders and winner-based matches
    const firstPassMatches = matches.map((match) => {
        if (!match.isPlayoff) return match;

        let updated = { ...match };

        // Resolve seed placeholders in home/away teams
        const homeTeamResolved = resolveSeedPlaceholder(updated.homeTeam, standings);
        if (homeTeamResolved) {
            updated.homeTeam = homeTeamResolved.team;
            updated.homeColor = homeTeamResolved.color;
            updated.homeColorHex = homeTeamResolved.colorHex;
        }

        const awayTeamResolved = resolveSeedPlaceholder(updated.awayTeam, standings);
        if (awayTeamResolved) {
            updated.awayTeam = awayTeamResolved.team;
            updated.awayColor = awayTeamResolved.color;
            updated.awayColorHex = awayTeamResolved.colorHex;
        }

        // Handle special placeholders
        if (updated.awayTeam === "Lowest Seed") {
            const qf = matches.find((m) => m.isPlayoff && new Date(m.dateTime) < new Date(updated.dateTime) && m.homeTeam === standings[2]?.team && m.awayTeam === standings[5]?.team);
            const winner = getWinner(qf, standings);
            updated.awayTeam = winner?.team ?? "TBD";
            updated.awayColor = winner?.color;
            updated.awayColorHex = winner?.colorHex;
        }

        if (updated.awayTeam === "Highest seed") {
            const qf = matches.find((m) => m.isPlayoff && new Date(m.dateTime) < new Date(updated.dateTime) && m.homeTeam === standings[3]?.team && m.awayTeam === standings[4]?.team);
            const winner = getWinner(qf, standings);
            updated.awayTeam = winner?.team ?? "TBD";
            updated.awayColor = winner?.color;
            updated.awayColorHex = winner?.colorHex;
        }

        // Semi-final 1: 1st seed vs winner of 4th vs 5th
        if (updated.homeTeam === standings[0]?.team && updated.awayTeam === "TBD") {
            const qf = matches.find((m) => m.isPlayoff && new Date(m.dateTime) < new Date(updated.dateTime) &&
                (m.homeTeam === standings[3]?.team || m.homeTeam === "4th") &&
                (m.awayTeam === standings[4]?.team || m.awayTeam === "5th"));
            const winner = getWinner(qf, standings);
            updated.awayTeam = winner?.team ?? "TBD";
            updated.awayColor = winner?.color;
            updated.awayColorHex = winner?.colorHex;
        }

        // Semi-final 2: 2nd seed vs winner of 3rd vs 6th
        if (updated.homeTeam === standings[1]?.team && updated.awayTeam === "TBD") {
            const qf = matches.find((m) => m.isPlayoff && new Date(m.dateTime) < new Date(updated.dateTime) &&
                (m.homeTeam === standings[2]?.team || m.homeTeam === "3rd") &&
                (m.awayTeam === standings[5]?.team || m.awayTeam === "6th"));
            const winner = getWinner(qf, standings);
            updated.awayTeam = winner?.team ?? "TBD";
            updated.awayColor = winner?.color;
            updated.awayColorHex = winner?.colorHex;
        }

        return updated;
    });

    // Second pass: populate finals from semi-finals
    return firstPassMatches.map((match) => {
        if (!match.isPlayoff || (match.homeTeam !== "Finals" && match.awayTeam !== "Finals")) {
            return match;
        }

        let updated = { ...match };

        if (match.homeTeam === "Finals") {
            const sf = firstPassMatches.find((m) => m.isPlayoff && m.matchId !== match.matchId && new Date(m.dateTime) < new Date(match.dateTime) && m.homeTeam === standings[0]?.team);
            const winner = getWinner(sf, standings);
            updated.homeTeam = winner?.team ?? "TBD";
            updated.homeColor = winner?.color;
            updated.homeColorHex = winner?.colorHex;
        }

        if (match.awayTeam === "Finals") {
            const sf = firstPassMatches.find((m) => m.isPlayoff && m.matchId !== match.matchId && new Date(m.dateTime) < new Date(match.dateTime) && m.homeTeam === standings[1]?.team);
            const winner = getWinner(sf, standings);
            updated.awayTeam = winner?.team ?? "TBD";
            updated.awayColor = winner?.color;
            updated.awayColorHex = winner?.colorHex;
        }

        return updated;
    });
}

// Transform match data
export const transformMatchData = async (apiMatches, season) => {
    if (!Array.isArray(apiMatches)) return [];

    const transformedMatches = apiMatches.map((match) => {
        let dateTime;
        if (match.dateTime) {
            dateTime = new Date(match.dateTime);
        } else if (match.date && match.time) {
            dateTime = match.date.includes("-") ? new Date(`${match.date}T${match.time}`) : new Date(`${match.date}, ${new Date().getFullYear()} ${match.time}`);
        }

        return {
            _id: match._id,
            matchId: match.matchId,
            dateTime: dateTime,
            season: match.season,
            isPlayoff: match.isPlayoff,
            homeTeam: match.homeTeam?.team || match.homeTeam,
            homeColor: match.homeTeam?.color || match.homeColor,
            homeColorHex: getTeamColorHex(match.homeTeam?.color || match.homeColor),
            homeScore: match.homeTeam?.score !== undefined ? match.homeTeam.score : match.homeScore,
            awayTeam: match.awayTeam?.team || match.awayTeam,
            awayColor: match.awayTeam?.color || match.awayColor,
            awayColorHex: getTeamColorHex(match.awayTeam?.color || match.awayColor),
            awayScore: match.awayTeam?.score !== undefined ? match.awayTeam.score : match.awayScore,
        };
    });

    if (season) {
        const standings = await calculateStandings(transformedMatches, season);
        return updatePlayoffTeams(transformedMatches, standings);
    }

    return transformedMatches;
};

// Group matches by date
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

// Filter matches by color
export function filterMatchesByColor(matchesByDate, selectedColor) {
    if (!matchesByDate?.length || selectedColor === "all") return matchesByDate;

    return matchesByDate.map(({ date, matches }) => ({ date, matches: matches.filter((match) => match.homeColor === selectedColor || match.awayColor === selectedColor) })).filter(({ matches }) => matches.length > 0);
}

// Calculate standings
export async function calculateStandings(matches, season) {
    let seasonMatches = matches;
    if (season && (!matches || matches.length === 0)) {
        seasonMatches = await fetchSeasonMatches(season);
    }

    if (!seasonMatches?.length) return [];

    const regularSeasonMatches = seasonMatches.filter((match) => !match.isPlayoff);
    const teamStats = {};

    regularSeasonMatches.forEach((match) => {
        [match.homeTeam, match.awayTeam].forEach((teamName) => {
            if (!teamStats[teamName]) {
                const isHome = teamName === match.homeTeam;
                teamStats[teamName] = {
                    team: teamName,
                    color: isHome ? match.homeColor : match.awayColor,
                    colorHex: getTeamColorHex(isHome ? match.homeColor : match.awayColor),
                    played: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    points: 0,
                };
            }
        });

        if (match.homeScore !== null && match.awayScore !== null) {
            const homeTeam = teamStats[match.homeTeam];
            const awayTeam = teamStats[match.awayTeam];
            const homeScoreNum = Number(match.homeScore) || 0;
            const awayScoreNum = Number(match.awayScore) || 0;

            homeTeam.played++;
            awayTeam.played++;
            homeTeam.goalsFor += homeScoreNum;
            homeTeam.goalsAgainst += awayScoreNum;
            awayTeam.goalsFor += awayScoreNum;
            awayTeam.goalsAgainst += homeScoreNum;

            if (homeScoreNum > awayScoreNum) {
                homeTeam.wins++;
                homeTeam.points += 3;
                awayTeam.losses++;
            } else if (awayScoreNum > homeScoreNum) {
                awayTeam.wins++;
                awayTeam.points += 3;
                homeTeam.losses++;
            } else {
                homeTeam.draws++;
                awayTeam.draws++;
                homeTeam.points += 1;
                awayTeam.points += 1;
            }
        }
    });

    return Object.values(teamStats)
        .map((team) => ({ ...team, goalDifference: team.goalsFor - team.goalsAgainst }))
        .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
}
