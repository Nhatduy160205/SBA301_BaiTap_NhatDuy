import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { userService } from "./services/userService";
import AppNavbar from "./components/AppNavbar";
import CacheStatus from "./components/CacheStatus";
import UserList from "./components/UserList";
import AsyncPlayground from "./components/AsyncPlayground";
import CreateUserModal from "./components/CreateUserModal";
import AppFooter from "./components/AppFooter";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const [diagnostics, setDiagnostics] = useState(() => userService.getDiagnostics());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const abortControllerRef = useRef(null);

  const loadUsers = async (forceRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await userService.getUsers({
        forceRefresh,
        signal: abortControllerRef.current.signal
      });
      setUsers(result.data);
      setSource(result.source);
      setDiagnostics(userService.getDiagnostics());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(false);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleClearCache = () => {
    userService.clearCache();
    setDiagnostics(userService.getDiagnostics());
    setSource(null);
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setError("Request was cancelled by user (AbortController).");
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers((prev) => [newUser, ...prev]);
      setDiagnostics(userService.getDiagnostics());
    } catch (err) {
      alert("Error adding user: " + err.message);
    }
  };

  const filteredUsers = userService.filterUsers(users, keyword);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setShowCreateModal(true)}
      />

      <Container className="py-4 flex-grow-1">
        {activeTab === "users" ? (
          <>
            <CacheStatus
              diagnostics={diagnostics}
              onClearCache={handleClearCache}
              onRefresh={loadUsers}
              loading={loading}
              onCancelRequest={handleCancelRequest}
            />
            <UserList
              users={filteredUsers}
              keyword={keyword}
              onKeywordChange={setKeyword}
              loading={loading}
              error={error}
              source={source}
              onRetry={() => loadUsers(true)}
            />
          </>
        ) : (
          <AsyncPlayground />
        )}
      </Container>

      <CreateUserModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSave={handleCreateUser}
      />
      <AppFooter />
    </div>
  );
}

export default App;
