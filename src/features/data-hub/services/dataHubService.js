import { supabase, isSupabaseConfigured } from "../../../shared/lib/supabase.js";
import { JadwaSession } from "../../../shared/lib/session.js";
import { toDataHubFileDTO } from "../../../shared/types/dto.js";

export const dataHubService = {
  /**
   * Get all prepared data files, synchronizing remote Supabase storage with tab session
   */
  async getFiles(period) {
    const sessionFiles = JadwaSession.files();

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from("data_hub_files").select("*");
        if (period) {
          query = query.eq("period_key", period);
        }
        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          const remoteFiles = data.map(toDataHubFileDTO);
          // Merge remote files with session files, deduplicating by ID/type+period
          const merged = [...sessionFiles];
          for (const rf of remoteFiles) {
            const exists = merged.some(
              (f) => f.id === rf.id || (f.type === rf.type && f.result.period === rf.result.period),
            );
            if (!exists) {
              merged.push(rf);
            }
          }
          JadwaSession.save(merged);
          return period ? merged.filter((f) => f.result.period === period) : merged;
        }
      } catch (err) {
        console.warn("[Data Hub Service] Error reading remote files:", err);
      }
    }

    return period ? JadwaSession.forPeriod(period) : sessionFiles;
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
