import { FaEdit } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import { useUser } from "../hooks/useUser";
import { formatMatchTime, getTeamColorHex } from './../utils/data';

const MatchRow = ({ match, onEdit }) => {
	const { user } = useUser();
	const isAdmin = user?.role === 'admin';

	return (
		<tr className="border-b border-gray-100">
			<td className="py-3 px-2 sm:px-4">
				<div className="flex items-center">
					{/* Home Team */}
					<div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-1 min-w-0">
						<span className="text-lg">{match.homeTeam}</span>
						<IoShirt size={18} className="sm:w-5 sm:h-5 shrink-0" color={getTeamColorHex(match.homeColor)} />
					</div>

					{/* Score and match time */}
					<div className="flex flex-col text-center w-24">
						<div className="flex items-center justify-center space-x-2 text-xl font-bold">
							<span>{match.homeScore}</span>
							<span>-</span>
							<span>{match.awayScore}</span>
						</div>
						<span className="text-xs text-gray-500">{formatMatchTime(match.dateTime)}</span>
					</div>

					{/* Away Team */}
					<div className="flex items-center justify-start space-x-1 sm:space-x-2 flex-1 min-w-0">
						<IoShirt size={18} className="sm:w-5 sm:h-5 shrink-0" color={getTeamColorHex(match.awayColor)} />
						<span className="text-lg">{match.awayTeam}</span>
					</div>

					{/* Edit button - Admin only */}
					{isAdmin && (
						<div className="flex items-center">
							<button className="flex items-center border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-200" title="Edit match" onClick={() => onEdit?.(match)}>
								<FaEdit size={18} />
							</button>
						</div>
					)}
				</div>
			</td>
		</tr>
	);
};

export default MatchRow;