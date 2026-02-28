import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type PlayerId = Text;

  public type GameJob = {
    #policeOfficer;
    #swat;
    #dealershipWorker;
    #firstResponder;
    #unemployed;
  };

  public type UserProfile = {
    name : Text;
    currentJob : GameJob;
    avatarUrl : ?Text;
    homeOwnership : ?Home;
    relationships : [Relationship];
  };

  public type PlayerProfile = {
    id : PlayerId;
    name : Text;
    currentJob : GameJob;
    avatarUrl : ?Text;
    homeOwnership : ?Home;
    relationships : [Relationship];
  };

  public type Home = {
    address : Text;
    rooms : Nat;
    garageSpaces : Nat;
    customizationLevel : Nat;
  };

  public type Relationship = {
    name : Text;
    relationType : { #family; #friend };
  };

  public type Settings = {
    violenceToggle : Bool;
    cameraMode : { #firstPerson; #thirdPerson };
    graphicsQuality : { #low; #medium; #high };
    chatEnabled : Bool;
    controlScheme : Text;
  };

  public type VoiceChatStatus = {
    #connected;
    #disconnected;
  };

  let playerProfiles = Map.empty<PlayerId, PlayerProfile>();
  let playerFriends = Map.empty<PlayerId, Set.Set<PlayerId>>();
  let playerSettings = Map.empty<PlayerId, Settings>();

  // Required by instructions: get caller's own UserProfile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    let callerId = caller.toText();
    switch (playerProfiles.get(callerId)) {
      case (null) { null };
      case (?profile) {
        ?{
          name = profile.name;
          currentJob = profile.currentJob;
          avatarUrl = profile.avatarUrl;
          homeOwnership = profile.homeOwnership;
          relationships = profile.relationships;
        };
      };
    };
  };

  // Required by instructions: save caller's own UserProfile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    let callerId = caller.toText();
    let playerProfile = {
      id = callerId;
      name = profile.name;
      currentJob = profile.currentJob;
      avatarUrl = profile.avatarUrl;
      homeOwnership = profile.homeOwnership;
      relationships = profile.relationships;
    };
    playerProfiles.add(callerId, playerProfile);
  };

  // Required by instructions: get another user's profile (caller can view own; admin can view any)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    let userId = user.toText();
    switch (playerProfiles.get(userId)) {
      case (null) { null };
      case (?profile) {
        ?{
          name = profile.name;
          currentJob = profile.currentJob;
          avatarUrl = profile.avatarUrl;
          homeOwnership = profile.homeOwnership;
          relationships = profile.relationships;
        };
      };
    };
  };

  // Create a profile for the caller
  public shared ({ caller }) func createProfile(name : Text, job : GameJob) : async ?PlayerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let id = caller.toText();
    let profile = {
      id;
      name;
      currentJob = job;
      avatarUrl = null;
      homeOwnership = null;
      relationships = [];
    };
    playerProfiles.add(id, profile);
    ?profile;
  };

  // Get any player's profile by id (public social feature)
  public query func getProfile(targetId : Text) : async ?PlayerProfile {
    playerProfiles.get(targetId);
  };

  // Add a friend (authenticated users only)
  public shared ({ caller }) func addFriend(friendId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add friends");
    };
    let callerId = caller.toText();
    switch (playerProfiles.get(callerId)) {
      case (null) { false };
      case (?_) {
        let currentFriends = switch (playerFriends.get(callerId)) {
          case (null) { Set.empty<PlayerId>() };
          case (?friends) { friends };
        };
        currentFriends.add(friendId);
        playerFriends.add(callerId, currentFriends);
        true;
      };
    };
  };

  // Remove a friend (authenticated users only)
  public shared ({ caller }) func removeFriend(friendId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove friends");
    };
    let callerId = caller.toText();
    switch (playerFriends.get(callerId)) {
      case (null) { false };
      case (?friends) {
        friends.remove(friendId);
        playerFriends.add(callerId, friends);
        true;
      };
    };
  };

  // Update settings (authenticated users only, own settings)
  public shared ({ caller }) func updateSettings(newSettings : Settings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update settings");
    };
    let callerId = caller.toText();
    if (not playerProfiles.containsKey(callerId)) {
      Runtime.trap("Player profile does not exist");
    };
    playerSettings.add(callerId, newSettings);
  };

  // Get own settings (authenticated users only)
  public query ({ caller }) func getSettings() : async Settings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get settings");
    };
    let callerId = caller.toText();
    switch (playerSettings.get(callerId)) {
      case (null) {
        {
          violenceToggle = true;
          cameraMode = #thirdPerson;
          graphicsQuality = #medium;
          chatEnabled = true;
          controlScheme = "default";
        };
      };
      case (?settings) { settings };
    };
  };

  // Purchase a home (authenticated users only)
  public shared ({ caller }) func purchaseHome(address : Text, rooms : Nat, garageSpaces : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase homes");
    };
    let callerId = caller.toText();
    switch (playerProfiles.get(callerId)) {
      case (null) { Runtime.trap("Player profile does not exist") };
      case (?profile) {
        let home = {
          address;
          rooms;
          garageSpaces;
          customizationLevel = 0;
        };
        let updatedProfile = {
          id = profile.id;
          name = profile.name;
          currentJob = profile.currentJob;
          avatarUrl = profile.avatarUrl;
          homeOwnership = ?home;
          relationships = profile.relationships;
        };
        playerProfiles.add(callerId, updatedProfile);
      };
    };
  };

  // Update avatar (authenticated users only)
  public shared ({ caller }) func updateAvatar(avatarUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their avatar");
    };
    let callerId = caller.toText();
    switch (playerProfiles.get(callerId)) {
      case (null) { Runtime.trap("Player profile does not exist") };
      case (?profile) {
        let updatedProfile = {
          id = profile.id;
          name = profile.name;
          currentJob = profile.currentJob;
          avatarUrl = ?avatarUrl;
          homeOwnership = profile.homeOwnership;
          relationships = profile.relationships;
        };
        playerProfiles.add(callerId, updatedProfile);
      };
    };
  };

  // Update job (authenticated users only)
  public shared ({ caller }) func updateJob(newJob : GameJob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their job");
    };
    let callerId = caller.toText();
    switch (playerProfiles.get(callerId)) {
      case (null) { Runtime.trap("Player profile does not exist") };
      case (?profile) {
        let updatedProfile = {
          id = profile.id;
          name = profile.name;
          currentJob = newJob;
          avatarUrl = profile.avatarUrl;
          homeOwnership = profile.homeOwnership;
          relationships = profile.relationships;
        };
        playerProfiles.add(callerId, updatedProfile);
      };
    };
  };

  // Get friends list (public social feature - anyone can view)
  public query func getFriendsList(targetId : Text) : async [Text] {
    switch (playerFriends.get(targetId)) {
      case (null) { [] };
      case (?friends) {
        friends.toArray();
      };
    };
  };

  // Add a relationship (authenticated users only)
  public shared ({ caller }) func addRelationship(name : Text, relationType : { #family; #friend }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add relationships");
    };
    let callerId = caller.toText();
    switch (playerProfiles.get(callerId)) {
      case (null) { Runtime.trap("Player profile does not exist") };
      case (?profile) {
        let newRelationship = {
          name;
          relationType;
        };
        let updatedRelationships = profile.relationships.concat([newRelationship]);
        let updatedProfile = {
          id = profile.id;
          name = profile.name;
          currentJob = profile.currentJob;
          avatarUrl = profile.avatarUrl;
          homeOwnership = profile.homeOwnership;
          relationships = updatedRelationships;
        };
        playerProfiles.add(callerId, updatedProfile);
      };
    };
  };

  // Search profiles (public social feature - anyone can search)
  public query func getSearchableProfiles(searchTerm : Text) : async [PlayerProfile] {
    let profilesArray = playerProfiles.values().toArray();
    let filtered = profilesArray.filter(
      func(p : PlayerProfile) : Bool {
        p.name.contains(#text searchTerm) or p.id.contains(#text searchTerm);
      }
    );
    filtered.sort(
      func(a : PlayerProfile, b : PlayerProfile) : Order.Order {
        let nameComparison = Text.compare(a.name, b.name);
        switch (nameComparison) {
          case (#equal) { Text.compare(a.id, b.id) };
          case (order) { order };
        };
      }
    );
  };

  // Customize home (authenticated users only)
  public shared ({ caller }) func customizeHome(customizationLevel : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can customize their home");
    };
    let callerId = caller.toText();
    switch (playerProfiles.get(callerId)) {
      case (null) { Runtime.trap("Player profile does not exist") };
      case (?profile) {
        switch (profile.homeOwnership) {
          case (null) { Runtime.trap("No home owned") };
          case (?home) {
            let updatedHome = {
              address = home.address;
              rooms = home.rooms;
              garageSpaces = home.garageSpaces;
              customizationLevel;
            };
            let updatedProfile = {
              id = profile.id;
              name = profile.name;
              currentJob = profile.currentJob;
              avatarUrl = profile.avatarUrl;
              homeOwnership = ?updatedHome;
              relationships = profile.relationships;
            };
            playerProfiles.add(callerId, updatedProfile);
          };
        };
      };
    };
  };
};
