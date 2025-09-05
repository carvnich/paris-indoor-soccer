import { useEffect, useState } from "react";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

	useEffect(() => {
		if (user) return;

		const accessToken = localStorage.getItem("token");
		if (!accessToken) {
			setLoading(false);
			return;
		}

		const fetchUser = async () => {
			try {
				const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
				setUser(response.data);
			} catch (error) {
				console.error("User not authenticated", error);
				clearUser();
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [user]);

	const updateUser = (userData) => {
		setUser(userData);
		localStorage.setItem("token", userData.token);
		setLoading(false);
	};

	const clearUser = () => {
		setUser(null);
		localStorage.removeItem("token");
	};

	// Auth modal functions
	const openAuthModal = () => {
		setIsAuthModalOpen(true);
	};

	const closeAuthModal = () => {
		setIsAuthModalOpen(false);
	};

	return (
		<UserContext.Provider value={{ user, loading, updateUser, clearUser, isAuthModalOpen, openAuthModal, closeAuthModal }}>
			{children}
		</UserContext.Provider>
	);
};