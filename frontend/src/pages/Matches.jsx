import React, { useMemo, useRef, useState, useEffect } from "react";
import { FaCaretLeft, FaRegCalendarAlt } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DateHeader from "../components/DateHeader";
import RootLayout from "../components/layouts/RootLayout";
import MatchRow from "../components/MatchRow";
import SeasonDropdown from "../components/SeasonDropdown";
import Spinner from "../components/Spinner";
import { useMatch } from "../hooks/useMatch";
import { filterMatchesByColor, groupMatchesByDate, teamFilters } from "../utils/data";

export const Matches = () => {
	const { selectedSeason, seasonMatches, loading, error, availableSeasons, handleSeasonChange } = useMatch();
	const [selectedColor, setSelectedColor] = useState("all");
	const navigate = useNavigate();
	const location = useLocation();
	const dateRefs = useRef({});

	// Group and filter matches
	const matchesByDate = useMemo(() => groupMatchesByDate(seasonMatches), [seasonMatches]);
	const filteredMatchesByDate = useMemo(() => filterMatchesByColor(matchesByDate, selectedColor), [matchesByDate, selectedColor]);

	// Handle scrolling to specific date when navigated from home page
	useEffect(() => {
		if (location.state?.scrollToDate && !loading && dateRefs.current[location.state.scrollToDate]) {
			const timer = setTimeout(() => {
				dateRefs.current[location.state.scrollToDate]?.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [location.state, loading]);

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
						{loading ? (
							<div className="flex flex-col items-center justify-center py-16">
								<Spinner className="mb-4" />
								<p className="text-gray-500 text-lg">Loading matches...</p>
							</div>
						) : (
							<>
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
									<div className="flex justify-end">
										<SeasonDropdown selectedSeason={selectedSeason} availableSeasons={availableSeasons} onSeasonChange={onSeasonChange} disabled={loading} label="Season:" />
									</div>
								</div>

								{/* Team color filters */}
								<div className="mb-6">
									<div className="grid grid-cols-7 text-sm">
										{teamFilters.map((colorOption) => (
											<button key={colorOption.value} disabled={loading} className={`flex items-center justify-center py-2 first:rounded-l-md last:rounded-r-md border border-gray-300 hover:bg-gray-200 ${selectedColor === colorOption.value ? 'bg-gray-300' : 'bg-white'}`} onClick={() => handleColorFilter(colorOption.value)}>
												{colorOption.value !== "all" ? (
													<>
														<IoShirt size={24} color={colorOption.color} />
													</>
												) : (
													<span>All</span>
												)}
											</button>
										))}
									</div>
								</div>

								{/* Matches table or empty state */}
								{!error && (
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
							</>
						)}
					</div>
				</div>
			</div>
		</RootLayout>
	);
};