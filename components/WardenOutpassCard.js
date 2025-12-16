"use client"

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { commonAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING, OUTPASS_STATUS } from "../utils/constants"

export default function WardenOutpassCard({ outpass, onUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case OUTPASS_STATUS.PENDING:
        return COLORS.warning
      case OUTPASS_STATUS.APPROVED:
        return COLORS.success
      case OUTPASS_STATUS.REJECTED:
        return COLORS.error
      case OUTPASS_STATUS.ACTIVE:
        return COLORS.primary
      case OUTPASS_STATUS.COMPLETED:
        return COLORS.gray[500]
      default:
        return COLORS.gray[400]
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case OUTPASS_STATUS.PENDING:
        return "time-outline"
      case OUTPASS_STATUS.APPROVED:
        return "checkmark-circle-outline"
      case OUTPASS_STATUS.REJECTED:
        return "close-circle-outline"
      case OUTPASS_STATUS.ACTIVE:
        return "play-circle-outline"
      case OUTPASS_STATUS.COMPLETED:
        return "checkmark-done-outline"
      default:
        return "help-circle-outline"
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })

  const updateStatus = (status) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${status} this outpass?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await commonAPI.updateOutpass(outpass._id, {
                status,
              })
              onUpdate(response.data)
              Alert.alert("Success", `Outpass ${status} successfully`)
            } catch (error) {
              Alert.alert("Error", "Failed to update outpass")
            }
          },
        },
      ]
    )
  }

  const canTakeAction = outpass.status === OUTPASS_STATUS.PENDING

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <View style={styles.statusContainer}>
          <Ionicons
            name={getStatusIcon(outpass.status)}
            size={20}
            color={getStatusColor(outpass.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(outpass.status) }]}>
            {outpass.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.cardContent}>
        {/* Student Info (warden-specific) */}
        <Text style={styles.studentName}>{outpass.student?.name}</Text>
        <Text style={styles.studentMeta}>
          ID: {outpass.student?.studentId} | Room: {outpass.student?.roomNumber}
        </Text>

        <Text style={styles.purpose}>{outpass.purpose || outpass.reason}</Text>
        <Text style={styles.destination}>{outpass.destination}</Text>

        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.gray[600]} />
            <Text style={styles.timeLabel}>From</Text>
            <Text style={styles.timeValue}>
              {formatDate(outpass.fromDate || outpass.outDate)} at{" "}
              {formatTime(outpass.fromTime || outpass.outDate)}
            </Text>
          </View>

          <View style={styles.timeItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.gray[600]} />
            <Text style={styles.timeLabel}>To</Text>
            <Text style={styles.timeValue}>
              {formatDate(outpass.toDate || outpass.expectedReturnDate)} at{" "}
              {formatTime(outpass.toTime || outpass.expectedReturnDate)}
            </Text>
          </View>
        </View>

        {outpass.remarks && (
          <View style={styles.remarksContainer}>
            <Text style={styles.remarksLabel}>Remarks:</Text>
            <Text style={styles.remarksText}>{outpass.remarks}</Text>
          </View>
        )}
      </View>

      {/* ACTIONS */}
      {canTakeAction && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approve]}
            onPress={() => updateStatus("approved")}
          >
            <Ionicons name="checkmark" size={18} color={COLORS.white} />
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reject]}
            onPress={() => updateStatus("rejected")}
          >
            <Ionicons name="close" size={18} color={COLORS.white} />
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      

      {/* FOOTER */}
      <View style={styles.cardFooter}>
        <Text style={styles.createdAt}>
          Requested on {formatDate(outpass.createdAt)}
        </Text>
      </View>
    </View>
  )
}




const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: SPACING.md,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bold,
    marginLeft: SPACING.xs,
  },
  cardContent: {
    marginBottom: SPACING.md,
  },
  studentName: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
  },
  studentMeta: {
    fontSize: SIZES.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.sm,
  },
  purpose: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
  },
  destination: {
    fontSize: SIZES.md,
    color: COLORS.gray[600],
    marginBottom: SPACING.md,
  },
  timeContainer: {
    marginBottom: SPACING.md,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  timeLabel: {
    fontSize: SIZES.sm,
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
    minWidth: 30,
    color: COLORS.gray[600],
  },
  timeValue: {
    fontSize: SIZES.sm,
    color: COLORS.gray[800],
  },
  remarksContainer: {
    backgroundColor: COLORS.gray[50],
    padding: SPACING.sm,
    borderRadius: 8,
  },
  remarksLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bold,
  },
  remarksText: {
    fontSize: SIZES.sm,
    color: COLORS.gray[600],
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.sm,
    borderRadius: 8,
    flex: 1,
  },
  approve: {
    backgroundColor: COLORS.success,
    marginRight: SPACING.xs,
  },
  reject: {
    backgroundColor: COLORS.error,
    marginLeft: SPACING.xs,
  },
  actionText: {
    color: COLORS.white,
    marginLeft: SPACING.xs,
    fontFamily: FONTS.bold,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.sm,
  },
  createdAt: {
    fontSize: SIZES.xs,
    color: COLORS.gray[500],
  },
})
