import { IoShirt } from "react-icons/io5";
import { formatMatchDate, formatMatchTime } from "../utils/data";

const MatchesList = ({ dateTime, homeTeam, homeColorHex, homeScore, awayTeam, awayColorHex, awayScore }) => {
	const date = formatMatchDate(dateTime);
	const time = formatMatchTime(dateTime);

	return (
		<article className="p-4 border border-neutral-300 rounded bg-white">
			<div className="flex justify-between items-center">
				{/* Home */}
				<div className="text-center w-20">
					<div className="flex justify-center mb-2">
						<IoShirt size={24} color={homeColorHex} />
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
					<div className="text-sm">{date}</div>
					<div className="text-xs text-gray-500">{time}</div>
				</div>

				{/* Away */}
				<div className="text-center w-20">
					<div className="flex justify-center mb-2">
						<IoShirt size={24} color={awayColorHex} />
					</div>
					<div className="text-lg">{awayTeam}</div>
				</div>
			</div>
		</article>
	);
};

export default MatchesList;