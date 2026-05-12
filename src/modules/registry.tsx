// modules/registry.tsx — main navigation + module metadata
import React from 'react';
import {
  LayoutDashboard, Users, CreditCard, BookOpen, PiggyBank,
  ArrowRightLeft, Package, Building2, Users2, Database,
  Settings, TrendingUp, Shield, BarChart3, Wallet, Receipt,
  Image, Landmark, ListChecks, UserRound, BadgeCheck, Scale,
  ClipboardList, Sparkles, CalendarClock, KeyRound,
} from 'lucide-react';

export interface PrimeModule {
  id: number;
  name: string;
  type: string;
  mainModuleId: number;
  lockModuleId?: number | null;
  isActive?: boolean;
}

export interface MenuItem {
  id: number;
  label: string;
  icon: React.ReactNode;
  isSpecial?: boolean;
}

/** Virtual menu id — not used as mainModuleId in modules.json */
export const REPORTS_MENU_ID = 26990;

export interface ReportSubMenu {
  id: number;
  label: string;
}

/** Report sub-categories — each maps to a mainModuleId used by type "R" modules. */
export const REPORT_SUB_MENUS: ReportSubMenu[] = [
  { id: 26011, label: 'Client' },
  { id: 26021, label: 'Account' },
  { id: 26023, label: 'Fixed Deposit' },
  { id: 26031, label: 'Products' },
  { id: 26041, label: 'General Ledger' },
  { id: 26043, label: 'Accounts Payable' },
  { id: 26051, label: 'Deposit' },
  { id: 26061, label: 'Loan' },
  { id: 26063, label: 'Overdrafts' },
  { id: 26065, label: 'Collateral' },
  { id: 26091, label: 'Transactions' },
  { id: 26101, label: 'Charges & Rates' },
  { id: 26103, label: 'Currency' },
  { id: 26104, label: 'Teller' },
  { id: 26111, label: 'Fixed Assets' },
  { id: 26121, label: 'Micro Finance' },
  { id: 26141, label: 'KPI / Statistics' },
  { id: 26153, label: 'Workflow Client' },
  { id: 26155, label: 'Workflow Group Loan' },
  { id: 26161, label: 'System Security' },
  { id: 26181, label: 'Other Modules' },
  { id: 26191, label: 'Customized' },
  { id: 26200, label: 'MIS' },
  { id: 27770, label: 'Credit' },
  { id: 27771, label: 'Finance' },
  { id: 27772, label: 'Management' },
  { id: 27773, label: 'Transactions (Ext)' },
];

/**
 * Modules shown under each main menu.
 * - Reports: pass an optional subMenuId to filter by report sub-category (mainModuleId).
 *   Without subMenuId, returns all R-type modules.
 * - Other menus: matches mainModuleId, excludes reports.
 */
export function getModulesForMainMenu(
  menuId: number,
  allModules: PrimeModule[],
  subMenuId?: number,
): PrimeModule[] {
  if (menuId === REPORTS_MENU_ID) {
    return allModules
      .filter(m => m.type === 'R' && (subMenuId == null || m.mainModuleId === subMenuId))
      .sort(byModuleId);
  }
  return allModules.filter(m => m.mainModuleId === menuId && m.type !== 'R').sort(byModuleId);
}

/** Main menus that have at least one module (excluding Dashboard). */
export function getNavMenusWithModules(allModules: PrimeModule[]): MenuItem[] {
  return MainMenus.filter(m => {
    if (m.id === 0) return false;
    return getModulesForMainMenu(m.id, allModules).length > 0;
  });
}
const byModuleId = (a: PrimeModule, b: PrimeModule) => a.id - b.id;
/*
const byModuleName = (a: PrimeModule, b: PrimeModule) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
*/

/**
 * Organises a flat list of modules into a lock-parent tree.
 *
 * - **R** = report, **D** = data entry, **V** = view.
 * - If `lockModuleId` is **0 / null** or **equals this module's id** → top-level root.
 * - If `lockModuleId` is another module **id that exists in this same list** → nested child
 *   of that lock parent.
 * - If `lockModuleId` points **outside** this list (missing parent) → **silently dropped**;
 *   these are sub-modules whose hub lives in a different menu section.
 */
