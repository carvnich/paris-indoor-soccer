import { formatFullDate } from "../utils/data";

const DateHeader = ({ date, dateRefs, isPlayoffWeek, matches }) => {
	return (
		<tr ref={(el) => dateRefs.current && (dateRefs.current[date] = el)} className="bg-gray-50">
			<td className="py-4 px-2 sm:px-4">
				<div className="flex items-center justify-between">
					<h3 className="text-base sm:text-xl font-bold text-left">{formatFullDate(matches[0].dateTime)}</h3>
					{isPlayoffWeek && (
						<span className="inline-flex items-center rounded-md bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-600 inset-ring inset-ring-amber-400/20">Playoffs</span>
					)}
				</div>
			</td>
		</tr>
	);
};

export default DateHeader;