import { useContext } from 'react';
import { MatchContext } from '../context/MatchContext';

export const useMatch = () => {
	const context = useContext(MatchContext);
	if (!context) {
		throw new Error('useMatch must be used within a MatchesProvider');
	}
	return context;
};