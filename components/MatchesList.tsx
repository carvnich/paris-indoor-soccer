import {TShirtIcon} from "@phosphor-icons/react/dist/ssr";
import React from "react";

interface MatchProps {
    id: string;
    date: string;
    homeTeam: string;
    homeColor: string;
    homeScore: number;
    awayTeam: string;
    awayColor: string;
    awayScore: number;
}

const MatchesList = ({date, homeTeam, homeColor, homeScore, awayTeam, awayColor, awayScore}: MatchProps) => {
    return (
        <article className="p-4 border rounded shadow bg-white">
            <div className="flex justify-between items-center">
                {/* Home */}
                <div className="text-center w-20">
                    <div className="flex justify-center mb-2">
                        <TShirtIcon size={24} color={homeColor} weight="fill"/>
                    </div>
                    <div className="text-lg">{homeTeam}</div>
                </div>

                {/* Score */}
                <div className="text-center w-24">
                    <div className="flex items-center justify-center space-x-2 text-xl font-bold">
                        <span>{homeScore}</span>
                        <span>-</span>
                        <span>{awayScore}</span>
                    </div>
                    <div className="text-sm text-gray-500">{date}</div>
                </div>

                {/* Away */}
                <div className="text-center w-20">
                    <div className="flex justify-center mb-2">
                        <TShirtIcon size={24} color={awayColor} weight="fill"/>
                    </div>
                    <div className="text-lg">{awayTeam}</div>
                </div>
            </div>
        </article>
    );
};

export default MatchesList;
