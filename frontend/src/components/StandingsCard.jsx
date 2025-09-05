import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import { calculateStandings, getTeamColorHex } from "../utils/data";

const StandingsCard = ({ matches, selectedSeason, availableSeasons, onSeasonChange }) => {
	const [standings, setStandings] = useState([]);
	const [loading, setLoading] = useState(false);

	// Calculate standings when matches change
	useEffect(() => {
		const loadStandings = async () => {
			setLoading(true);
			try {
				const calculatedStandings = await calculateStandings(matches, selectedSeason);
				setStandings(calculatedStandings);
			} catch (error) {
				console.error('Error calculating standings:', error);
				setStandings([]);
			} finally {
				setLoading(false);
			}
		};

		loadStandings();
	}, [matches, selectedSeason]);

	return (
		<div className="w-full">
			<div className="bg-white rounded-lg p-4 border border-neutral-300">
				{/* Header */}
				<div className="flex items-center justify-between mb-2">
					<h2 className="text-xl font-bold">Standings</h2>

					<Menu as="div" className="relative inline-block">
						<MenuButton className="inline-flex w-32 justify-center items-center gap-x-1.5 rounded-md px-3 py-2 text-sm border border-gray-300  hover:bg-gray-200 focus:outline-none">
							{selectedSeason}
							<FaChevronDown aria-hidden="true" className="size-3 " />
						</MenuButton>
						<MenuItems transition className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white border border-gray-300 shadow-lg transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
							<div className="py-1">
								{availableSeasons.map((season) => (
									<MenuItem key={season}>
										<button onClick={() => onSeasonChange(season)} className="block w-full px-4 py-2 text-left text-sm data-focus:bg-gray-100  hover:bg-gray-100">
											{season}
										</button>
									</MenuItem>
								))}
							</div>
						</MenuItems>
					</Menu>
				</div>

				{/* Standings Table */}
				<div className="overflow-x-auto">
					{loading ? (
						<div className="flex justify-center py-8">
							<div className="text-gray-500">Loading standings...</div>
						</div>
					) : standings.length === 0 ? (
						<div className="flex justify-center py-8">
							<div className="text-gray-500">No standings data available</div>
						</div>
					) : (
						<table className="w-full">
							<thead className="">
								<tr className="text-black font-bold">
									<th className="w-12 text-center px-2 py-3 uppercase tracking-wider">#</th>
									<th className="w-16 px-2 py-3 f uppercase tracking-wider"></th>
									<th className="w-16 text-center px-2 py-3 uppercase tracking-wider">PL</th>
									<th className="w-16 text-center px-2 py-3 uppercase tracking-wider">W</th>
									<th className="w-16 text-center px-2 py-3 uppercase tracking-wider">L</th>
									<th className="w-20 text-center hidden md:table-cell px-2 py-3 uppercase tracking-wider">+/-</th>
									<th className="w-16 text-center px-2 py-3 uppercase tracking-wider">GD</th>
									<th className="w-16 text-center px-2 py-3 uppercase tracking-wider">PTS</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{standings.map((team, index) => (
									<tr key={team.team} className="hover:bg-gray-200 text-md">
										<td className="text-center">
											{index + 1}
										</td>
										<td className="text-center">
											<div className="flex items-center justify-center md:justify-start gap-2">
												<IoShirt size={26} color={getTeamColorHex(team.color)} />
												<span className="hidden md:inline">{team.team}</span>
											</div>
										</td>
										<td className="text-center">{team.played}</td>
										<td className="text-center">{team.wins}</td>
										<td className="text-center">{team.losses}</td>
										<td className="text-center hidden md:table-cell text-md">
											{team.goalsFor}-{team.goalsAgainst}
										</td>
										<td className="text-center">
											<span>{team.goalDifference > 0 ? "+" : ""}{team.goalDifference}</span>
										</td>
										<td className="text-center py-2">
											{team.points}
										</td>
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