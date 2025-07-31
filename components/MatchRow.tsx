import React from "react";
import {TShirtIcon} from "@phosphor-icons/react/dist/ssr";
import {type Match as MatchType} from "@/lib/utils";

interface MatchRowProps {
    match: MatchType;
}

const MatchRow = ({match}: MatchRowProps) => {
    return (
        <tr className="border-b border-gray-100">
            <td className="py-3 px-2 sm:px-4">
                <div className="flex items-center">
                    {/* Home Team */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-medium truncate text-right">{match.homeTeam}</span>
                        <TShirtIcon size={16} className="sm:w-5 sm:h-5 shrink-0" color={match.homeColor} weight="fill"/>
                    </div>

                    {/* Score */}
                    <div className="text-center w-16 sm:w-24 px-2 sm:px-4">
                        <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-lg sm:text-xl font-bold">
                            <span>{match.homeScore}</span>
                            <span>-</span>
                            <span>{match.awayScore}</span>
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-start space-x-1 sm:space-x-2 flex-1 min-w-0">
                        <TShirtIcon size={16} className="sm:w-5 sm:h-5 shrink-0" color={match.awayColor} weight="fill"/>
                        <span className="text-xs sm:text-sm font-medium truncate text-left">{match.awayTeam}</span>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default MatchRow;