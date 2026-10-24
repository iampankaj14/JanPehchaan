import {
  Family,
  FamilyMember,
  WelfareScheme,
  ReviewFlag,
  ChangeLog
} from '../types';
import { initialFamilies, initialMembers, initialSchemes, initialReviewFlags } from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { randomUUID } from 'crypto';

// In-Memory Fallback Store (always initialized with rich synthetic demo data)
let familiesStore: Family[] = JSON.parse(JSON.stringify(initialFamilies));
let membersStore: FamilyMember[] = JSON.parse(JSON.stringify(initialMembers));
let schemesStore: WelfareScheme[] = JSON.parse(JSON.stringify(initialSchemes));
let flagsStore: ReviewFlag[] = JSON.parse(JSON.stringify(initialReviewFlags));
let changeLogsStore: ChangeLog[] = [];

export class DbService {
  // --- FAMILIES ---
  static async getFamilies(): Promise<Family[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('families').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Family[];
    }
    return familiesStore;
  }

  static async getFamilyById(id: string): Promise<Family | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('families').select('*').eq('id', id).single();
      if (!error && data) {
        const family = data as Family;
        family.members = await this.getMembersByFamilyId(id);
        family.review_flags = await this.getReviewFlagsByFamilyId(id);
        return family;
      }
    }
    const family = familiesStore.find(f => f.id === id);
    if (!family) return null;
    const copy = { ...family };
    copy.members = membersStore.filter(m => m.family_id === id);
    copy.review_flags = flagsStore.filter(f => f.family_id === id);
    return copy;
  }

  static async createFamily(familyData: Omit<Family, 'id' | 'created_at' | 'updated_at'>): Promise<Family> {
    const newId = `fam_${randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();
    const newFamily: Family = {
      ...familyData,
      id: newId,
      created_at: now,
      updated_at: now
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('families').insert(newFamily).select().single();
      if (!error && data) return data as Family;
    }

    familiesStore.unshift(newFamily);
    return newFamily;
  }

  static async updateFamily(id: string, updates: Partial<Family>, author = 'Authorised Reviewer'): Promise<Family | null> {
    const existing = await this.getFamilyById(id);
    if (!existing) return null;

    // Log changes
    for (const [key, val] of Object.entries(updates)) {
      if (key in existing && (existing as any)[key] !== val && key !== 'updated_at' && key !== 'members' && key !== 'review_flags') {
        await this.createChangeLog({
          entity_type: 'family',
          entity_id: id,
          field_name: key,
          old_value: String((existing as any)[key]),
          new_value: String(val),
          changed_by: author
        });
      }
    }

    const now = new Date().toISOString();
    const updatedFamily = { ...existing, ...updates, updated_at: now };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('families').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Family;
    }

    const index = familiesStore.findIndex(f => f.id === id);
    if (index !== -1) {
      familiesStore[index] = updatedFamily;
    }
    return updatedFamily;
  }

  static async deleteFamily(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('families').delete().eq('id', id);
    }
    familiesStore = familiesStore.filter(f => f.id !== id);
    membersStore = membersStore.filter(m => m.family_id !== id);
    flagsStore = flagsStore.filter(f => f.family_id !== id);
    return true;
  }

  // --- FAMILY MEMBERS ---
  static async getMembersByFamilyId(familyId: string): Promise<FamilyMember[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('family_members').select('*').eq('family_id', familyId);
      if (!error && data) return data as FamilyMember[];
    }
    return membersStore.filter(m => m.family_id === familyId);
  }

  static async getMemberById(id: string): Promise<FamilyMember | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('family_members').select('*').eq('id', id).single();
      if (!error && data) return data as FamilyMember;
    }
    return membersStore.find(m => m.id === id) || null;
  }

  static async createMember(familyId: string, memberData: Omit<FamilyMember, 'id' | 'family_id' | 'created_at' | 'updated_at'>): Promise<FamilyMember> {
    const newId = `mem_${randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();
    const newMember: FamilyMember = {
      ...memberData,
      id: newId,
      family_id: familyId,
      created_at: now,
      updated_at: now
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('family_members').insert(newMember).select().single();
      if (!error && data) return data as FamilyMember;
    }

    membersStore.push(newMember);
    return newMember;
  }

  static async updateMember(id: string, updates: Partial<FamilyMember>, author = 'Authorised Reviewer'): Promise<FamilyMember | null> {
    const existing = await this.getMemberById(id);
    if (!existing) return null;

    for (const [key, val] of Object.entries(updates)) {
      if (key in existing && (existing as any)[key] !== val && key !== 'updated_at') {
        await this.createChangeLog({
          entity_type: 'member',
          entity_id: id,
          field_name: key,
          old_value: String((existing as any)[key]),
          new_value: String(val),
          changed_by: author
        });
      }
    }

    const now = new Date().toISOString();
    const updated = { ...existing, ...updates, updated_at: now };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('family_members').update(updates).eq('id', id).select().single();
      if (!error && data) return data as FamilyMember;
    }

    const index = membersStore.findIndex(m => m.id === id);
    if (index !== -1) {
      membersStore[index] = updated;
    }
    return updated;
  }

  static async deleteMember(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('family_members').delete().eq('id', id);
    }
    membersStore = membersStore.filter(m => m.id !== id);
    return true;
  }

  // --- WELFARE SCHEMES ---
  static async getSchemes(): Promise<WelfareScheme[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('welfare_schemes').select('*, rules:scheme_rules(*)');
      if (!error && data) return data as WelfareScheme[];
    }
    return schemesStore;
  }

  static async getSchemeByCode(code: string): Promise<WelfareScheme | null> {
    const schemes = await this.getSchemes();
    return schemes.find(s => s.code === code) || null;
  }

  // --- REVIEW FLAGS ---
  static async getReviewFlags(status?: string): Promise<ReviewFlag[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('review_flags').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (!error && data) return data as ReviewFlag[];
    }
    if (status) {
      return flagsStore.filter(f => f.status === status);
    }
    return flagsStore;
  }

  static async getReviewFlagsByFamilyId(familyId: string): Promise<ReviewFlag[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('review_flags').select('*').eq('family_id', familyId);
      if (!error && data) return data as ReviewFlag[];
    }
    return flagsStore.filter(f => f.family_id === familyId);
  }

  static async createReviewFlag(flagData: Omit<ReviewFlag, 'id' | 'created_at'>): Promise<ReviewFlag> {
    const newId = `flag_${randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();
    const newFlag: ReviewFlag = {
      ...flagData,
      id: newId,
      created_at: now
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('review_flags').insert(newFlag).select().single();
      if (!error && data) return data as ReviewFlag;
    }

    flagsStore.unshift(newFlag);
    return newFlag;
  }

  static async updateReviewFlag(id: string, status: 'resolved' | 'dismissed', reviewer_notes: string): Promise<ReviewFlag | null> {
    const now = new Date().toISOString();
    const index = flagsStore.findIndex(f => f.id === id);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('review_flags').update({
        status,
        reviewer_notes,
        resolved_at: now
      }).eq('id', id).select().single();
      if (!error && data) return data as ReviewFlag;
    }

    if (index === -1) return null;
    flagsStore[index] = {
      ...flagsStore[index],
      status,
      reviewer_notes,
      resolved_at: now
    };
    return flagsStore[index];
  }

  // --- CHANGE LOGS / AUDIT ---
  static async createChangeLog(log: Omit<ChangeLog, 'id' | 'changed_at'>): Promise<ChangeLog> {
    const newId = `log_${randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();
    const newLog: ChangeLog = { ...log, id: newId, changed_at: now };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('change_logs').insert(newLog);
    }
    changeLogsStore.unshift(newLog);
    return newLog;
  }

  static async getChangeLogs(entityId?: string): Promise<ChangeLog[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('change_logs').select('*').order('changed_at', { ascending: false });
      if (entityId) query = query.eq('entity_id', entityId);
      const { data, error } = await query;
      if (!error && data) return data as ChangeLog[];
    }
    if (entityId) return changeLogsStore.filter(c => c.entity_id === entityId);
    return changeLogsStore;
  }

  // Reset/Re-seed in-memory store
  static resetDemoStore() {
    familiesStore = JSON.parse(JSON.stringify(initialFamilies));
    membersStore = JSON.parse(JSON.stringify(initialMembers));
    schemesStore = JSON.parse(JSON.stringify(initialSchemes));
    flagsStore = JSON.parse(JSON.stringify(initialReviewFlags));
    changeLogsStore = [];
  }
}
