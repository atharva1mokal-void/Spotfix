import { differenceInHours, differenceInMinutes, addDays } from "date-fns";

/**
 * Severity-based deadline allocation:
 * - Low (Green) = 4 days
 * - Medium (Yellow) = 3 days
 * - High (Red) = 2 days
 */
export const DEADLINE_DAYS: Record<string, number> = {
  low: 4,
  medium: 3,
  high: 2,
};

export interface DeadlineInfo {
  deadlineDate: Date;
  hoursLeft: number;
  minutesLeft: number;
  totalDays: number;
  isOverdue: boolean;
  isResolved: boolean;
  label: string;
  urgency: "safe" | "warning" | "critical" | "overdue" | "resolved";
  color: string;
  bgColor: string;
  percentage: number; // 0 to 100, how much time has elapsed
}

export function getDeadlineInfo(
  reportedAt: Date | string,
  priority: string,
  status: string
): DeadlineInfo {
  const totalDays = DEADLINE_DAYS[priority] || 3;
  const reportDate = new Date(reportedAt);
  const deadlineDate = addDays(reportDate, totalDays);
  const now = new Date();

  const isResolved = status === "resolved";
  const hoursLeft = differenceInHours(deadlineDate, now);
  const minutesLeft = differenceInMinutes(deadlineDate, now) % 60;
  const isOverdue = hoursLeft <= 0 && !isResolved;

  // Calculate percentage of time elapsed
  const totalMs = deadlineDate.getTime() - reportDate.getTime();
  const elapsedMs = now.getTime() - reportDate.getTime();
  const percentage = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  let urgency: DeadlineInfo["urgency"];
  let label: string;
  let color: string;
  let bgColor: string;

  if (isResolved) {
    urgency = "resolved";
    label = "Resolved";
    color = "#138808";
    bgColor = "rgba(19, 136, 8, 0.08)";
  } else if (isOverdue) {
    urgency = "overdue";
    label = "Overdue";
    color = "#DC143C";
    bgColor = "rgba(220, 20, 60, 0.08)";
  } else if (hoursLeft <= 12) {
    urgency = "critical";
    const hrs = Math.max(0, hoursLeft);
    const mins = Math.max(0, minutesLeft);
    label = `${hrs}h ${mins}m left`;
    color = "#DC143C";
    bgColor = "rgba(220, 20, 60, 0.08)";
  } else if (hoursLeft <= 48) {
    urgency = "warning";
    const daysLeft = Math.floor(hoursLeft / 24);
    const hrsRemainder = hoursLeft % 24;
    label = daysLeft > 0 ? `${daysLeft}d ${hrsRemainder}h left` : `${hoursLeft}h left`;
    color = "#FF9933";
    bgColor = "rgba(255, 153, 51, 0.08)";
  } else {
    urgency = "safe";
    const daysLeft = Math.floor(hoursLeft / 24);
    const hrsRemainder = hoursLeft % 24;
    label = `${daysLeft}d ${hrsRemainder}h left`;
    color = "#138808";
    bgColor = "rgba(19, 136, 8, 0.08)";
  }

  return {
    deadlineDate,
    hoursLeft: Math.max(0, hoursLeft),
    minutesLeft: Math.max(0, minutesLeft),
    totalDays,
    isOverdue,
    isResolved,
    label,
    urgency,
    color,
    bgColor,
    percentage,
  };
}
