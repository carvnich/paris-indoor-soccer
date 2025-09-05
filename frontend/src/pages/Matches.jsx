import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import React, { useMemo, useRef, useState } from "react";
import { FaCaretLeft, FaChevronDown, FaRegCalendarAlt } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import DateHeader from "../components/DateHeader";
import RootLayout from "../components/layouts/RootLayout";
import MatchRow from "../components/MatchRow";
import { useMatch } from "../hooks/useMatch";
import { filterMatchesByColor, groupMatchesByDate, teamFilters } from "../utils/data";

export const Matches = () => {
	const { selectedSeason, seasonMatches, loading, error, availableSeasons, handleSeasonChange } = useMatch();
	const [selectedColor, setSelectedColor] = useState("all");
	const navigate = useNavigate();
	const dateRefs = useRef({});

	// Group and filter matches
	const matchesByDate = useMemo(() => groupMatchesByDate(seasonMatches), [seasonMatches]);
	const filteredMatchesByDate = useMemo(() => filterMatchesByColor(matchesByDate, selectedColor), [matchesByDate, selectedColor]);

	// Event handlers
	const handleColorFilter = (colorValue) => setSelectedColor(colorValue);
	const onSeasonChange = (season) => {
		handleSeasonChange(season);
		setSelectedColor("all");
	};

	// Navigate to closest match to current date
	const navigateToCurrentDate = () => {
		if (!matchesByDate?.length) return;

		const currentDate = new Date();
		let closestDate = matchesByDate[0]?.date;
		let minDiff = Infinity;

		matchesByDate.forEach(({ date, matches }) => {
			if (matches?.length) {
				const diff = Math.abs(currentDate - matches[0].dateTime);
				if (diff < minDiff) {
					minDiff = diff;
					closestDate = date;
				}
			}
		});

		dateRefs.current[closestDate]?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	// Navigate to edit match page with match data
	const handleEditMatch = (match) => {
		navigate(`/matches/${match._id}/edit`, { state: { matchData: match } });
	};

	return (
		<RootLayout>
			<div className="bg-gray-300 p-4">
				<div className="w-full">
					<div className="bg-white rounded-lg p-4 border border-neutral-300">
						{/* Header with navigation and season selector */}
						<div className="flex flex-col gap-4 mb-6">
							<div className="flex items-center justify-between">
								<Link to="/">
									<button className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-200">
										<FaCaretLeft className="h-4 w-4" />
										<span>Home</span>
									</button>
								</Link>

								<button onClick={navigateToCurrentDate} className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-200">
									<FaRegCalendarAlt className="h-4 w-4" />
									<span>Today</span>
								</button>
							</div>

							{/* Season selector dropdown */}
							<div className="flex items-center justify-end space-x-2">
								<span className="text-sm font-medium">Season:</span>
								<Menu as="div" className="relative inline-block">
									<MenuButton disabled={loading} className="inline-flex w-32 justify-center items-center gap-1 rounded-md px-3 py-2 text-sm border border-gray-300 hover:bg-gray-200">
										{selectedSeason}
										<FaChevronDown className="size-3" />
									</MenuButton>
									<MenuItems className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white border border-gray-300 shadow-lg">
										<div className="py-1">
											{availableSeasons.map((season) => (
												<MenuItem key={season}>
													<button onClick={() => onSeasonChange(season)} className="block w-full px-4 py-2 text-sm hover:bg-gray-200">
														{season}
													</button>
												</MenuItem>
											))}
										</div>
									</MenuItems>
								</Menu>
							</div>
						</div>

						{/* Team color filters */}
						<div className="mb-6">
							<div className="grid grid-cols-7 text-sm">
								{teamFilters.map((colorOption) => (
									<button key={colorOption.value} disabled={loading} className="flex items-center justify-center py-2 first:rounded-l-md last:rounded-r-md border border-gray-300 hover:bg-gray-200 focus:bg-gray-300" onClick={() => handleColorFilter(colorOption.value)}>
										{colorOption.value !== "all" ? (
											<>
												<IoShirt size={16} color={colorOption.color} />
												<span className="ml-1 hidden md:inline">{colorOption.name}</span>
											</>
										) : (
											<span>All</span>
										)}
									</button>
								))}
							</div>
						</div>

						{/* Matches table or empty state */}
						{!loading && !error && (
							<>
								{filteredMatchesByDate.length > 0 ? (
									<div className="w-full">
										<table className="w-full border border-gray-200 rounded-lg">
											<tbody>
												{filteredMatchesByDate.map(({ date, matches }) => (
													<React.Fragment key={date}>
														<DateHeader date={date} dateRefs={dateRefs} isPlayoffWeek={matches.some(m => m.isPlayoff)} matches={matches} />
														{matches.map((match) => (
															<MatchRow key={match._id} match={match} onEdit={handleEditMatch} />
														))}
													</React.Fragment>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<div className="text-center py-8 text-gray-500">
										<p className="text-lg mb-2">No matches found</p>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</RootLayout>
	);
};