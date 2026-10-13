import { ScamCategory } from './index';

export type RegionCode = 'US' | 'UK' | 'IN' | 'AU' | 'CA' | 'EU' | 'GLOBAL';

export interface RegionalScamAlert {
  id: string;
  region: RegionCode;
  regionName: string;
  flag: string;
  title: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  timestamp: string;
  category: ScamCategory;
  victimsReportedCount: number;
  description: string;
  targetAudience: string; // e.g. "Elders & Parents", "Remote Job Seekers", "Online Sellers"
  preventionAdvice: string;
  exampleSnippet: string;
  reportedByAgency: string;
  isVerified: boolean;
  isRead?: boolean;
}

export interface RegionInfo {
  code: RegionCode;
  name: string;
  flag: string;
  primaryAgency: string;
  activeOutbreakCount: number;
  defaultHelpline: string;
}

export interface NotificationSettings {
  enabled: boolean;
  permission: NotificationPermission;
  sound: boolean;
  selectedRegion: RegionCode;
  criticalOnly: boolean;
  lastCheckedTime?: string;
}
