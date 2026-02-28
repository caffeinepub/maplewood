import { useState } from 'react';
import { X, Briefcase, Shield, Car, Ambulance, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpdateJob, useGetCallerUserProfile } from '../hooks/useQueries';
import { GameJob } from '../backend';
import { toast } from 'sonner';

interface JobBoardProps {
  onClose: () => void;
}

const JOBS = [
  {
    id: GameJob.unemployed,
    title: 'Unemployed',
    description: 'Free to roam Maplewood without responsibilities.',
    icon: '🏠',
    salary: '$0/hr',
    color: 'text-muted-foreground',
  },
  {
    id: GameJob.policeOfficer,
    title: 'Police Officer',
    description: 'Patrol the streets of Maplewood, respond to crimes, and keep the peace.',
    icon: '👮',
    salary: '$25/hr',
    color: 'text-blue-400',
  },
  {
    id: GameJob.swat,
    title: 'SWAT Team',
    description: 'Elite tactical unit. Respond to high-threat situations and armed standoffs.',
    icon: '🛡️',
    salary: '$40/hr',
    color: 'text-red-400',
  },
  {
    id: GameJob.firstResponder,
    title: 'First Responder',
    description: 'Paramedic/firefighter. Respond to medical emergencies and fires across the city.',
    icon: '🚑',
    salary: '$30/hr',
    color: 'text-green-400',
  },
  {
    id: GameJob.dealershipWorker,
    title: 'Dealership Worker',
    description: 'Work at Maplewood Auto. Sell cars, conduct test drives, and earn commissions.',
    icon: '🚗',
    salary: '$20/hr + commission',
    color: 'text-yellow-400',
  },
];

export default function JobBoard({ onClose }: JobBoardProps) {
  const { data: profile } = useGetCallerUserProfile();
  const { mutate: updateJob, isPending } = useUpdateJob();
  const [selectedJob, setSelectedJob] = useState<GameJob | null>(null);

  const currentJob = profile?.currentJob;

  const handleApply = (jobId: GameJob) => {
    setSelectedJob(jobId);
    updateJob(jobId, {
      onSuccess: () => {
        toast.success(`You are now a ${JOBS.find((j) => j.id === jobId)?.title}!`);
        onClose();
      },
      onError: () => toast.error('Failed to update job'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="panel-dark rounded-lg w-full max-w-lg mx-4 border border-neon-orange/30 animate-slide-in max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-neon-orange" />
            <h2 className="font-gaming text-neon-orange text-lg tracking-wider">JOB BOARD</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto scrollbar-gaming space-y-3 flex-1">
          {JOBS.map((job) => {
            const isCurrent = currentJob === job.id;
            return (
              <div
                key={job.id}
                className={`p-4 rounded-lg border transition-all ${
                  isCurrent
                    ? 'border-neon-orange/60 bg-neon-orange/5'
                    : 'border-border bg-muted/20 hover:border-neon-orange/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{job.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-gaming text-sm ${job.color}`}>{job.title}</h3>
                        {isCurrent && (
                          <CheckCircle className="w-4 h-4 text-neon-orange" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{job.description}</p>
                      <p className="text-xs text-neon-yellow mt-1 font-medium">{job.salary}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleApply(job.id)}
                    disabled={isCurrent || isPending}
                    className={`flex-shrink-0 font-gaming text-xs ${
                      isCurrent ? 'opacity-50' : 'btn-neon'
                    }`}
                  >
                    {isPending && selectedJob === job.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : isCurrent ? 'CURRENT' : 'APPLY'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
