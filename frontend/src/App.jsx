import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { MatchProvider } from "./context/MatchProvider";
import { UserProvider } from "./context/UserProvider";
import { EditMatch } from "./pages/EditMatch";
import { Home } from "./pages/Home";
import { Matches } from "./pages/Matches";
import { Rosters } from "./pages/Rosters";
import { EditPlayer } from "./pages/EditPlayer";
import { AddPlayer } from "./pages/AddPlayer";

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
							<Route path="/rosters" element={<Rosters />} />
							<Route path="/rosters/add" element={<AddPlayer />} />
							<Route path="/rosters/:playerId/edit" element={<EditPlayer />} />
						</Routes>
					</Router>
				</div>
			</UserProvider>
		</MatchProvider>
	);
};

export default App;