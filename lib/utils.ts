import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {seasonMatchData} from "@/constants/matchData";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Match interface with season
export interface Match {
    id: string;
    date: string;
    season: string;
    homeTeam: string;
    homeColor: string;
    homeScore: number;
    awayTeam: string;
    awayColor: string;
    awayScore: number;
    isPlayoff?: boolean;
}

export interface SeasonData {
    season: string;
    matches: Match[];
}

export interface TeamStats {
    team: string;
    color: string;
    played: number;
    wins: number;
    losses: number;
    draws: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}

// Team color options for filtering
export const teamFilters = [
    {name: "All", color: "white", value: "all"},
    {name: "Yellow", color: "yellow", value: "yellow"},
    {name: "Black", color: "black", value: "black"},
    {name: "Green", color: "green", value: "green"},
    {name: "Red", color: "red", value: "red"},
    {name: "Blue", color: "blue", value: "blue"},
    {name: "White", color: "grey", value: "grey"},
];

// Group matches by date
export function groupMatchesByDate(matches: Match[]) {
    const grouped = matches.reduce((acc, match) => {
        if (!acc[match.date]) {
            acc[match.date] = [];
        }
        acc[match.date].push(match);
        return acc;
    }, {} as Record<string, Match[]>);

    return Object.entries(grouped).map(([date, matches]) => ({
        date,
        matches,
    }));
}

// Filter matches by color (single selection)
export function filterMatchesByColor(matchesByDate: { date: string; matches: Match[] }[], selectedColor: string) {
    if (selectedColor === "all") {
        return matchesByDate;
    }

    return matchesByDate.map(({date, matches}) => ({
        date,
        matches: matches.filter(
            (match) =>
                match.homeColor === selectedColor ||
                match.awayColor === selectedColor,
        ),
    })).filter(({matches}) => matches.length > 0);
}

// Flatten all matches into a single array (for backward compatibility)
export const matchData: Match[] = seasonMatchData.flatMap(seasonData => seasonData.matches);

// Get matches for a specific season
export const getMatchesForSeason = (season: string): Match[] => {
    const seasonData = seasonMatchData.find(s => s.season === season);
    return seasonData ? seasonData.matches : [];
};

// Get available seasons
export const getAvailableSeasons = (): string[] => {
    return seasonMatchData.map(s => s.season).sort().reverse();
};

// Calculate standings from match data for a specific season
export function calculateStandings(matches: Match[], season?: string): TeamStats[] {
    // Filter by season if specified
    const seasonMatches = season ? getMatchesForSeason(season) : matches;

    // Filter out playoff matches for standings calculation
    const regularSeasonMatches = seasonMatches.filter((match) => !match.isPlayoff);

    const teamStats: Record<string, TeamStats> = {};

    // Initialize all teams that appear in the matches
    regularSeasonMatches.forEach((match) => {
        if (!teamStats[match.homeTeam]) {
            teamStats[match.homeTeam] = {
                team: match.homeTeam,
                color: match.homeColor,
                played: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
            };
        }
        if (!teamStats[match.awayTeam]) {
            teamStats[match.awayTeam] = {
                team: match.awayTeam,
                color: match.awayColor,
                played: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
            };
        }
    });

    // Calculate stats from regular season matches only
    regularSeasonMatches.forEach((match) => {
        const homeTeam = teamStats[match.homeTeam];
        const awayTeam = teamStats[match.awayTeam];

        // Update games played
        homeTeam.played++;
        awayTeam.played++;

        // Update goals
        homeTeam.goalsFor += match.homeScore;
        homeTeam.goalsAgainst += match.awayScore;
        awayTeam.goalsFor += match.awayScore;
        awayTeam.goalsAgainst += match.homeScore;

        // Determine winner and update wins/losses/draws/points
        if (match.homeScore > match.awayScore) {
            homeTeam.wins++;
            homeTeam.points += 3;
            awayTeam.losses++;
        } else if (match.awayScore > match.homeScore) {
            awayTeam.wins++;
            awayTeam.points += 3;
            homeTeam.losses++;
        } else {
            // Draw - each team gets 1 point
            homeTeam.draws++;
            awayTeam.draws++;
            homeTeam.points += 1;
            awayTeam.points += 1;
        }
    });

    // Calculate goal difference and sort by points, then goal difference
    return Object.values(teamStats)
        .map((team) => ({...team, goalDifference: team.goalsFor - team.goalsAgainst}))
        .sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return b.goalDifference - a.goalDifference;
        });
}