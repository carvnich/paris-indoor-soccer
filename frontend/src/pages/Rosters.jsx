import React, { useState } from "react";
import { FaCaretLeft } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import { Link } from "react-router-dom";
import RootLayout from "../components/layouts/RootLayout";
import { rosterData } from "../data/rosterData";
import { teamFilters } from "../utils/data";

export const Rosters = () => {
	const [selectedTeam, setSelectedTeam] = useState("Yellow");

	// Filter out "All" option for team tabs
	const teams = teamFilters.filter(team => team.value !== "all");
	const currentRoster = rosterData[selectedTeam] || [];

	return (
		<RootLayout>
			<div className="bg-gray-300 p-4">
				<div className="w-full">
					<div className="bg-white rounded-lg p-6 border border-neutral-300">
						{/* Header with back button */}
						<div className="flex items-center justify-between mb-6">
							<Link to="/">
								<button className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-200">
									<FaCaretLeft className="h-4 w-4" />
									<span>Home</span>
								</button>
							</Link>
							<h1 className="text-2xl font-bold text-gray-900">Team Rosters</h1>
						</div>

						{/* Team tabs */}
						<div className="mb-6">
							<div className="grid grid-cols-6 text-sm">
								{teams.map((team) => (
									<button key={team.value} className={`flex items-center justify-center py-2 first:rounded-l-md last:rounded-r-md border border-gray-300 hover:bg-gray-200 ${selectedTeam === team.value ? 'bg-gray-300' : 'bg-white'}`} onClick={() => setSelectedTeam(team.value)}>
										<IoShirt size={24} color={team.color} />
									</button>
								))}
							</div>
						</div>

						{/* Roster table */}
						<div className="w-full">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{currentRoster.map((player) => (
									<div key={player.id} className="flex items-center gap-4 p-2 border border-gray-200 rounded-lg">
										{/* Placeholder image */}
										<div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
											<span className="text-gray-500 text-xs">Photo</span>
										</div>
										{/* Player name */}
										<div className="flex-1">
											<p className="text-lg font-medium">{player.name}</p>
										</div>
									</div>
								))}
							</div>

							{/* Empty state */}
							{currentRoster.length === 0 && (
								<div className="text-center py-8 text-gray-500">
									<p className="text-lg">No players found for this team</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</RootLayout>
	);
};