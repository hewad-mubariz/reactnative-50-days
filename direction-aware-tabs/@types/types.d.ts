export enum MaterialType {
  RAINBOW = "RAINBOW",
  CARBON_FIBER = "CARBON_FIBER",
  PURPLE_BLUE = "PURPLE_BLUE",
  GRAY = "GRAY",
  BLUE = "BLUE",
}

export enum AppStickerType {
  HODL = "HODL",
  SCOOP = "SCOOP",
  YOLO = "YOLO",
}

export interface AppScoopWebsocketData {
  userDisplayName: string;
  userUsername: string;
  userAppUserId: number;
  userProfilePic: string;
  userFid: number | null;
  collectible: DetailedAppCollectible;
  priceOrProfit: number;
  txType: AppTransactionType;
  timestamp: string;
  message: string;
}

export interface AppUserInvite {
  fid: number;
  fcDisplayName: string;
  fcUsername: string;
  profilePic: string;
  numInvites: number;
}

export interface AppOwnerInfo {
  followingCount: number;
  followerCount: number;
  fcUsername: string;
  fcDisplayName: string;
  pfp: string;
  id: number;
}

export interface InitialAppUser {
  id: number;
  fid: number;
  initialPhaseScore: number;
  initialPhaseScoreRank: number;
  initialDeposit: number;
  fcUsername: string;
  fcDisplayName: string;
  profilePic: string;
  cohortSlot: number;
}

export interface AppBoostedCast {
  url: string;
  authorUsername: string;
  timestamp: string;
  authorDisplayName: string;
  authorPfp: string;
  likeCount: number;
  recastCount: number;
  text: string;
  embeds: EmbedURL[];
  viewerContext: {
    isLiked: boolean;
    isRecasted: boolean;
  };
}

export enum AppNotificationType {
  NEW_BUYER_STICKER = "NEW_BUYER_STICKER",
  REWARDS_READY = "REWARDS_READY",
  ASSET_MOVE = "ASSET_MOVE",
}

export enum AppTransactionType {
  BUY = "BUY",
  SELL = "SELL",
}

export interface AppProfileScoopData {
  userDisplayName: string;
  userUsername: string;
  userAppUserId: number;
  userProfilePic: string;
  userFid: number | null;
  numCards: number;
  collectibleFid: number;
  collectibleUsername: string;
  priceOrProfit: number;
  txType: AppTransactionType;
  timestamp: string;
  message: string;
}

export interface AssetMovementData {
  collectibleFid: number;
  currentCardPrice: number;
  fcUsername: string;
  fcDisplayName: string;
  collectibleImgURL: string;
  followingCount: number;
  followerCount: number;
  signature?: {
    text: string;
    font: string;
  };
  volume: number;
  totalSupply: number;
  material: MaterialType;
  stickers: Stickers;
  assetMovePercentChange: number;
  assetMoveDirection: "UP" | "DOWN";
}

export interface AppNotificationData {
  //fcDisplayName and profilePic would be of the person who scooped the profile
  collectibleTxData?: AppLastScooperNotification;
  assetMovementData?: AssetMovementData;
}

export interface AppNotification {
  id: number;
  forAppUserId: number;
  fromAppUserId?: number;
  fromAppUserFid?: number;
  fcDisplayName: string;
  profilePic: string;
  isRead: boolean;
  timestamp: string; //Unix timestamp in milliseconds as a string
  type: AppNotificationType;
  data: AppNotificationData;
}

export interface AppUserInfo {
  id: number;
  fid: number | null;
  profilePic: string;
  fcDisplayName: string;
  fcUsername: string;
  runningProfit: number;
  totalRewardsEarned: number;
  totalRewardsEarnedRank: number;
  numOwnedCollectibles: number | null;
}

export interface DetailedAppUserInfo {
  appUserId: number;
  profilePic: string;
  fcDisplayName: string;
  fcUsername: string;
  bio: string;
  followingCount: number;
  followersCount: number;
  runningProfit: number;
  totalRewardsEarned: number;
  totalRewardsEarnedRank: number;
  powerBadge: boolean;
  followedByMutualsTopThree: {
    profilePic: string;
    name: string;
  }[];
  followedByMutualsCount: number;
  followsViewer: boolean;
}

export interface AppFCExpandedUserInfo {
  followedByMutualsTopThree: {
    profilePic: string;
    name: string;
  }[];
  followedByMutualsCount: number;
}

export interface AppCollectible {
  ofFid: number;
  fcUsername: string;
  fcDisplayName: string;
  collectibleImgURL: string;
  currentCardPrice: number;
  currentCardPriceRank: number;
  followingCount: number;
  followerCount: number;
  signature?: {
    text: string;
    font: string;
  };
  volume: number;
  lastDayVolume: number;
  totalSupply: number;
  material: MaterialType;
  stickers: Stickers;
  marketCap: number;
  lastEngagementScore: number;
  numCardsHeldByUser?: number;
}

export interface CollectibleStat {
  id: number;
  collectibleFid: number;
  date: BigInt; //unix timestamp in ms
  followers: number;
  engagementScore: number;
  price: number;
  casts: number;
  payout: number;
}

export interface DetailedAppCollectible {
  ofFid: number;
  fcUsername: string;
  fcDisplayName: string;
  collectibleImgURL: string;
  currentCardPrice: number;
  currentCardPriceRank: number;
  topHolder: {
    fcDisplayName: string;
    fcUsername: string; // should default to username or address/bot-generated id?
    pfp: string; // 2 edge cases besides a farcaster profile's pic
    // 1. initial owner of the community pool
    // 2. some default bot image
    id: number; // app user id
  };
  material: MaterialType;
  stickers: Stickers;
  followingCount: number;
  lastEngagementScore: number;
  followerCount: number;
  signature?: {
    text: string;
    font: string;
  };
  volume: number;
  lastDayVolume: number;
  marketCap: number;
  totalSupply: number;
  isMinted: boolean;
  numHolders?: number;
  collectibleStats?: CollectibleStat[];
}
