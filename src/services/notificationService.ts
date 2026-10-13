import { RegionalScamAlert, RegionCode, NotificationSettings } from '../types/notifications';
import { REGIONS, INITIAL_REGIONAL_TRENDS } from '../data/regionalTrends';

const SETTINGS_KEY = 'scamguard_notif_settings_v1';
const ALERTS_HISTORY_KEY = 'scamguard_notif_alerts_v1';

// Web Audio synthesizer chime for alerts
function playAlertChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First high tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.15);

    // Second alert tone
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
      gain2.gain.setValueAtTime(0.2, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.25);
    }, 120);
  } catch {
    // Audio context not allowed or blocked by autoplay
  }
}

// Auto detect region from system timezone
export function detectUserRegion(): RegionCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('London') || tz.includes('Belfast')) return 'UK';
    if (tz.includes('America') || tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles')) {
      if (tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Edmonton') || tz.includes('Montreal')) return 'CA';
      return 'US';
    }
    if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('Asia/Colombo')) return 'IN';
    if (tz.includes('Australia') || tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Perth')) return 'AU';
    if (tz.includes('Europe') || tz.includes('Paris') || tz.includes('Berlin') || tz.includes('Madrid') || tz.includes('Rome')) return 'EU';
  } catch {}
  return 'US';
}

export class NotificationService {
  private static instance: NotificationService;

  private settings: NotificationSettings = {
    enabled: true,
    permission: 'default',
    sound: true,
    selectedRegion: 'US',
    criticalOnly: false,
  };

  private listeners: ((alerts: RegionalScamAlert[]) => void)[] = [];
  private alerts: RegionalScamAlert[] = [];

  private constructor() {
    this.loadSettings();
    this.loadAlerts();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        this.settings = JSON.parse(saved);
      } else {
        this.settings.selectedRegion = detectUserRegion();
      }
    } catch {
      this.settings.selectedRegion = 'US';
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.settings.permission = Notification.permission;
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {}
  }

  private loadAlerts() {
    try {
      const saved = localStorage.getItem(ALERTS_HISTORY_KEY);
      if (saved) {
        this.alerts = JSON.parse(saved);
        return;
      }
    } catch {}

    // Initialize with verified regional seed trends
    this.alerts = [...INITIAL_REGIONAL_TRENDS];
    this.saveAlerts();
  }

  private saveAlerts() {
    try {
      localStorage.setItem(ALERTS_HISTORY_KEY, JSON.stringify(this.alerts));
    } catch {}
    this.notifyListeners();
  }

  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...partial };
    this.saveSettings();
  }

  public getAlertsForRegion(region: RegionCode): RegionalScamAlert[] {
    if (region === 'GLOBAL') {
      return this.alerts;
    }
    return this.alerts.filter((a) => a.region === region || a.region === 'GLOBAL');
  }

  public getAllAlerts(): RegionalScamAlert[] {
    return this.alerts;
  }

  public getUnreadCount(region: RegionCode): number {
    const list = this.getAlertsForRegion(region);
    return list.filter((a) => !a.isRead).length;
  }

  public markAsRead(alertId: string) {
    this.alerts = this.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
    this.saveAlerts();
  }

  public markAllAsRead(region: RegionCode) {
    this.alerts = this.alerts.map((a) => {
      if (region === 'GLOBAL' || a.region === region) {
        return { ...a, isRead: true };
      }
      return a;
    });
    this.saveAlerts();
  }

  // Request browser notification permission
  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.');
      return 'denied';
    }

    try {
      const perm = await Notification.requestPermission();
      this.settings.permission = perm;
      this.settings.enabled = perm === 'granted';
      this.saveSettings();
      return perm;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied';
    }
  }

  // Deliver real-time push notification
  public deliverNotification(alert: RegionalScamAlert): boolean {
    if (this.settings.sound) {
      playAlertChime();
    }

    // Attempt native browser notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(`⚠️ Scam Alert: ${alert.title}`, {
          body: `[${alert.flag} ${alert.regionName}] ${alert.threatLevel} THREAT: ${alert.description.slice(0, 110)}... Reported by ${alert.reportedByAgency}.`,
          icon: '/pwa-192x192.png',
          badge: '/icon.svg',
          tag: alert.id,
          requireInteraction: alert.threatLevel === 'CRITICAL',
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        return true;
      } catch (e) {
        console.warn('Native notification failed, falling back to in-app toast:', e);
      }
    }

    return false;
  }

  // Send a test regional push notification
  public sendTestAlert(region: RegionCode): RegionalScamAlert {
    const regionInfo = REGIONS[region] || REGIONS.US;
    const testAlert: RegionalScamAlert = {
      id: `test-alert-${Date.now()}`,
      region,
      regionName: regionInfo.name,
      flag: regionInfo.flag,
      title: `Verified Outbreak: Fake ${regionInfo.name} Tax & Bank SMS Impersonation`,
      threatLevel: 'CRITICAL',
      timestamp: 'Just now',
      category: 'whatsapp_sms',
      victimsReportedCount: 1540,
      targetAudience: 'Cardholders & Mobile Banking Users',
      reportedByAgency: `${regionInfo.primaryAgency} Live Warning`,
      isVerified: true,
      description: `High-urgency scam texts reported across ${regionInfo.name} requesting debit card verification to prevent fraudulent deductions. Fake URLs mimic official bank security portals.`,
      preventionAdvice: `Never click links inside unexpected bank security SMS alerts. Always call the number on the back of your debit card.`,
      exampleSnippet: `Alert: Unauthorized charge of $480.99 blocked. Verify your card immediately at secure-bank-auth-${region.toLowerCase()}.net to avoid account freeze.`,
      isRead: false,
    };

    // Prepend to alerts list
    this.alerts = [testAlert, ...this.alerts];
    this.saveAlerts();
    this.deliverNotification(testAlert);

    return testAlert;
  }

  public subscribe(listener: (alerts: RegionalScamAlert[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.alerts);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l(this.alerts));
  }
}

export const notificationService = NotificationService.getInstance();
