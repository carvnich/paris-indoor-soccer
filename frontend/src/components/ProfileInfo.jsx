import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { getInitials } from "../utils/helper";

const ProfileInfo = () => {
	const { user, clearUser } = useContext(UserContext);

	const handelLogout = () => {
		localStorage.clear();
		clearUser();
	};

	return user && (
		<div className="flex items-center">
			{/* User Avatar */}
			<div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
				<span className="text-lg font-semibold text-black">
					{getInitials(user.name)}
				</span>
			</div>

			{/* User Info */}
			<div className="flex flex-col gap-1">
				<div className="text-[15px] text-black font-bold leading-tight">
					{user.name || ""}
				</div>
				<button className="text-orange-600 text-sm font-semibold cursor-pointer hover:underline text-left" onClick={handelLogout}>
					Logout
				</button>
			</div>
		</div>
	);
};

export default ProfileInfo;