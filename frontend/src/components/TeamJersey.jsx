import { useState, useEffect } from "react";
import { IoShirt, IoShirtOutline } from "react-icons/io5";

const TeamJersey = ({ color, size = 24, className = "" }) => {
	const isWhite = color === "#ffffff" || color?.toLowerCase() === "#fff";
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		if (!isWhite) return;

		const checkDark = () => {
			setIsDark(document.documentElement.classList.contains('dark'));
		};

		checkDark();

		const observer = new MutationObserver(checkDark);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	}, [isWhite]);

	if (isWhite) {
		return (
			<IoShirtOutline
				size={size}
				className={className}
				color={isDark ? '#ffffff' : '#000000'}
			/>
		);
	}

	return <IoShirt size={size} color={color} className={className} />;
};

export default TeamJersey;
