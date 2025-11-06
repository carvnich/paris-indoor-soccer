import { useEffect, useState } from 'react';
import { FaCaretLeft } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RootLayout from '../components/layouts/RootLayout';
import PlayerForm from '../components/PlayerForm';
import { useUser } from '../hooks/useUser';
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

// Edit player component for admin users to update player info and image
export const EditPlayer = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useUser();

	const [player, setPlayer] = useState(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	// Redirect non-admin users and get player data from navigation state
	useEffect(() => {
		if (user?.role !== 'admin') {
			navigate('/rosters');
			return;
		}

		if (location.state?.playerData) {
			setPlayer(location.state.playerData);
		} else {
			setError('Player data not found. Please navigate from the rosters page.');
		}
	}, [user, location.state, navigate]);

	// Handle form submission - update player via API
	const handleSave = async (formData) => {
		try {
			setSaving(true);
			setError(null);

			// Send updated player data to backend
			const updateData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				team: formData.team,
			};

			// Include image data if changed
			if (formData.imageBase64) {
				updateData.imageBase64 = formData.imageBase64;
			}

			// Include delete flag if image was removed
			if (formData.deleteImage) {
				updateData.deleteImage = true;
			}

			const response = await axiosInstance.put(API_PATHS.PLAYER.UPDATE(player._id), updateData);

			// Navigate back with success message
			navigate('/rosters', {
				state: { message: 'Player updated successfully', type: 'success' }
			});
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update player');
		} finally {
			setSaving(false);
		}
	};

	// Handle player deletion
	const handleDelete = async () => {
		try {
			setSaving(true);
			setError(null);

			await axiosInstance.delete(API_PATHS.PLAYER.DELETE(player._id));

			// Navigate back with success message
			navigate('/rosters', {
				state: { message: 'Player deleted successfully', type: 'success' }
			});
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to delete player');
			setSaving(false);
		}
	};

	return (
		<RootLayout>
			<div className="bg-gray-300 p-4">
				<div className="w-full max-w-2xl mx-auto">
					<div className="bg-white rounded-lg p-6 border border-neutral-300">
						{/* Header with back button and title */}
						<div className="flex items-center justify-between mb-6">
							<Link to="/rosters">
								<button className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-200">
									<FaCaretLeft className="h-4 w-4" />
									<span>Back</span>
								</button>
							</Link>
							<h1 className="text-xl font-bold text-gray-900">Edit Player</h1>
						</div>

						{/* Error message display */}
						{error && (
							<div className="mb-4 p-4 border border-red-300 rounded-md bg-red-50">
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						)}

						{/* Player form or error state */}
						{player ? (
							<PlayerForm
								initialData={player}
								onSubmit={handleSave}
								onCancel={() => navigate('/rosters')}
								onDelete={handleDelete}
								isLoading={saving}
							/>
						) : (
							<div className="text-center py-8 text-red-600">Player not found</div>
						)}
					</div>
				</div>
			</div>
		</RootLayout>
	);
};