"use client";

import React, {useState, useMemo} from "react";
import {Button} from "@/components/ui/button";
import {CaretLeftIcon, CaretRightIcon} from "@phosphor-icons/react/dist/ssr";
import MatchesList from "./MatchesList";
import Link from "next/link";

interface Match {
    id: string;
    date: string;
    homeTeam: string;
    homeColor: string;
    homeScore: number;
    awayTeam: string;
    awayColor: string;
    awayScore: number;
}

interface MatchesCardProps {
    matches: Match[];
}

const MatchesCard = ({matches}: MatchesCardProps) => {
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    // Group matches by date
    const matchesByDay = useMemo(() => {
        const grouped = matches.reduce((acc, match) => {
            if (!acc[match.date]) {
                acc[match.date] = [];
            }
            acc[match.date].push(match);
            return acc;
        }, {} as Record<string, Match[]>);

        return Object.entries(grouped).map(([date, dayMatches]) => ({date, matches: dayMatches}));
    }, [matches]);

    const currentDay = matchesByDay[currentDayIndex];
    const totalDays = matchesByDay.length;

    const goToPreviousDay = () => {
        setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : totalDays - 1));
    };

    const goToNextDay = () => {
        setCurrentDayIndex((prev) => (prev < totalDays - 1 ? prev + 1 : 0));
    };

    if (!currentDay) {
        return <div>No matches available</div>;
    }

    return (
        <div className="w-full px-4">
            <div className="bg-white rounded-lg shadow border p-6">
                {/* Header with navigation */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="outline" size="icon" onClick={goToPreviousDay} className="h-12 w-12">
                        <CaretLeftIcon/>
                    </Button>

                    <div className="text-center">
                        <h2 className="text-xl font-bold">
                            Matches
                        </h2>
                    </div>

                    <Button variant="outline" size="icon" onClick={goToNextDay} className="h-12 w-12">
                        <CaretRightIcon/>
                    </Button>
                </div>

                {/* Matches for the current day */}
                <div className="flex flex-wrap justify-center -mx-2">
                    {currentDay.matches.map((match) => (
                        <div key={match.id} className="w-full md:w-1/3 px-2 mb-4">
                            <MatchesList {...match} />
                        </div>
                    ))}
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center mt-4 space-x-2">
                    {matchesByDay.map((_, index) => (
                        <button key={index} onClick={() => setCurrentDayIndex(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentDayIndex ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"}`}/>
                    ))}
                </div>

                {/* All Matches Link */}
                <div className="flex justify-center mt-6">
                    <Link href="/matches">
                        <Button variant="outline" className="text-xs">
                            All Matches
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MatchesCard;