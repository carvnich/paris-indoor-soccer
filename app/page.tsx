import React from "react";
import MatchesCard from "@/components/MatchesCard";
import StandingsCard from "@/components/StandingsCard";
import {matchData} from "@/constants/matchData";

const Page = () => {
    return (
        <div className="flex flex-col md:flex-col w-full">
            {/* StandingsCard comes first on mobile (order-1), second on md+ (md:order-2) */}
            <section className="order-1 md:order-2 w-full">
                <StandingsCard matches={matchData}/>
            </section>

            {/* MatchesCard comes second on mobile (order-2), first on md+ (md:order-1) */}
            <section className="order-2 md:order-1 w-full mt-4">
                <MatchesCard matches={matchData}/>
            </section>
        </div>
    );
};

export default Page;
