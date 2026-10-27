import React, { createContext, useContext, useState, useMemo } from "react";
import { orchidService } from "../services/orchidService";

const OrchidContext = createContext(null);

export function OrchidProvider({ children }) {
  const [allOrchids] = useState(() => orchidService.getInitialOrchids());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [onlySpecial, setOnlySpecial] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState(new Set());
  const [selectedOrchid, setSelectedOrchid] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Categories computed via Service
  const categories = useMemo(() => orchidService.getCategories(allOrchids), [allOrchids]);

  // Filtered orchids computed via Service
  const filteredOrchids = useMemo(() => {
    return orchidService.filterOrchids(allOrchids, {
      searchKeyword,
      selectedCategory,
      onlySpecial,
      sortBy
    });
  }, [allOrchids, searchKeyword, selectedCategory, onlySpecial, sortBy]);

  // Dynamic stats computed via Service
  const stats = useMemo(() => {
    return orchidService.calculateExplorerStats(filteredOrchids, favorites);
  }, [filteredOrchids, favorites]);

  // Service actions wrapped for component consumers
  const handleToggleFavorite = (orchidId) => {
    setFavorites((prev) => orchidService.toggleFavorite(prev, orchidId));
  };

  const handleOpenDetail = (orchid) => {
    setSelectedOrchid(orchid);
    setShowModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedOrchid(null);
    setShowModal(false);
  };

  const handleResetFilters = () => {
    setSearchKeyword("");
    setSelectedCategory("All");
    setOnlySpecial(false);
    setSortBy("rating");
  };

  const value = {
    allOrchids,
    filteredOrchids,
    categories,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    onlySpecial,
    setOnlySpecial,
    sortBy,
    setSortBy,
    favorites,
    handleToggleFavorite,
    selectedOrchid,
    showModal,
    handleOpenDetail,
    handleCloseDetail,
    handleResetFilters,
    stats
  };

  return <OrchidContext.Provider value={value}>{children}</OrchidContext.Provider>;
}

export function useOrchidContext() {
  const context = useContext(OrchidContext);
  if (!context) {
    throw new Error("useOrchidContext must be used within an OrchidProvider");
  }
  return context;
}
