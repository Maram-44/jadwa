import { supabase, isSupabaseConfigured } from "../../../shared/lib/supabase.js";
import { JadwaSession } from "../../../shared/lib/session.js";
import { toDataHubFileDTO } from "../../../shared/types/dto.js";
import { authService } from "../../auth/services/authService.js";

export const dataHubService = {
  /**
   * Get all prepared data files, synchronizing remote Supabase storage with tab session
   */
  async getFiles(period, explicitIsGuest = null) {
    let isGuest = explicitIsGuest;
    if (isGuest === null) {
      const user = await authService.getCurrentUser();
      isGuest = Boolean(user && user.isGuest);
    }

    if (!isGuest && isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from("data_hub_files").select("*");
        if (period) {
          query = query.eq("period_key", period);
        }
        const { data, error } = await query;

        if (!error && data) {
          const remoteFiles = data.map(toDataHubFileDTO);
          return period ? remoteFiles.filter((f) => f.result?.period === period) : remoteFiles;
        }
        return [];
      } catch (err) {
        console.warn("[Data Hub Service] Error reading remote files:", err);
        return [];
      }
    }

    if (isGuest) {
      const sessionFiles = JadwaSession.files();
      return period ? JadwaSession.forPeriod(period) : sessionFiles;
    }

    return [];
  },

  /**
   * Save a prepared file into Supabase and tab session
   */
  async saveFile(file) {
    // 1. Update session storage immediately for responsive UI
    const existing = JadwaSession.files();
    const filtered = existing.filter((f) => f.id !== file.replaces && f.id !== file.id);
    filtered.push(file);
    JadwaSession.save(filtered);

    // 2. Persist to Supabase if available
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          file_name: file.name,
          file_type: file.type,
          file_size: file.size || 0,
          period_key: file.result.period,
          origin: file.origin || "upload",
          headers: file.parsed?.headers || [],
          mapping: file.mapping || {},
          valid_count: file.result?.valid?.length || 0,
          invalid_count: file.result?.invalid?.length || 0,
          issues: file.result?.issues || [],
          valid_rows: file.result?.valid || [],
          invalid_rows: file.result?.invalid || [],
          prepared_at: new Date(file.preparedAt || Date.now()).toISOString(),
        };

        if (file.replaces) {
          // Remove previous replaced file
          await supabase.from("data_hub_files").delete().eq("id", file.replaces).catch(() => {});
        }

        await supabase.from("data_hub_files").insert([payload]);
      } catch (err) {
        console.warn("[Data Hub Service] Error persisting to Supabase:", err);
      }
    }

    return file;
  },

  /**
   * Delete a file
   */
  async deleteFile(fileId) {
    const updated = JadwaSession.files().filter((f) => f.id !== fileId);
    JadwaSession.save(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("data_hub_files").delete().eq("id", fileId);
      } catch (err) {
        console.warn("[Data Hub Service] Error deleting remote file:", err);
      }
    }
  },
};
