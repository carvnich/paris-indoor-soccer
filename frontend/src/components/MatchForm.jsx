import { useEffect, useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { IoShirt } from 'react-icons/io5';
import { getTeamColorHex } from './../utils/data';

const MatchForm = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
	const [formData, setFormData] = useState({ homeTeamScore: '', awayTeamScore: '', dateTime: '' });

	// Initialize form with existing data
	useEffect(() => {
		if (initialData) {
			setFormData({
				homeTeamScore: initialData.homeScore?.toString() || '',
				awayTeamScore: initialData.awayScore?.toString() || '',
				dateTime: initialData.dateTime || ''
			});
		}
	}, [initialData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({
			homeTeamScore: formData.homeTeamScore === '' ? null : parseInt(formData.homeTeamScore),
			awayTeamScore: formData.awayTeamScore === '' ? null : parseInt(formData.awayTeamScore),
			dateTime: formData.dateTime
		});
	};

	// Convert ISO datetime string to datetime-local format (YYYY-MM-DDTHH:MM)
	const convertToDateTimeLocalFormat = (isoString) => {
		if (!isoString) return '';
		const date = new Date(isoString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Date and Time */}
			<div className="w-full overflow-hidden">
				<input
					type="datetime-local"
					name="dateTime"
					value={convertToDateTimeLocalFormat(formData.dateTime)}
					onChange={(e) => {
						// Convert datetime-local value back to ISO string
						const isoString = e.target.value ? new Date(e.target.value).toISOString() : '';
						setFormData(prev => ({ ...prev, dateTime: isoString }));
					}}
					className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-pointer"
					style={{ colorScheme: 'light' }}
				/>
			</div>

			{/* Match Details */}
			<div className="flex items-center py-3">
				{/* Home Team */}
				<div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-1 min-w-0">
					<span className="text-lg">{initialData?.homeTeam}</span>
					<IoShirt size={18} className="sm:w-5 sm:h-5 shrink-0" color={getTeamColorHex(initialData?.homeColor)} />
				</div>

				{/* Score Section */}
				<div className="flex flex-col items-center w-30 mx-6">
					<div className="flex items-center justify-center space-x-2 text-xl font-bold">
						<input type="number" name="homeTeamScore" value={formData.homeTeamScore} onChange={handleInputChange} min="0" inputMode="numeric" className="w-14 px-1 py-1 border border-gray-300 rounded-md focus:outline-none text-center text-xl font-bold" />
						<span>-</span>
						<input type="number" name="awayTeamScore" value={formData.awayTeamScore} onChange={handleInputChange} min="0" inputMode="numeric" className="w-14 px-1 py-1 border border-gray-300 rounded-md focus:outline-none text-center text-xl font-bold" />
					</div>
				</div>

				{/* Away Team */}
				<div className="flex items-center justify-start space-x-1 sm:space-x-2 flex-1 min-w-0">
					<IoShirt size={18} className="sm:w-5 sm:h-5 shrink-0" color={getTeamColorHex(initialData?.awayColor)} />
					<span className="text-lg">{initialData?.awayTeam}</span>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="grid grid-cols-2 gap-4 pt-4">
				<button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 disabled:opacity-20 disabled:cursor-not-allowed">
					<FaSave className="h-4 w-4" />
					<span>{isLoading ? 'Saving...' : 'Save'}</span>
				</button>

				<button type="button" onClick={onCancel} disabled={isLoading} className="flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
					<FaTimes className="h-4 w-4" />
					<span>Cancel</span>
				</button>
			</div>
		</form>
	);
};

export default MatchForm;