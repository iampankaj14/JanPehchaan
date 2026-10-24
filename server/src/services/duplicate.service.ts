import { Family, FamilyMember, DuplicateCandidate } from '../types';

export class DuplicateService {
  /**
   * Normalizes a citizen name by lowercasing, removing honorifics, and stripping punctuation.
   */
  static normalizeName(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/\b(shri|smt|shrimati|mr|mrs|ms|dr|late|kumar|devi)\b/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  /**
   * Computes standard Levenshtein distance between two strings.
   */
  static levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    const lenA = a.length;
    const lenB = b.length;

    if (lenA === 0) return lenB;
    if (lenB === 0) return lenA;

    for (let i = 0; i <= lenA; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= lenB; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,       // deletion
          matrix[i][j - 1] + 1,       // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[lenA][lenB];
  }

  /**
   * Calculates similarity percentage between 0 and 100.
   */
  static calculateSimilarity(s1: string, s2: string): number {
    const norm1 = this.normalizeName(s1);
    const norm2 = this.normalizeName(s2);

    if (!norm1 || !norm2) return 0;
    if (norm1 === norm2) return 100;

    const maxLen = Math.max(norm1.length, norm2.length);
    const distance = this.levenshteinDistance(norm1, norm2);
    const score = Math.round(((maxLen - distance) / maxLen) * 100);
    return Math.max(0, score);
  }

  /**
   * Evaluates candidate family against all other families for potential overlap.
   */
  static findPossibleDuplicates(
    targetFamily: Family,
    targetMembers: FamilyMember[],
    allFamilies: Family[],
    allMembers: FamilyMember[]
  ): DuplicateCandidate[] {
    const duplicates: DuplicateCandidate[] = [];

    // Filter out target family itself
    const otherFamilies = allFamilies.filter(f => f.id !== targetFamily.id);

    for (const other of otherFamilies) {
      // 1. Check Household Head Name Similarity
      const nameScore = this.calculateSimilarity(targetFamily.family_head_name, other.family_head_name);
      const sameDistrict = targetFamily.district?.trim().toLowerCase() === other.district?.trim().toLowerCase();
      const samePincode = targetFamily.pincode?.trim() === other.pincode?.trim();

      if (nameScore >= 80 && (sameDistrict || samePincode)) {
        duplicates.push({
          matched_family_id: other.id,
          matched_head_name: other.family_head_name,
          matched_address: other.address,
          matched_district: other.district,
          similarity_score: nameScore,
          reason: `Head of household name "${targetFamily.family_head_name}" is ${nameScore}% similar to "${other.family_head_name}" in ${other.district} (PIN: ${other.pincode}).`
        });
        continue; // Household already flagged
      }

      // 2. Check if identical member exists in both households
      const otherHouseholdMembers = allMembers.filter(m => m.family_id === other.id);
      for (const targetMem of targetMembers) {
        for (const otherMem of otherHouseholdMembers) {
          const memScore = this.calculateSimilarity(targetMem.full_name, otherMem.full_name);
          const sameAge = Math.abs(targetMem.age - otherMem.age) <= 1;

          if (memScore >= 90 && sameAge && targetMem.gender === otherMem.gender) {
            duplicates.push({
              matched_family_id: other.id,
              matched_head_name: other.family_head_name,
              matched_address: other.address,
              matched_district: other.district,
              similarity_score: memScore,
              reason: `Family member "${targetMem.full_name}" (age ${targetMem.age}) closely matches member in household headed by ${other.family_head_name}.`
            });
            break;
          }
        }
      }
    }

    return duplicates;
  }
}
