import { IoShirt } from "react-icons/io5";
import { formatMatchDate, formatMatchTime } from "../utils/data";

const MatchesList = ({ _id, dateTime, homeTeam, homeColorHex, homeScore, awayTeam, awayColorHex, awayScore, homeColor, awayColor, onMatchClick }) => {
	const date = formatMatchDate(dateTime);
	const time = formatMatchTime(dateTime);
	const matchPlayed = homeScore !== null && awayScore !== null;

	const handleClick = () => {
		if (onMatchClick) {
			onMatchClick({ _id, dateTime, homeTeam, homeColorHex, homeScore, awayTeam, awayColorHex, awayScore, homeColor, awayColor });
		}
	};

	return (
		<article className="p-4 border border-neutral-300 rounded bg-white cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleClick}>
			<div className="flex justify-between items-center">
				{/* Home */}
				<div className="text-center w-20">
					<div className="flex justify-center mb-2">
						{homeTeam !== "TBD" && <IoShirt size={24} color={homeColorHex} />}
					</div>
					<div className="text-md md:text-xl">{homeTeam}</div>
				</div>

				{/* Score or Date/Time */}
				<div className="text-center w-24">
					{matchPlayed ? (
						<>
							{/* Show score when match is played */}
							<div className="flex items-center justify-center space-x-2 text-xl font-semibold">
								<span>{homeScore}</span>
								<span>-</span>
								<span>{awayScore}</span>
							</div>
							{/* Smaller date and time when played */}
							<div className="text-md">{date}</div>
						</>
					) : (
						<>
							{/* Hide dash and show larger date/time when not played */}
							<div className="text-xl font-semibold">{time}</div>
							<div className="text-md">{date}</div>
						</>
					)}
				</div>

				{/* Away */}
				<div className="text-center w-20">
					<div className="flex justify-center mb-2">
						{awayTeam !== "TBD" && <IoShirt size={24} color={awayColorHex} />}
					</div>
					<div className="text-md md:text-xl">{awayTeam}</div>
				</div>
			</div>
		</article>
	);
};

export default MatchesList;