"use client";

import React, {useState} from "react";
import MatchesCard from "@/components/MatchesCard";
import StandingsCard from "@/components/StandingsCard";
import {getAvailableSeasons, getMatchesForSeason} from "@/lib/utils";

const Page = () => {
    const availableSeasons = getAvailableSeasons(); // Remove matchData parameter
    const [selectedSeason, setSelectedSeason] = useState(availableSeasons[0] || "2024/2025");

    const seasonMatches = getMatchesForSeason(selectedSeason); // Remove matchData parameter

    return (
        <div className="flex flex-col md:flex-col w-full gap-8">
            <section className="order-1 md:order-2 w-full">
                <StandingsCard matches={seasonMatches} selectedSeason={selectedSeason} availableSeasons={availableSeasons} onSeasonChange={setSelectedSeason}/>
            </section>

            <section className="order-2 md:order-1 w-full">
                <MatchesCard matches={seasonMatches} selectedSeason={selectedSeason}/>
            </section>
        </div>
    );
};

export default Page;