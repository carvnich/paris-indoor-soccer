const Spinner = ({ size = 'medium', className = '' }) => {
	const sizeClasses = { small: 'w-4 h-4', medium: 'w-8 h-8', large: 'w-12 h-12', xlarge: 'w-16 h-16' };

	return (
		<div className={`${sizeClasses[size]} ${className}`}>
			<div className="animate-spin rounded-full border-3 border-gray-300 border-t-orange-600 w-full h-full"></div>
		</div>
	);
};

export default Spinner;