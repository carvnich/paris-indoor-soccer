import React from "react";
import {Badge} from "@/components/ui/badge";

interface DateHeaderProps {
    date: string;
    dateRefs: React.MutableRefObject<Record<string, HTMLTableRowElement | null>>;
    season: string;
    isPlayoffWeek?: boolean;
}

const DateHeader = ({date, dateRefs, season, isPlayoffWeek}: DateHeaderProps) => {
    const formatDate = (dateStr: string, seasonStr: string) => {
        const monthMap: Record<string, string> = {"Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April", "May": "May", "Jun": "June", "Jul": "July", "Aug": "August", "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"};

        const [month, day] = dateStr.split(" ");
        const seasonStartYear = parseInt(seasonStr.split("/")[0]); // "2022/2023" → 2022

        // Season runs from August to July
        // Aug-Dec = first year of season
        // Jan-Jul = second year of season
        const fullYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].includes(month) ? seasonStartYear + 1 : seasonStartYear;

        return `${monthMap[month]} ${day}, ${fullYear}`;
    };

    return (
        <tr ref={(el) => {
            if (dateRefs.current) {
                dateRefs.current[date] = el;
            }
        }} className="bg-gray-50">
            <td className="py-4 px-2 sm:px-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-left">{formatDate(date, season)}</h3>
                    {isPlayoffWeek && (
                        <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50 text-xs">
                            Playoffs
                        </Badge>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default DateHeader;