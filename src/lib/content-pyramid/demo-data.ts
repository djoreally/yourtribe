export type DemoPlatform = "instagram" | "tiktok" | "facebook" | "gmb" | "youtube";
export type DemoAssetStatus = "pending" | "approved" | "scheduled" | "rejected";

export interface DemoTenant {
  id: string;
  name: string;
  slug: string;
  logoInitials: string;
  primaryColor: string;
  accentColor: string;
  welcomeMessage: string;
  uploadLimitMb: number;
  uploadLimitSeconds: number;
  collectiveEnabled: boolean;
  collectiveName?: string;
}

export interface DemoAsset {
  id: string;
  patronHandle: string;
  caption: string;
  mediaType: "image" | "video";
  image: string;
  status: DemoAssetStatus;
  createdAt: string;
  selectedPlatforms: DemoPlatform[];
}

export const demoTenant: DemoTenant = {
  id: "demo-ambler",
  name: "Ambler Brewing Co.",
  slug: "ambler-brewing",
  logoInitials: "AB",
  primaryColor: "#163B33",
  accentColor: "#D9FF5A",
  welcomeMessage: "Upload your moment. Get featured on our official feeds.",
  uploadLimitMb: 100,
  uploadLimitSeconds: 60,
  collectiveEnabled: true,
  collectiveName: "Ambler Local",
};

export const demoAssets: DemoAsset[] = [
  {
    id: "asset-128",
    patronHandle: "@johnny_eats",
    caption: "Friday night taps and the smash burger of the summer.",
    mediaType: "video",
    image: "/content-pyramid/taps-night.jpg",
    status: "pending",
    createdAt: "4 min ago",
    selectedPlatforms: ["instagram", "tiktok", "gmb"],
  },
  {
    id: "asset-127",
    patronHandle: "@maria.makes.moves",
    caption: "The patio is the move tonight. Great beer, even better company.",
    mediaType: "image",
    image: "/content-pyramid/patio-moment.jpg",
    status: "pending",
    createdAt: "18 min ago",
    selectedPlatforms: ["instagram", "facebook", "gmb"],
  },
  {
    id: "asset-126",
    patronHandle: "@montco.weekends",
    caption: "A perfect pour after a long week.",
    mediaType: "video",
    image: "/content-pyramid/perfect-pour.jpg",
    status: "scheduled",
    createdAt: "1 hr ago",
    selectedPlatforms: ["instagram", "tiktok", "youtube"],
  },
];

export const platformLabels: Record<DemoPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  gmb: "Google Business",
  youtube: "YouTube Shorts",
};

export const platformShortLabels: Record<DemoPlatform, string> = {
  instagram: "IG",
  tiktok: "TT",
  facebook: "FB",
  gmb: "GB",
  youtube: "YT",
};
