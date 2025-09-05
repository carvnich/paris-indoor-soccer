import React, { useMemo, useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatMatchDate } from "../utils/data";
import MatchesList from "./MatchesList";

const MatchesCard = ({ matches, selectedSeason }) => {
	const [currentDayIndex, setCurrentDayIndex] = useState(0);

	// Group matches by date
	const matchesByDay = useMemo(() => {
		if (!matches?.length) return [];

		const grouped = matches.reduce((acc, match) => {
			const dateKey = formatMatchDate(match.dateTime);
			if (!acc[dateKey]) {
				acc[dateKey] = [];
			}
			acc[dateKey].push(match);
			return acc;
		}, {});

		return Object.entries(grouped)
			.map(([date, dayMatches]) => ({ date, matches: dayMatches.sort((a, b) => a.dateTime - b.dateTime) }))
			.sort((a, b) => a.matches[0].dateTime - b.matches[0].dateTime);
	}, [matches]);

	const currentDay = matchesByDay[currentDayIndex];
	const totalDays = matchesByDay.length;

	// Reset to first day when season changes
	React.useEffect(() => {
		setCurrentDayIndex(0);
	}, [selectedSeason]);

	const goToPreviousDay = () => {
		setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : totalDays - 1));
	};

	const goToNextDay = () => {
		setCurrentDayIndex((prev) => (prev < totalDays - 1 ? prev + 1 : 0));
	};

	if (!currentDay) {
		return (
			<div className="w-full">
				<div className="bg-white rounded-lg border border-neutral-300 p-4">
					<div className="text-center py-8 text-gray-500">
						<p className="text-lg mb-2">No matches available</p>
						<p className="text-sm">No matches found for the {selectedSeason} season.</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="bg-white rounded-lg border border-neutral-300 p-4">
				{/* Header with navigation */}
				<div className="flex items-center justify-between mb-4">
					<button onClick={goToPreviousDay} className="h-12 w-12 border border-gray-300 rounded-md flex items-center justify-center bg-white hover:bg-gray-200 focus:outline-none">
						<FaCaretLeft />
					</button>

					<div className="text-center">
						<h2 className="text-xl font-bold">
							Matches
						</h2>
					</div>

					<button onClick={goToNextDay} className="h-12 w-12 border border-gray-300 rounded-md flex items-center justify-center bg-white hover:bg-gray-200 focus:outline-none">
						<FaCaretRight />
					</button>
				</div>

				{/* Matches for the current day */}
				<div className="flex flex-wrap justify-center -mx-2">
					{currentDay.matches.map((match) => (
						<div key={match._id} className="w-full md:w-1/3 px-2 mb-4">
							<MatchesList {...match} />
						</div>
					))}
				</div>

				{/* Navigation dots */}
				<div className="flex justify-center mt-4 space-x-2">
					{matchesByDay.map((_, index) => (
						<button key={index} onClick={() => setCurrentDayIndex(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentDayIndex ? "bg-black" : "bg-gray-300 hover:bg-gray-400"}`} />
					))}
				</div>

				{/* All Matches Link */}
				<div className="flex justify-center mt-6">
					<Link to="/matches">
						<button className="text-sm border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-200 focus:outline-none">
							All Matches
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MatchesCard;