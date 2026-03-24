import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import React, { useState, useEffect } from "react";
import type { JobProgress, RoleSpecificStats } from "../backend";
import { useSetJobProgress } from "../hooks/useQueries";

interface PoliceMission {
  id: string;
  title: string;
  description: string;
  type: "patrol" | "arrest" | "citation" | "respond";
  completed: boolean;
  progress?: number;
  total?: number;
}

interface PoliceMissionPanelProps {
  arrestCount: number;
  patrolProgress: number;
  jobProgress: JobProgress | null;
  onMissionComplete?: (missionType: string) => void;
}

const MISSIONS: PoliceMission[] = [
  {
    id: "patrol1",
    title: "Complete Patrol Route",
    description: "Visit all 8 patrol checkpoints around Maplewood",
    type: "patrol",
    completed: false,
    progress: 0,
    total: 8,
  },
  {
    id: "arrest1",
    title: "Make an Arrest",
    description: "Handcuff and arrest a suspect in the city",
    type: "arrest",
    completed: false,
    progress: 0,
    total: 1,
  },
  {
    id: "respond1",
    title: "Respond to Robbery",
    description: "Respond to the reported robbery at the shopping district",
    type: "respond",
    completed: false,
  },
  {
    id: "citation1",
    title: "Issue Citations",
    description: "Issue 3 traffic citations to speeding drivers",
    type: "citation",
    completed: false,
    progress: 0,
    total: 3,
  },
];

export default function PoliceMissionPanel({
  arrestCount,
  patrolProgress,
  jobProgress,
  onMissionComplete,
}: PoliceMissionPanelProps) {
  const [missions, setMissions] = useState<PoliceMission[]>(MISSIONS);
  const [expanded, setExpanded] = useState(true);
  const setJobProgressMutation = useSetJobProgress();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally omitting stable refs to avoid infinite loops
  useEffect(() => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.type === "arrest") {
          const done = arrestCount >= (m.total ?? 1);
          if (done && !m.completed) {
            onMissionComplete?.("arrest");
            if (jobProgress) {
              const stats: RoleSpecificStats = {
                __kind__: "policeOfficer",
                policeOfficer: {
                  arrestsMade: BigInt(arrestCount),
                  finesIssued:
                    jobProgress.roleSpecificStats.__kind__ === "policeOfficer"
                      ? jobProgress.roleSpecificStats.policeOfficer.finesIssued
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
            progress: Math.min(arrestCount, m.total ?? 1),
            completed: done,
          };
        }
        if (m.type === "patrol") {
          const done = patrolProgress >= (m.total ?? 8);
          if (done && !m.completed) onMissionComplete?.("patrol");
          return {
            ...m,
            progress: Math.min(patrolProgress, m.total ?? 8),
            completed: done,
          };
        }
        return m;
      }),
    );
  }, [arrestCount, patrolProgress]);

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="w-72 pointer-events-auto">
      <div
        className="bg-blue-900/90 border border-blue-400/50 rounded-lg overflow-hidden shadow-xl backdrop-blur-sm cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((e) => !e);
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-blue-800/80">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-300" />
            <span className="text-blue-100 font-bold text-sm">
              Police Missions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-300 text-xs">
              {completedCount}/{missions.length}
            </span>
            <span className="text-blue-300 text-xs">
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
                    : "bg-blue-800/40 border-blue-500/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  {mission.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold">
                      {mission.title}
                    </div>
                    <div className="text-blue-200 text-xs mt-0.5">
                      {mission.description}
                    </div>
                    {mission.total !== undefined && (
                      <div className="mt-1">
                        <div className="flex justify-between text-xs text-blue-300 mb-0.5">
                          <span>Progress</span>
                          <span>
                            {mission.progress ?? 0}/{mission.total}
                          </span>
                        </div>
                        <div className="w-full bg-blue-900/60 rounded-full h-1.5">
                          <div
                            className="bg-blue-400 h-1.5 rounded-full transition-all"
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
