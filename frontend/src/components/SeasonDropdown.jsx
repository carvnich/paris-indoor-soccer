import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FaChevronDown } from "react-icons/fa";

const SeasonDropdown = ({ selectedSeason, availableSeasons, onSeasonChange, disabled = false, className = "", label = null }) => {
	return (
		<div className={`flex items-center space-x-2 ${className}`}>
			{label && <span className="text-sm font-medium">{label}</span>}
			<Menu as="div" className="relative inline-block">
				<MenuButton disabled={disabled} className="inline-flex w-32 justify-center items-center gap-x-1.5 rounded-md px-3 py-2 text-sm border border-gray-300 hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
					{selectedSeason}
					<FaChevronDown aria-hidden="true" className="size-3" />
				</MenuButton>
				<MenuItems transition className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white border border-gray-300 shadow-lg transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
					<div className="py-1">
						{availableSeasons.map((season) => (
							<MenuItem key={season}>
								<button onClick={() => onSeasonChange(season)} className="block w-full px-4 py-2 text-left text-sm data-focus:bg-gray-100 hover:bg-gray-100">
									{season}
								</button>
							</MenuItem>
						))}
					</div>
				</MenuItems>
			</Menu>
		</div>
	);
};

export default SeasonDropdown;