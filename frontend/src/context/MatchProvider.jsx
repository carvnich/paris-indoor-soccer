import { useEffect, useState } from 'react';
import { fetchAvailableSeasons, fetchSeasonMatches } from '../utils/data';
import { MatchContext } from './MatchContext';

export const MatchProvider = ({ children }) => {
	const [availableSeasons, setAvailableSeasons] = useState([]);
	const [selectedSeason, setSelectedSeason] = useState('');
	const [seasonMatches, setSeasonMatches] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const loadSeasonMatches = async (season) => {
		if (!season) return;

		setLoading(true);
		setError(null);
		try {
			const transformedMatches = await fetchSeasonMatches(season);
			setSeasonMatches(transformedMatches);
		} catch (error) {
			console.error('Error fetching matches:', error);
			setError('Failed to load matches. Please try again.');
			setSeasonMatches([]);
		} finally {
			setLoading(false);
		}
	};

	// Load available seasons on component mount
	useEffect(() => {
		const loadSeasons = async () => {
			setLoading(true);
			try {
				const seasons = await fetchAvailableSeasons();
				setAvailableSeasons(seasons);
				// Set the first (most recent) season as default
				if (seasons.length > 0) {
					setSelectedSeason(seasons[0]);
				}
			} catch (error) {
				console.error('Error loading seasons:', error);
				setError('Failed to load seasons. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		loadSeasons();
	}, []);

	const handleSeasonChange = (season) => {
		setSelectedSeason(season);
	};

	// Fetch matches when selected season changes
	useEffect(() => {
		if (selectedSeason) {
			loadSeasonMatches(selectedSeason);
		}
	}, [selectedSeason]);

	const value = {
		selectedSeason,
		seasonMatches,
		loading,
		error,
		availableSeasons,
		handleSeasonChange,
		refetchMatches: () => loadSeasonMatches(selectedSeason),
	};

	return (
		<MatchContext.Provider value={value}>
			{children}
		</MatchContext.Provider>
	);
};