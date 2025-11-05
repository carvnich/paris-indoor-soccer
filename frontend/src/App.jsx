import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { MatchProvider } from "./context/MatchProvider";
import { UserProvider } from "./context/UserProvider";
import { EditMatch } from "./pages/EditMatch";
import { Home } from "./pages/Home";
import { Matches } from "./pages/Matches";
import { Rosters } from "./pages/Rosters";

const App = () => {
	return (
		<MatchProvider>
			<UserProvider>
				<div>
					<Router>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/matches" element={<Matches />} />
							<Route path="/matches/:matchId/edit" element={<EditMatch />} />
							<Route path="/roster" element={<Rosters />} />
						</Routes>
					</Router>
				</div>
			</UserProvider>
		</MatchProvider>
	);
};

export default App;