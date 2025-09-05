import { useEffect, useState } from 'react';
import { FaCaretLeft } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RootLayout from '../components/layouts/RootLayout';
import MatchForm from '../components/MatchForm';
import { useMatch } from "../hooks/useMatch";
import { useUser } from '../hooks/useUser';
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

// Edit match component for admin users to update match scores
export const EditMatch = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useUser();
	const { refetchMatches } = useMatch();

	const [match, setMatch] = useState(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	// Redirect non-admin users and get match data from navigation state
	useEffect(() => {
		if (user?.role !== 'admin') {
			navigate('/matches');
			return;
		}

		if (location.state?.matchData) {
			setMatch(location.state.matchData);
		} else {
			setError('Match data not found. Please navigate from the matches page.');
		}
	}, [user, location.state, navigate]);

	// Handle form submission - update match scores via API
	const handleSave = async (formData) => {
		try {
			setSaving(true);
			setError(null);

			// Send updated scores to backend
			await axiosInstance.put(API_PATHS.MATCH.UPDATE(match._id), {
				homeTeamScore: parseInt(formData.homeTeamScore),
				awayTeamScore: parseInt(formData.awayTeamScore)
			});

			refetchMatches();

			// Navigate back with success message
			navigate('/matches', {
				state: { message: 'Match updated successfully', type: 'success' }
			});
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update match');
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
							<Link to="/matches">
								<button className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-200">
									<FaCaretLeft className="h-4 w-4" />
									<span>Back</span>
								</button>
							</Link>
							<h1 className="text-xl font-bold text-gray-900">Edit Match</h1>
						</div>

						{/* Error message display */}
						{error && (
							<div className="mb-4 p-4 border border-red-300 rounded-md bg-red-50">
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						)}

						{/* Match form or error state */}
						{match ? (
							<MatchForm
								initialData={match}
								onSubmit={handleSave}
								onCancel={() => navigate('/matches')}
								isLoading={saving}
							/>
						) : (
							<div className="text-center py-8 text-red-600">Match not found</div>
						)}
					</div>
				</div>
			</div>
		</RootLayout>
	);
};