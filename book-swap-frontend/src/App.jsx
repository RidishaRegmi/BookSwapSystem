import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm.jsx";
import HomePage from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BrowseBooks from "./pages/BrowseBooks.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import AddBook from "./pages/AddBook.jsx";
import SwapRequest from "./pages/SwapRequest.jsx";
import SwapManagement from "./pages/SwapManagement.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MapPage from "./pages/MapPage";
import UserPublicProfile from "./pages/UserPublicProfile.jsx";
import ChatsPage from "./pages/ChatsPage.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Wishlist from "./pages/Wishlist.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<BrowseBooks />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/swap-request/:bookId" element={<SwapRequest />} />
        <Route path="/swap-management" element={<SwapManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/users/:id" element={<UserPublicProfile />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </Router>
  );
}

export default App;