export function buildLockParentTree(modules: PrimeModule[]): {
  primaryRoots: PrimeModule[];
  orphanRoots: PrimeModule[];   // always empty — kept for API compatibility
  children: Map<number, PrimeModule[]>;
} {
  const ids = new Set(modules.map(m => m.id));
  const children = new Map<number, PrimeModule[]>();

  for (const m of modules) {
    const L = m.lockModuleId ?? 0;
    if (L !== 0 && L !== m.id && ids.has(L)) {
      // Valid child — nest under its lock parent
      if (!children.has(L)) children.set(L, []);
      children.get(L)!.push(m);
    }
    // If L points outside this list → drop silently (orphan not shown)
  }
  for (const [, arr] of children) arr.sort(byModuleId);
  //for (const [, arr] of children) arr.sort(byModuleName);

  // Only true roots: lockModuleId is 0 / null / self
  const primaryRoots = modules
    .filter(m => {
      const L = m.lockModuleId ?? 0;
      return L === 0 || L === m.id;
    })
    .sort(byModuleId);

  return { primaryRoots, orphanRoots: [], children };
}

/**
 * Ordered shell navigation — one row per business area.
 * Report-type modules ("R") are excluded here and listed only under Reports.
 */
export const MainMenus: MenuItem[] = [
  { id: 0, label: 'Dashboard', icon: <LayoutDashboard size={18} />, isSpecial: true },

  { id: 26010, label: 'Client & accounts', icon: <Users size={18} /> },
  { id: 26022, label: 'Account utilities', icon: <Settings size={18} /> },
  { id: 26025, label: 'Images', icon: <Image size={18} /> },
  { id: 26030, label: 'Product & currencies', icon: <Package size={18} /> },
  { id: 26040, label: 'General ledger', icon: <BookOpen size={18} /> },
  { id: 26042, label: 'Accounts payable', icon: <Receipt size={18} /> },
  { id: 26050, label: 'Deposit', icon: <PiggyBank size={18} /> },
  { id: 26060, label: 'Loan', icon: <CreditCard size={18} /> },
  { id: 26062, label: 'Overdrafts', icon: <TrendingUp size={18} /> },
  { id: 26064, label: 'Collateral', icon: <Shield size={18} /> },
  { id: 26090, label: 'Transactions', icon: <ArrowRightLeft size={18} /> },
  { id: 26100, label: 'Rates, tax & charges', icon: <Landmark size={18} /> },
  { id: 26102, label: 'FX & till', icon: <Wallet size={18} /> },
  { id: 26110, label: 'GL interface', icon: <Building2 size={18} /> },
  { id: 26120, label: 'Groups', icon: <Users2 size={18} /> },
  { id: 26130, label: 'Day operations', icon: <CalendarClock size={18} /> },
  { id: 26140, label: 'Organization setup', icon: <Database size={18} /> },
  { id: 26150, label: 'Field validation', icon: <ListChecks size={18} /> },
  { id: 26152, label: 'Client grouping', icon: <UserRound size={18} /> },
  { id: 26154, label: 'Charge approvals', icon: <BadgeCheck size={18} /> },
  { id: 26156, label: 'Limits & collateral', icon: <Scale size={18} /> },
  { id: 26170, label: 'Security & roles', icon: <KeyRound size={18} /> },
  { id: 26201, label: 'Listings', icon: <ClipboardList size={18} /> },
  { id: 26222, label: 'Extensions', icon: <Sparkles size={18} /> },

  { id: REPORTS_MENU_ID, label: 'Reports', icon: <BarChart3 size={18} /> },
];

export const moduleRegistry: Record<number, PrimeModule> = {};

export const loadModules = async (): Promise<void> => {
  try {
    const response = await fetch('/data/modules.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const rawData = await response.json();
    const modulesArray = Array.isArray(rawData) ? rawData : (rawData.modules || []);

    Object.keys(moduleRegistry).forEach(key => delete moduleRegistry[Number(key)]);

    modulesArray.forEach((mod: Record<string, unknown>) => {
      if (mod && typeof mod.id === 'number') {
        moduleRegistry[mod.id] = {
          id: mod.id,
          name: (mod.name as string) || 'Unknown Module',
          type: (mod.type as string) || 'U',
          mainModuleId: mod.mainModuleId as number,
          lockModuleId: (mod.lockModuleId as number | null) ?? null,
          isActive: (mod.isActive as boolean) ?? true,
        };
      }
    });

    console.log(`✅ Successfully loaded ${Object.keys(moduleRegistry).length} modules`);
  } catch (error) {
    console.error('❌ Failed to load modules.json:', error);
  }
};