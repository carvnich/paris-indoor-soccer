"use client";

import React, {useState, useMemo, useRef} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {TShirtIcon} from "@phosphor-icons/react/dist/ssr";
import {ChevronLeft, Calendar} from "lucide-react";
import {teamColors, groupMatchesByDate, filterMatchesByColor, getAvailableSeasons, getMatchesForSeason} from "@/lib/utils";
import MatchRow from "@/components/MatchRow";
import DateHeader from "@/components/DateHeader";

const MatchesPage = () => {
    // Season state management
    const availableSeasons = getAvailableSeasons();
    const [selectedSeason, setSelectedSeason] = useState(availableSeasons[0] || "2024/2025");
    const [selectedColor, setSelectedColor] = useState<string>("all");

    const dateRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

    // Get matches for the selected season
    const seasonMatches = useMemo(() => getMatchesForSeason(selectedSeason), [selectedSeason]);

    // Group matches by date using utility function
    const matchesByDate = useMemo(() => groupMatchesByDate(seasonMatches), [seasonMatches]);

    // Filter matches based on selected color using utility function
    const filteredMatchesByDate = useMemo(() =>
            filterMatchesByColor(matchesByDate, selectedColor),
        [matchesByDate, selectedColor],
    );

    // Handle color filter selection (single selection)
    const handleColorFilter = (colorValue: string) => {
        setSelectedColor(colorValue);
    };

    // Handle season change
    const handleSeasonChange = (season: string) => {
        setSelectedSeason(season);
        setSelectedColor("all"); // Reset color filter when changing seasons
    };

    // Navigate to the closest date based on current date
    const navigateToCurrentDate = () => {
        const currentDate = new Date();

        // Find the closest date
        let closestDate = matchesByDate[0]?.date;
        let minDiff = Infinity;

        matchesByDate.forEach(({date}) => {
            const [month, day] = date.split(" ");
            const matchDate = new Date(currentDate.getFullYear(),
                new Date(Date.parse(month + " 1, 2000")).getMonth(),
                parseInt(day),
            );

            const diff = Math.abs(currentDate.getTime() - matchDate.getTime());
            if (diff < minDiff) {
                minDiff = diff;
                closestDate = date;
            }
        });

        // Scroll to the closest date
        if (closestDate && dateRefs.current[closestDate]) {
            dateRefs.current[closestDate]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <div className="bg-gray-300 mb-10">
            <div className="w-full px-4">
                <div className="bg-white rounded-lg shadow border p-6">
                    {/* Header with back button and season selector */}
                    <div className="flex flex-col gap-4 mb-6">
                        {/* Home button and Today button */}
                        <div className="flex items-center justify-between">
                            <Link href="/">
                                <Button variant="outline" className="flex items-center space-x-2">
                                    <ChevronLeft className="h-4 w-4"/>
                                    <span>Home</span>
                                </Button>
                            </Link>

                            <Button onClick={navigateToCurrentDate} variant="outline" className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4"/>
                                <span className="hidden sm:inline">Today</span>
                                <span className="sm:hidden">Go to Today</span>
                            </Button>
                        </div>

                        {/* Season selector */}
                        <div className="flex items-center justify-end space-x-2">
                            <span className="text-sm font-medium text-gray-700 shrink-0">Season:</span>
                            <Select value={selectedSeason} onValueChange={handleSeasonChange}>
                                <SelectTrigger className="w-full sm:w-32 min-w-0">
                                    <SelectValue placeholder="Season"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSeasons.map((season) => (
                                        <SelectItem key={season} value={season}>
                                            {season}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Color filters */}
                    <div className="mb-6">
                        <div className="grid grid-cols-7">
                            {teamColors.map((colorOption) => (
                                <Badge key={colorOption.value} variant={selectedColor === colorOption.value ? "default" : "outline"} className={`cursor-pointer w-full flex items-center justify-center p-2 md:px-3 md:py-2 rounded-none first:rounded-l-md last:rounded-r-md ${selectedColor === colorOption.value ? "bg-gray-300 " : "hover:bg-gray-100"}`} onClick={() => handleColorFilter(colorOption.value)}>
                                    {colorOption.value !== "all" ? (
                                        <>
                                            <TShirtIcon size={16} color={colorOption.color} weight="fill"/>
                                            <span className="ml-2 text-xs hidden md:inline">{colorOption.name}</span>
                                        </>
                                    ) : (
                                        <span className="text-xs">All</span>
                                    )}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Matches table */}
                    <div className="w-full">
                        <table className="w-full border border-gray-200 rounded-lg">
                            <tbody>
                            {filteredMatchesByDate.map(({date, matches}) => (
                                <React.Fragment key={date}>
                                    <DateHeader date={date} dateRefs={dateRefs} season={selectedSeason} isPlayoffWeek={matches.some(m => m.isPlayoff)}/>
                                    {matches.map((match) => (
                                        <MatchRow key={match.id} match={match}/>
                                    ))}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredMatchesByDate.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No matches found for the selected season and filter combination.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchesPage;