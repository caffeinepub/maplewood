import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Relationship {
    relationType: Variant_friend_family;
    name: string;
}
export interface Settings {
    violenceToggle: boolean;
    chatEnabled: boolean;
    graphicsQuality: Variant_low_high_medium;
    cameraMode: Variant_firstPerson_thirdPerson;
    controlScheme: string;
}
export type PlayerId = string;
export interface JobProgress {
    failedMissions: bigint;
    successfulMissions: bigint;
    roleSpecificStats: RoleSpecificStats;
}
export interface PlayerProfile {
    id: PlayerId;
    name: string;
    homeOwnership?: Home;
    avatarUrl?: string;
    relationships: Array<Relationship>;
    currentJob: GameJob;
}
export type RoleSpecificStats = {
    __kind__: "policeOfficer";
    policeOfficer: {
        arrestsMade: bigint;
        finesIssued: bigint;
    };
} | {
    __kind__: "firstResponder";
    firstResponder: {
        rescuesPerformed: bigint;
        medicalAssists: bigint;
    };
} | {
    __kind__: "swat";
    swat: {
        operationsCompleted: bigint;
        hostageRescues: bigint;
    };
} | {
    __kind__: "dealershipWorker";
    dealershipWorker: {
        vehiclesSold: bigint;
    };
};
export interface Home {
    garageSpaces: bigint;
    customizationLevel: bigint;
    address: string;
    rooms: bigint;
}
export interface UserProfile {
    name: string;
    homeOwnership?: Home;
    avatarUrl?: string;
    relationships: Array<Relationship>;
    currentJob: GameJob;
}
export enum GameJob {
    policeOfficer = "policeOfficer",
    unemployed = "unemployed",
    firstResponder = "firstResponder",
    swat = "swat",
    dealershipWorker = "dealershipWorker"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_firstPerson_thirdPerson {
    firstPerson = "firstPerson",
    thirdPerson = "thirdPerson"
}
export enum Variant_friend_family {
    friend = "friend",
    family = "family"
}
export enum Variant_low_high_medium {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    addFriend(friendId: string): Promise<boolean>;
    addRelationship(name: string, relationType: Variant_friend_family): Promise<void>;
    adminResetJobProgress(targetUser: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProfile(name: string, job: GameJob): Promise<PlayerProfile | null>;
    customizeHome(customizationLevel: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFriendsList(targetId: string): Promise<Array<string>>;
    /**
     * /   Role Progress   ///
     */
    getJobProgress(): Promise<JobProgress>;
    getProfile(targetId: string): Promise<PlayerProfile | null>;
    getSearchableProfiles(searchTerm: string): Promise<Array<PlayerProfile>>;
    getSettings(): Promise<Settings>;
    getUserJobProgress(user: Principal): Promise<JobProgress | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    purchaseHome(address: string, rooms: bigint, garageSpaces: bigint): Promise<void>;
    removeFriend(friendId: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setJobProgress(newProgress: JobProgress): Promise<void>;
    updateAvatar(avatarUrl: string): Promise<void>;
    updateJob(newJob: GameJob): Promise<void>;
    updateSettings(newSettings: Settings): Promise<void>;
}
