import { useEffect, useState } from 'react';
import { FaCaretLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import RootLayout from '../components/layouts/RootLayout';
import PlayerForm from '../components/PlayerForm';
import { useUser } from '../hooks/useUser';
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

// Add player component for admin users to create new players
export const AddPlayer = () => {
	const navigate = useNavigate();
	const { user } = useUser();

	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	// Redirect non-admin users
	useEffect(() => {
		if (user?.role !== 'admin') {
			navigate('/rosters');
		}
	}, [user, navigate]);

	// Handle form submission - create new player via API
	const handleSave = async (formData) => {
		try {
			setSaving(true);
			setError(null);

			// Create FormData for multipart/form-data request
			const createData = new FormData();
			createData.append('firstName', formData.firstName);
			createData.append('lastName', formData.lastName);
			createData.append('team', formData.team);

			// Append image file if provided
			if (formData.imageFile) {
				createData.append('image', formData.imageFile);
			}

			await axiosInstance.post(API_PATHS.PLAYER.CREATE, createData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			// Show success toast and navigate back
			toast.success('Player created successfully');
			navigate('/rosters');
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to create player');
		} finally {
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
							<h1 className="text-xl font-bold text-gray-900">Add Player</h1>
						</div>

						{/* Error message display */}
						{error && (
							<div className="mb-4 p-4 border border-red-300 rounded-md bg-red-50">
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						)}

						{/* Player form */}
						<PlayerForm
							onSubmit={handleSave}
							onCancel={() => navigate('/rosters')}
							isLoading={saving}
						/>
					</div>
				</div>
			</div>
		</RootLayout>
	);
};