import { Dialog, DialogPanel, DialogTitle, Field, Input, Label, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useContext, useState } from "react";
import toast from "react-hot-toast";
import { HiX } from "react-icons/hi";
import { UserContext } from "../context/UserContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { validateEmail } from '../utils/helper';

const AuthModal = ({ isOpen, onClose }) => {
	const [isLogin, setIsLogin] = useState(true);

	// Form fields
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [adminAccessToken, setAdminAccessToken] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const { updateUser } = useContext(UserContext);

	// Reset form when modal closes or mode changes
	const resetForm = () => {
		setName("");
		setEmail("");
		setPassword("");
		setAdminAccessToken("");
		setError(null);
		setLoading(false);
	};

	// Handle modal close
	const handleClose = () => {
		resetForm();
		onClose();
	};

	// Switch between login and signup modes
	const toggleMode = () => {
		setIsLogin(!isLogin);
		resetForm();
	};

	// Validate form inputs
	const validateForm = () => {
		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			return false;
		}

		if (!password || password.length < 8) {
			setError("Password must be at least 8 characters long.");
			return false;
		}

		if (!isLogin && (!name || name.trim().length < 2)) {
			setError("Please enter a valid name (at least 2 characters).");
			return false;
		}

		return true;
	};

	// Handle login submission
	const handleLogin = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setError("");
		setLoading(true);

		try {
			const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password, });

			const { token } = response.data;

			if (token) {
				localStorage.setItem("token", token);
				updateUser(response.data);
				toast.success("Logged in successfully");
				handleClose();
			}
		} catch (error) {
			console.log("Login error:", error);

			if (error.response?.data?.message) {
				setError(error.response.data.message);
			} else if (error.message === 'Network Error') {
				setError("Cannot connect to server. Please try again later.");
			} else if (error.code === 'ERR_NETWORK') {
				setError("Network error. Check your internet connection.");
			} else {
				setError("Something went wrong. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	// Handle signup submission
	const handleSignup = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setError("");
		setLoading(true);

		try {
			const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { name: name.trim(), email, password, adminAccessToken: adminAccessToken.trim() || undefined, });

			const { token } = response.data;

			if (token) {
				localStorage.setItem("token", token);
				updateUser(response.data);
				toast.success("Account created successfully!");
				handleClose();
			}
		} catch (error) {
			if (error.response?.data?.message) {
				setError(error.response.data.message);
			} else if (error.message === 'Network Error') {
				setError("Cannot connect to server. Please try again later.");
			} else if (error.code === 'ERR_NETWORK') {
				setError("Network error. Check your internet connection.");
			} else {
				setError("Something went wrong. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	// Handle form submission based on current mode
	const handleSubmit = isLogin ? handleLogin : handleSignup;

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={handleClose}>
				{/* Backdrop */}
				<TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 backdrop-blur-xs" />
				</TransitionChild>

				{/* Modal content */}
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
							<DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-8 text-left align-middle shadow-xl transition-all border-2 border-gray-700">
								{/* Close button */}
								<button onClick={handleClose} className="absolute top-4 right-4 hover:text-gray-700" aria-label="Close modal">
									<HiX size={28} />
								</button>

								{/* Modal header */}
								<DialogTitle as="h3" className="text-xl font-semibold text-black text-center mb-2">
									{isLogin ? "Welcome Back" : "Create an Account"}
								</DialogTitle>

								<p className="text-sm text-black text-center mb-6">
									{isLogin ? "Please enter your details to log in" : "Please enter your details below"}
								</p>

								{/* Auth form */}
								<form onSubmit={handleSubmit} className="space-y-6">
									{/* Name field */}
									{!isLogin && (
										<Field>
											<Label className="block text-md font-medium text-black mb-2">
												Name
											</Label>
											<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" type="text" autoComplete="name" disabled={loading} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none disabled:opacity-50" />
										</Field>
									)}

									{/* Email field */}
									<Field>
										<Label className="block text-md font-medium text-black mb-2">
											Email Address
										</Label>
										<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" type="email" autoComplete="email" disabled={loading} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none disabled:opacity-50" />
									</Field>

									{/* Password field */}
									<Field>
										<Label className="block text-md font-medium text-black mb-2">
											Password
										</Label>
										<Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 Characters" type="password" autoComplete={isLogin ? "current-password" : "new-password"} disabled={loading} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none disabled:opacity-50" />
									</Field>

									{/* Admin access token field (signup only) */}
									{!isLogin && (
										<Field>
											<Label className="block text-md font-medium text-black mb-2">
												Admin Access Token <span className="text-gray-400">(Optional)</span>
											</Label>
											<Input value={adminAccessToken} onChange={(e) => setAdminAccessToken(e.target.value)} placeholder="Leave blank for regular user account" type="password" autoComplete="off" disabled={loading} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none disabled:opacity-50" />
											<p className="text-xs text-gray-500 mt-1">
												Enter admin token to create an admin account
											</p>
										</Field>
									)}

									{/* Error message */}
									{error && (
										<p className="text-red-500 text-xs">{error}</p>
									)}

									{/* Submit button */}
									<button type="submit" disabled={loading} className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200">
										{loading ? (isLogin ? "LOGGING IN..." : "SIGNING UP...") : (isLogin ? "LOG IN" : "SIGN UP")}
									</button>

									{/* Mode toggle */}
									<p className="text-sm text-black text-center">
										{isLogin ? "Don't have an account? " : "Already have an account? "}
										<button type="button" className="font-medium cursor-pointer hover:underline" onClick={toggleMode} disabled={loading}>
											{isLogin ? "Sign Up" : "Log in"}
										</button>
									</p>
								</form>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default AuthModal;