import { useContext, useState } from "react";
import { GiSoccerBall } from "react-icons/gi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useAuthModal } from "../../hooks/useAuthModal";
import AuthModal from "../AuthModal";
import ProfileInfo from "../ProfileInfo";

const Navbar = () => {
	const { user } = useContext(UserContext);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Auth modal state management
	const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuthModal();

	// Toggle mobile menu open/close
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Close menu when a link is clicked
	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	// Handle login button click - opens modal and closes mobile menu
	const handleLoginClick = () => {
		openAuthModal();
		closeMenu();
	};

	return (
		<>
			<div className="h-16 bg-gray-300 flex items-center sticky top-0 z-30">
				<div className="flex flex-1 items-center justify-between p-4">
					{/* Logo */}
					<Link to="/" onClick={closeMenu}>
						<h2 className="flex items-center text-lg md:text-xl text-black font-bold gap-1">
							<GiSoccerBall size={32} />
							Paris Indoor Soccer
						</h2>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-4">
						<Link to="/">
							<h2 className="flex text-md text-black hover:underline">
								Home
							</h2>
						</Link>
						<Link to="/matches">
							<h2 className="flex text-md text-black hover:underline">
								Matches
							</h2>
						</Link>
						{user ? (
							<ProfileInfo />
						) : (
							<button onClick={openAuthModal} className="flex text-md text-black px-3 hover:underline">
								Login
							</button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button onClick={toggleMenu} className="md:hidden text-black hover:text-gray-600 focus:outline-none" aria-label="Toggle menu">
						{isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
					</button>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="absolute top-16 left-0 right-0 bg-gray-400 rounded-b-2xl md:hidden z-20">
						<div className="flex flex-col p-4 space-y-4">
							{/* Mobile Navigation Links */}
							<Link to="/" onClick={closeMenu}>
								<h2 className="text-black hover:text-gray-600 py-2">
									Home
								</h2>
							</Link>
							<Link to="/matches" onClick={closeMenu}>
								<h2 className="text-black hover:text-gray-600 py-2">
									Matches
								</h2>
							</Link>

							{/* Mobile Profile/Login Section */}
							{user ? (
								<div className="pt-2 border-t border-gray-400">
									<ProfileInfo />
								</div>
							) : (
								<button onClick={handleLoginClick} className="text-black hover:text-gray-600 py-2 text-left">
									Login
								</button>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Authentication Modal */}
			<AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
		</>
	);
};

export default Navbar;