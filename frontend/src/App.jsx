import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
					<Toaster position="top-center"
						toastOptions={{
							duration: 3000,
							style: { background: '#363636', color: '#fff', },
							success: { duration: 3000, iconTheme: { primary: '#22c55e', secondary: '#fff', }, },
							error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff', }, },
						}}
					/>
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