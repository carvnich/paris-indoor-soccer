import { useNavigate } from "react-router-dom";
import RootLayout from "../components/layouts/RootLayout";
import MatchesCard from "../components/MatchesCard";
import StandingsCard from "../components/StandingsCard";
import { useMatch } from "../hooks/useMatch";
import { formatMatchDate } from "../utils/data";

export const Home = () => {
	const { seasonMatches, selectedSeason, availableSeasons, handleSeasonChange, loading } = useMatch();
	const navigate = useNavigate();

	// Navigate to matches page and scroll to the date of the clicked match
	const handleMatchClick = (match) => {
		const matchDate = formatMatchDate(match.dateTime);
		navigate('/matches', { state: { scrollToDate: matchDate } });
	};

	return (
		<RootLayout>
			<div className="flex flex-col md:flex-col w-full gap-8 p-4">
				<section className="order-1 md:order-2 w-full">
					<StandingsCard matches={seasonMatches} selectedSeason={selectedSeason} availableSeasons={availableSeasons} onSeasonChange={handleSeasonChange} loading={loading} />
				</section>

				<section className="order-2 md:order-1 w-full">
					<MatchesCard matches={seasonMatches} selectedSeason={selectedSeason} loading={loading} onMatchClick={handleMatchClick} />
				</section>
			</div>
		</RootLayout>
	);
};