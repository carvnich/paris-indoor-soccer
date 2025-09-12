import RootLayout from "../components/layouts/RootLayout";
import MatchesCard from "../components/MatchesCard";
import StandingsCard from "../components/StandingsCard";
import { useMatch } from "../hooks/useMatch";

export const Home = () => {
	const { seasonMatches, selectedSeason, availableSeasons, handleSeasonChange, loading } = useMatch();

	return (
		<RootLayout>
			<div className="flex flex-col md:flex-col w-full gap-8 p-4">
				<section className="order-1 md:order-2 w-full">
					<StandingsCard matches={seasonMatches} selectedSeason={selectedSeason} availableSeasons={availableSeasons} onSeasonChange={handleSeasonChange} loading={loading} />
				</section>

				<section className="order-2 md:order-1 w-full">
					<MatchesCard matches={seasonMatches} selectedSeason={selectedSeason} loading={loading} />
				</section>
			</div>
		</RootLayout>
	);
};