import { useEffect, useState } from "react";
import { IoShirt } from "react-icons/io5";
import SeasonDropdown from "./SeasonDropdown";
import { calculateStandings, getTeamColorHex } from "../utils/data";
import Spinner from "./Spinner";

const StandingsCard = ({ matches, selectedSeason, availableSeasons, onSeasonChange, loading }) => {
	const [standings, setStandings] = useState([]);
	const [calculating, setCalculating] = useState(false);

	useEffect(() => {
		const loadStandings = async () => {
			if (!matches?.length) return;

			setCalculating(true);
			try {
				const calculatedStandings = await calculateStandings(matches, selectedSeason);
				setStandings(calculatedStandings);
			} catch (error) {
				console.error('Error calculating standings:', error);
				setStandings([]);
			} finally {
				setCalculating(false);
			}
		};

		loadStandings();
	}, [matches, selectedSeason]);

	const isLoading = loading || calculating;

	return (
		<div className="w-full">
			<div className="bg-white rounded-lg p-4 border border-neutral-300">
				{/* Header */}
				<div className={`mb-2 ${isLoading ? '' : 'flex items-center justify-between'}`}>
					<h2 className="text-2xl font-bold">Standings</h2>
					{!isLoading && (
						<SeasonDropdown selectedSeason={selectedSeason} availableSeasons={availableSeasons} onSeasonChange={onSeasonChange} label="Season:" />
					)}
				</div>

				{/* Content */}
				<div className="overflow-x-auto">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center py-16">
							<Spinner className="mb-4" />
							<p className="text-gray-500 text-lg">Loading standings...</p>
						</div>
					) : standings.length === 0 ? (
						<div className="flex justify-center py-8">
							<div className="text-gray-500">No standings data available</div>
						</div>
					) : (
						<table className="w-full">
							<thead>
								<tr className="text-black font-bold">
									<th className="w-12 text-center px-2 py-3 uppercase">#</th>
									<th className="w-16 px-2 py-3 uppercase tracking-wider"></th>
									<th className="w-16 text-center px-2 py-3 uppercase">PL</th>
									<th className="w-16 text-center px-2 py-3 uppercase">W</th>
									<th className="w-16 text-center px-2 py-3 uppercase">L</th>
									<th className="w-20 text-center hidden md:table-cell px-2 py-3 uppercase">+/-</th>
									<th className="w-16 text-center px-2 py-3 uppercase">GD</th>
									<th className="w-16 text-center px-2 py-3 uppercase">PTS</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{standings.map((team, index) => (
									<tr key={team.team} className="hover:bg-gray-200 text-lg">
										<td className="text-center">{index + 1}</td>
										<td className="text-center">
											<div className="flex items-center justify-center md:justify-start gap-2">
												<IoShirt size={26} color={getTeamColorHex(team.color)} />
												<span className="hidden md:inline">{team.team}</span>
											</div>
										</td>
										<td className="text-center">{team.played}</td>
										<td className="text-center">{team.wins}</td>
										<td className="text-center">{team.losses}</td>
										<td className="text-center hidden md:table-cell">
											{team.goalsFor}-{team.goalsAgainst}
										</td>
										<td className="text-center">
											{team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
										</td>
										<td className="text-center py-2">{team.points}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default StandingsCard;