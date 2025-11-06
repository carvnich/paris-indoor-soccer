import { useEffect, useState, useRef } from 'react';
import { FaSave, FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
import { IoShirt } from 'react-icons/io5';
import { teamFilters, getTeamColorHex } from './../utils/data';

const PlayerForm = ({ initialData, onSubmit, onCancel, onDelete, isLoading = false }) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		team: 'Yellow',
		imagePreview: null,
		imageBase64: null,
		deleteImage: false
	});
	const fileInputRef = useRef(null);

	// Filter out "All" option for team selection
	const teams = teamFilters.filter(team => team.value !== "all");

	// Initialize form with existing data
	useEffect(() => {
		if (initialData) {
			setFormData({
				firstName: initialData.firstName || '',
				lastName: initialData.lastName || '',
				team: initialData.team || 'Yellow',
				imagePreview: initialData.imageUrl || null,
				imageBase64: null,
				deleteImage: false
			});
		}
	}, [initialData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				alert('Please select an image file');
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert('Image size must be less than 5MB');
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData(prev => ({
					...prev,
					imagePreview: reader.result,
					imageBase64: reader.result,
					deleteImage: false
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setFormData(prev => ({
			...prev,
			imagePreview: null,
			imageBase64: null,
			deleteImage: true
		}));
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.firstName.trim() || !formData.lastName.trim()) {
			alert('First name and last name are required');
			return;
		}

		onSubmit({
			firstName: formData.firstName.trim(),
			lastName: formData.lastName.trim(),
			team: formData.team,
			imageBase64: formData.imageBase64,
			deleteImage: formData.deleteImage
		});
	};

	const handleDelete = () => {
		if (window.confirm(`Are you sure you want to delete ${initialData?.firstName} ${initialData?.lastName}?`)) {
			onDelete?.();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Image Upload Section */}
			<div className="flex flex-col items-center space-y-4">
				{/* Image Preview */}
				<div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
					{formData.imagePreview ? (
						<img
							src={formData.imagePreview}
							alt="Player preview"
							className="w-full h-full object-cover"
						/>
					) : (
						<span className="text-gray-400 text-sm">No Image</span>
					)}
				</div>

				{/* Image Upload Buttons */}
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
					>
						<FaUpload className="h-4 w-4" />
						<span>{formData.imagePreview ? 'Change Image' : 'Upload Image'}</span>
					</button>

					{formData.imagePreview && (
						<button
							type="button"
							onClick={handleRemoveImage}
							className="flex items-center gap-2 px-4 py-2 border border-red-300 rounded-md hover:bg-red-50 text-red-600"
						>
							<FaTrash className="h-4 w-4" />
							<span>Remove</span>
						</button>
					)}
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
					className="hidden"
				/>
			</div>

			{/* Player Name */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						First Name
					</label>
					<input
						type="text"
						name="firstName"
						value={formData.firstName}
						onChange={handleInputChange}
						placeholder="First name"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Last Name
					</label>
					<input
						type="text"
						name="lastName"
						value={formData.lastName}
						onChange={handleInputChange}
						placeholder="Last name"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
						required
					/>
				</div>
			</div>

			{/* Team Selection */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Team
				</label>
				<div className="grid grid-cols-3 gap-2">
					{teams.map((team) => (
						<button
							key={team.value}
							type="button"
							onClick={() => setFormData(prev => ({ ...prev, team: team.value }))}
							className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md border-2 transition-colors ${
								formData.team === team.value
									? 'border-orange-500 bg-orange-50'
									: 'border-gray-300 hover:bg-gray-50'
							}`}
						>
							<IoShirt size={24} color={team.color} />
						</button>
					))}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-4 pt-4">
				<button
					type="submit"
					disabled={isLoading}
					className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 disabled:opacity-20 disabled:cursor-not-allowed"
				>
					<FaSave className="h-4 w-4" />
					<span>{isLoading ? 'Saving...' : 'Save'}</span>
				</button>

				<button
					type="button"
					onClick={onCancel}
					disabled={isLoading}
					className="flex-1 flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<FaTimes className="h-4 w-4" />
					<span>Cancel</span>
				</button>

				{/* Delete Button (only for existing players) - Icon only */}
				{initialData && onDelete && (
					<button
						type="button"
						onClick={handleDelete}
						disabled={isLoading}
						title="Delete player"
						className="flex items-center justify-center bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
						>
						<FaTrash className="h-4 w-4" />
					</button>
				)}
			</div>
		</form>
	);
};

export default PlayerForm;