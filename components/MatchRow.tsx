import React from "react";
import {TShirtIcon} from "@phosphor-icons/react/dist/ssr";
import {type Match as MatchType} from "@/lib/utils";

interface MatchRowProps {
    match: MatchType;
}

const MatchRow = ({match}: MatchRowProps) => {
    return (
        <tr className="border-b border-gray-100">
            <td className="py-3 px-4">
                <div className="flex justify-between items-center">
                    {/* Home Team */}
                    <div className="flex items-center space-x-2 w-20">
                        <TShirtIcon size={20} color={match.homeColor} weight="fill"/>
                        <span className="text-sm font-medium truncate">{match.homeTeam}</span>
                    </div>

                    {/* Score */}
                    <div className="text-center w-24">
                        <div className="flex items-center justify-center space-x-2 text-xl font-bold">
                            <span>{match.homeScore}</span>
                            <span>-</span>
                            <span>{match.awayScore}</span>
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center space-x-2 w-20 justify-end">
                        <span className="text-sm font-medium truncate">{match.awayTeam}</span>
                        <TShirtIcon size={20} color={match.awayColor} weight="fill"/>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default MatchRow;