"use client"

import { View, Text, TouchableOpacity, RefreshControl, Alert, FlatList } from "react-native"
import { useState, useEffect, useMemo } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useNavigation } from "@react-navigation/native"
import { outpass } from "../services/api"
import { COLORS } from "../utils/constants"

import styles from "../styles/OutpassStyles"

import LoadingSpinner from "../components/LoadingSpinner"
import FilterTabs from "../components/FilterTabs"
import WardenOutpassCard from "../components/WardenOutpassCard"

export default function OutpassRequestsScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme()
  const navigation = useNavigation()
  const [outpasses, setOutpasses] = useState([])
  const [filteredOutpasses, setFilteredOutpasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeFilter, setActiveFilter] = useState("pending")

  // Count statuses
  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      expired: 0,
    }

    outpasses.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status] += 1
      }
    })

    return counts
  }, [outpasses])

  const filterOptions = useMemo(
    () => [
      { key: "pending", label: "Pending", count: statusCounts.pending },
      { key: "approved", label: "Approved", count: statusCounts.approved },
      { key: "rejected", label: "Rejected", count: statusCounts.rejected },
      { key: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
      { key: "expired", label: "Expired", count: statusCounts.expired },
    ],
    [statusCounts]
  )

  useEffect(() => {
    loadOutpassRequests()
  }, [])

  useEffect(() => {
    filterOutpasses()
  }, [outpasses, activeFilter])

  const loadOutpassRequests = async () => {
    try {
      const response = await outpass.getPendingRequests() // WARDEN API written inside outpassRoute.js
      setOutpasses(response.data?.outpasses || [])
    } catch (error) {
      console.log("Warden outpass load error:", error)
      Alert.alert("Error", "Failed to load outpass requests")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadOutpassRequests()
    setRefreshing(false)
  }

  const filterOutpasses = () => {
    if (activeFilter === "all") {
      setFilteredOutpasses(outpasses)
    } else {
      setFilteredOutpasses(outpasses.filter((o) => o.status === activeFilter))
    }
  }

  // Update local state after approve/reject
  const handleStatusUpdate = (updatedOutpass) => {
    setOutpasses((prev) =>
      prev.map((op) => (op._id === updatedOutpass._id ? updatedOutpass : op))
    )
  }

  const renderOutpassCard = ({ item }) => (
    <WardenOutpassCard outpass={item} onUpdate={handleStatusUpdate} />
  )

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="close-circle-outline" size={64} color={COLORS.gray[400]} />
      <Text style={styles.emptyTitle}>No Requests</Text>
      <Text style={styles.emptyText}>No outpass requests in this category</Text>
    </View>
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, flexDirection: "row", alignItems: "center" },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text, flex: 1 }]}>
          Outpass Requests
        </Text>
        <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FilterTabs
        options={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <FlatList
        data={filteredOutpasses}
        renderItem={renderOutpassCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
