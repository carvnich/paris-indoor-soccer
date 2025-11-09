import { useState, useEffect } from "react";
import { FaCaretLeft, FaEdit, FaPlus } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import RootLayout from "../components/layouts/RootLayout";
import { useUser } from "../hooks/useUser";
import { teamFilters } from "../utils/data";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import Spinner from "../components/Spinner";

export const Rosters = () => {
	const navigate = useNavigate();
	const { user } = useUser();
	const isAdmin = user?.role === 'admin';

	const [selectedTeam, setSelectedTeam] = useState("Yellow");
	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Filter out "All" option for team tabs
	const teams = teamFilters.filter(team => team.value !== "all");

	// Fetch players from API
	useEffect(() => {
		const fetchPlayers = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await axiosInstance.get(API_PATHS.PLAYER.GET_ALL);
				setPlayers(response.data.players || []);
			} catch (err) {
				setError(err.response?.data?.message || 'Failed to load players');
			} finally {
				setLoading(false);
			}
		};

		fetchPlayers();
	}, []);


	// Filter players by selected team
	const currentRoster = players.filter(player => player.team === selectedTeam);

	// Handle edit player
	const handleEditPlayer = (player) => {
		navigate(`/rosters/${player._id}/edit`, { state: { playerData: player } });
	};

	// Handle add player
	const handleAddPlayer = () => {
		navigate('/rosters/add');
	};

	if (loading) {
		return (
			<RootLayout>
				<div className="bg-gray-300 p-4">
					<div className="w-full flex justify-center items-center py-20">
						<Spinner />
					</div>
				</div>
			</RootLayout>
		);
	}

	return (
		<RootLayout>
			<div className="bg-gray-300 p-4">
				<div className="w-full">
					<div className="bg-white rounded-lg p-6 border border-neutral-300">
						{/* Header with back button */}
						<div className="flex items-center justify-between mb-6">
							<Link to="/">
								<button className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-200">
									<FaCaretLeft className="h-4 w-4" />
									<span>Home</span>
								</button>
							</Link>
							<h1 className="text-2xl font-bold text-gray-900">Team Rosters</h1>
							{isAdmin && (
								<button onClick={handleAddPlayer} className="flex items-center gap-2 bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700">
									<FaPlus className="h-4 w-4" />
									<span className="md:inline-flex hidden">Add Player</span>
								</button>
							)}
						</div>

						{/* Error message */}
						{error && (
							<div className="mb-4 p-4 border border-red-300 rounded-md bg-red-50">
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						)}

						{/* Team tabs */}
						<div className="mb-6">
							<div className="grid grid-cols-6 text-sm">
								{teams.map((team) => (
									<button key={team.value} className={`flex items-center justify-center py-2 first:rounded-l-md last:rounded-r-md border border-gray-300 hover:bg-gray-200 ${selectedTeam === team.value ? 'bg-gray-300' : 'bg-white'}`} onClick={() => setSelectedTeam(team.value)}>
										<IoShirt size={24} color={team.color} />
									</button>
								))}
							</div>
						</div>

						{/* Roster table */}
						<div className="w-full">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{currentRoster.map((player) => (
									<div key={player._id} className="flex items-center gap-4 p-2 border border-gray-200 rounded-lg">
										{/* Player image */}
										<div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
											{player.imageUrl ? (
												<img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover"/>
											) : (
												<span className="text-gray-500 text-xs">Photo</span>
											)}
										</div>
										{/* Player name */}
										<div className="flex-1">
											<p className="text-lg font-medium">{player.firstName} {player.lastName}</p>
										</div>
										{/* Edit button - Admin only */}
										{isAdmin && (
											<div className="flex items-center">
												<button
													className="flex items-center border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-200"
													title="Edit player"
													onClick={() => handleEditPlayer(player)}
												>
													<FaEdit size={18} />
												</button>
											</div>
										)}
									</div>
								))}
							</div>

							{/* Empty state */}
							{currentRoster.length === 0 && (
								<div className="text-center py-8 text-gray-500">
									<p className="text-lg">No players found for this team</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</RootLayout>
	);
};