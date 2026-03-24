import { AlertTriangle, CheckCircle, Flame, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import type { JobProgress, RoleSpecificStats } from "../backend";
import { useSetJobProgress } from "../hooks/useQueries";

interface FirstResponderMission {
  id: string;
  title: string;
  description: string;
  type: "heal" | "fire" | "rescue" | "assist";
  completed: boolean;
  progress?: number;
  total?: number;
}

interface FirstResponderMissionPanelProps {
  role: "paramedic" | "firefighter";
  rescueCount: number;
  firesSuppressed: number;
  jobProgress: JobProgress | null;
  onMissionComplete?: (missionType: string) => void;
}

const PARAMEDIC_MISSIONS: FirstResponderMission[] = [
  {
    id: "heal1",
    title: "Heal Injured Civilians",
    description: "Use your med kit to heal 3 injured civilians",
    type: "heal",
    completed: false,
    progress: 0,
    total: 3,
  },
  {
    id: "rescue1",
    title: "Emergency Response",
    description: "Respond to an emergency call at the hospital",
    type: "rescue",
    completed: false,
  },
  {
    id: "assist1",
    title: "Medical Assists",
    description: "Provide medical assistance to 5 NPCs",
    type: "assist",
    completed: false,
    progress: 0,
    total: 5,
  },
];

const FIREFIGHTER_MISSIONS: FirstResponderMission[] = [
  {
    id: "fire1",
    title: "Suppress Building Fire",
    description: "Use your extinguisher to suppress 2 fires",
    type: "fire",
    completed: false,
    progress: 0,
    total: 2,
  },
  {
    id: "rescue2",
    title: "Rescue from Fire",
    description: "Rescue a civilian trapped in a burning building",
    type: "rescue",
    completed: false,
  },
  {
    id: "assist2",
    title: "Fire Safety Patrol",
    description: "Inspect 4 buildings for fire hazards",
    type: "assist",
    completed: false,
    progress: 0,
    total: 4,
  },
];

export default function FirstResponderMissionPanel({
  role,
  rescueCount,
  firesSuppressed,
  jobProgress,
  onMissionComplete,
}: FirstResponderMissionPanelProps) {
  const baseMissions =
    role === "paramedic" ? PARAMEDIC_MISSIONS : FIREFIGHTER_MISSIONS;
  const [missions, setMissions] =
    useState<FirstResponderMission[]>(baseMissions);
  const [expanded, setExpanded] = useState(true);
  const setJobProgressMutation = useSetJobProgress();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally omitting stable refs to avoid infinite loops
  useEffect(() => {
    setMissions(
      baseMissions.map((m) => {
        if (role === "paramedic") {
          if (m.type === "heal") {
            const done = rescueCount >= (m.total ?? 3);
            if (done && !m.completed) {
              onMissionComplete?.("heal");
              if (jobProgress) {
                const stats: RoleSpecificStats = {
                  __kind__: "firstResponder",
                  firstResponder: {
                    rescuesPerformed: BigInt(rescueCount),
                    medicalAssists:
                      jobProgress.roleSpecificStats.__kind__ ===
                      "firstResponder"
                        ? jobProgress.roleSpecificStats.firstResponder
                            .medicalAssists
                        : BigInt(0),
                  },
                };
                setJobProgressMutation.mutate({
                  successfulMissions: BigInt(
                    Number(jobProgress.successfulMissions) + 1,
                  ),
                  failedMissions: jobProgress.failedMissions,
                  roleSpecificStats: stats,
                });
              }
            }
            return {
              ...m,
              progress: Math.min(rescueCount, m.total ?? 3),
              completed: done,
            };
          }
          if (m.type === "assist") {
            const done = rescueCount >= (m.total ?? 5);
            return {
              ...m,
              progress: Math.min(rescueCount, m.total ?? 5),
              completed: done,
            };
          }
        } else {
          if (m.type === "fire") {
            const done = firesSuppressed >= (m.total ?? 2);
            if (done && !m.completed) {
              onMissionComplete?.("fire");
              if (jobProgress) {
                const stats: RoleSpecificStats = {
                  __kind__: "firstResponder",
                  firstResponder: {
                    rescuesPerformed:
                      jobProgress.roleSpecificStats.__kind__ ===
                      "firstResponder"
                        ? jobProgress.roleSpecificStats.firstResponder
                            .rescuesPerformed
                        : BigInt(0),
                    medicalAssists: BigInt(firesSuppressed),
                  },
                };
                setJobProgressMutation.mutate({
                  successfulMissions: BigInt(
                    Number(jobProgress.successfulMissions) + 1,
                  ),
                  failedMissions: jobProgress.failedMissions,
                  roleSpecificStats: stats,
                });
              }
            }
            return {
              ...m,
              progress: Math.min(firesSuppressed, m.total ?? 2),
              completed: done,
            };
          }
          if (m.type === "assist") {
            const done = firesSuppressed >= (m.total ?? 4);
            return {
              ...m,
              progress: Math.min(firesSuppressed, m.total ?? 4),
              completed: done,
            };
          }
        }
        return m;
      }),
    );
  }, [rescueCount, firesSuppressed, role]);

  const completedCount = missions.filter((m) => m.completed).length;
  const isParamedic = role === "paramedic";
  const Icon = isParamedic ? Heart : Flame;

  return (
    <div className="w-72 pointer-events-auto">
      <div
        className={`${isParamedic ? "bg-blue-900/90 border-blue-400/50" : "bg-orange-900/90 border-orange-400/50"} border rounded-lg overflow-hidden shadow-xl backdrop-blur-sm cursor-pointer`}
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((prev) => !prev);
        }}
      >
        <div
          className={`flex items-center justify-between px-3 py-2 ${isParamedic ? "bg-blue-800/80" : "bg-orange-800/80"}`}
        >
          <div className="flex items-center gap-2">
            <Icon
              className={`w-4 h-4 ${isParamedic ? "text-blue-300" : "text-orange-300"}`}
            />
            <span
              className={`${isParamedic ? "text-blue-100" : "text-orange-100"} font-bold text-sm`}
            >
              {isParamedic ? "Paramedic Missions" : "Firefighter Missions"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`${isParamedic ? "text-blue-300" : "text-orange-300"} text-xs`}
            >
              {completedCount}/{missions.length}
            </span>
            <span
              className={`${isParamedic ? "text-blue-300" : "text-orange-300"} text-xs`}
            >
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {expanded && (
          <div className="p-2 space-y-2">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className={`rounded p-2 border ${
                  mission.completed
                    ? "bg-green-900/40 border-green-500/40"
                    : isParamedic
                      ? "bg-blue-800/40 border-blue-500/30"
                      : "bg-orange-800/40 border-orange-500/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  {mission.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isParamedic ? "text-yellow-400" : "text-orange-400"}`}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold">
                      {mission.title}
                    </div>
                    <div
                      className={`${isParamedic ? "text-blue-200" : "text-orange-200"} text-xs mt-0.5`}
                    >
                      {mission.description}
                    </div>
                    {mission.total !== undefined && (
                      <div className="mt-1">
                        <div
                          className={`flex justify-between text-xs ${isParamedic ? "text-blue-300" : "text-orange-300"} mb-0.5`}
                        >
                          <span>Progress</span>
                          <span>
                            {mission.progress ?? 0}/{mission.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/60 rounded-full h-1.5">
                          <div
                            className={`${isParamedic ? "bg-blue-400" : "bg-orange-400"} h-1.5 rounded-full transition-all`}
                            style={{
                              width: `${((mission.progress ?? 0) / mission.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
