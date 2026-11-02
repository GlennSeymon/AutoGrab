import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout.tsx';
import FormPage from './pages/FormPage.tsx';
import ResultPage from './pages/ResultPage.tsx';

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<FormPage />} />
				<Route path="/upload" element={<ResultPage />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;
