import { useState } from 'react';

export const useAuthModal = () => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

	// Open the authentication modal
	const openAuthModal = () => {
		setIsAuthModalOpen(true);
	};

	// Close the authentication modal
	const closeAuthModal = () => {
		setIsAuthModalOpen(false);
	};

	return { isAuthModalOpen, openAuthModal, closeAuthModal, };
};