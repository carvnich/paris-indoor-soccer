import React from "react";

interface DateHeaderProps {
    date: string;
    dateRefs: React.RefObject<Record<string, HTMLTableRowElement | null>>;
}

const DateHeader = ({date, dateRefs}: DateHeaderProps) => {
    const formatDate = (dateStr: string) => {
        const monthMap: Record<string, string> = {
            "Oct": "October",
            "Nov": "November",
            "Dec": "December",
            "Jan": "January",
            "Feb": "February",
            "Mar": "March",
            "Apr": "April",
        };

        const [month, day] = dateStr.split(" ");
        // Determine year based on month (Oct-Dec = 2024, Jan-Apr = 2025)
        const year = ["Jan", "Feb", "Mar", "Apr"].includes(month) ? 2025 : 2024;
        return `${monthMap[month]} ${day}, ${year}`;
    };

    return (
        <tr ref={(el) => {
            dateRefs.current[date] = el;
        }} className="bg-gray-50">
            <td className="py-4 px-4">
                <h3 className="text-lg font-bold text-left">{formatDate(date)}</h3>
            </td>
        </tr>
    );
};

export default DateHeader;