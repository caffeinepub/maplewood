import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Settings, GameJob, Variant_friend_family, PlayerProfile } from '../backend';
import { Variant_firstPerson_thirdPerson, Variant_low_high_medium } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, job }: { name: string; job: GameJob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProfile(name, job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetSettings() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile } = useGetCallerUserProfile();

  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSettings();
    },
    enabled: !!actor && !actorFetching && !!profile,
    retry: false,
  });
}

export function useUpdateSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Settings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: GameJob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJob(job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function usePurchaseHome() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address, rooms, garageSpaces }: { address: string; rooms: bigint; garageSpaces: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.purchaseHome(address, rooms, garageSpaces);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCustomizeHome() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (level: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.customizeHome(level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAddFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFriend(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });
}

export function useRemoveFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFriend(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });
}

export function useGetFriendsList(targetId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['friends', targetId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFriendsList(targetId);
    },
    enabled: !!actor && !actorFetching && !!targetId,
  });
}

export function useSearchProfiles(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PlayerProfile[]>({
    queryKey: ['searchProfiles', searchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSearchableProfiles(searchTerm);
    },
    enabled: !!actor && !actorFetching && searchTerm.length >= 2,
  });
}

export function useAddRelationship() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, relationType }: { name: string; relationType: Variant_friend_family }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRelationship(name, relationType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateAvatar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarUrl: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAvatar(avatarUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetProfile(targetId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PlayerProfile | null>({
    queryKey: ['profile', targetId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProfile(targetId);
    },
    enabled: !!actor && !actorFetching && !!targetId,
  });
}

export function useDefaultSettings(): Settings {
  return {
    violenceToggle: true,
    cameraMode: Variant_firstPerson_thirdPerson.thirdPerson,
    graphicsQuality: Variant_low_high_medium.medium,
    chatEnabled: true,
    controlScheme: 'default',
  };
}
