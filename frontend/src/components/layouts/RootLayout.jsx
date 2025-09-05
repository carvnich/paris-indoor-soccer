import Navbar from "./Navbar";

const RootLayout = ({ children }) => {
	return (
		<div className="bg-gray-300">
			<Navbar />
			<div className="">{children}</div>
		</div>
	);
};

export default RootLayout;