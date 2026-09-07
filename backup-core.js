// Bahamut opening/ending backup core - v2.2.9
// Pure local-data helpers shared by the standalone backup manager.
(() => {
  "use strict";

  const LEARNING_BACKUP_FORMAT = "netflix-bahamut-auto-player/bahamut-skip-learning";
  const LEGACY_INTRO_BACKUP_FORMAT = "netflix-bahamut-auto-player/bahamut-intro-learning";
  const LEARNING_BACKUP_VERSION = 4;
  const MAX_PROFILES_PER_WORK = 3;

  function isValidFingerprint(value) {
    return typeof value === "string" && value.length === 144 && /^[01]+$/.test(value);
  }

  function sanitizeImage(value) {
    return typeof value === "string" && value.startsWith("data:image/") ? value : null;
  }

  function sanitizeImportedProfile(profile, kind = "intro") {
    if (!profile || typeof profile !== "object") return null;

    const rawFingerprints = Array.isArray(profile.fingerprints)
      ? profile.fingerprints.filter(isValidFingerprint)
      : [];
    const fingerprints = [...new Set(rawFingerprints)].slice(-12);
    if (isValidFingerprint(profile.startFingerprint) && !fingerprints.includes(profile.startFingerprint)) {
      fingerprints.push(profile.startFingerprint);
    }
    if (isValidFingerprint(profile.fingerprint) && !fingerprints.includes(profile.fingerprint)) {
      fingerprints.push(profile.fingerprint);
    }
    if (!fingerprints.length) return null;

    const duration = Number(profile.duration);
    if (!Number.isFinite(duration) || duration <= 1 || duration > 15 * 60) return null;

    const startTimeHint = Number(profile.startTimeHint);
    const endTimeHint = Number(profile.endTimeHint);
    const startAdjustmentSeconds = Number(profile.startAdjustmentSeconds);
    const endAdjustmentSeconds = Number(profile.endAdjustmentSeconds ?? profile.adjustmentSeconds);

    const startFingerprint = isValidFingerprint(profile.startFingerprint)
      ? profile.startFingerprint
      : isValidFingerprint(profile.fingerprint)
        ? profile.fingerprint
        : fingerprints[0];
    const endFingerprint = isValidFingerprint(profile.endFingerprint) ? profile.endFingerprint : null;

    const rawAnchors = Array.isArray(profile.anchors) ? profile.anchors : [];
    const anchors = rawAnchors
      .filter((anchor) => isValidFingerprint(anchor?.fingerprint))
      .map((anchor) => ({
        fingerprint: anchor.fingerprint,
        offsetSeconds: Number.isFinite(Number(anchor.offsetSeconds))
          ? Math.max(0, Number(Number(anchor.offsetSeconds).toFixed(3)))
          : 0
      }))
      .sort((a, b) => a.offsetSeconds - b.offsetSeconds)
      .slice(0, 8);

    const precise = Number(profile.profileSchemaVersion) >= 2 && anchors.length > 0;
    const anchorVersion = precise
      ? Math.max(2, Math.min(3, Number(profile.anchorVersion) || (anchors.length >= 3 ? 3 : 2)))
      : 1;
    const fingerprintVersion = precise
      ? Math.max(2, Math.min(3, Number(profile.fingerprintVersion) || (anchors.length >= 3 ? 3 : 2)))
      : 1;

    const startPreviewDataUrl = sanitizeImage(profile.startPreviewDataUrl) || sanitizeImage(profile.previewDataUrl);
    const endPreviewDataUrl = sanitizeImage(profile.endPreviewDataUrl);

    return {
      id: typeof profile.id === "string" && profile.id
        ? profile.id
        : `${kind}-import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind,
      profileSchemaVersion: precise ? Math.max(2, Number(profile.profileSchemaVersion) || 2) : 1,
      anchorVersion,
      createdAt: Number.isFinite(Number(profile.createdAt)) ? Number(profile.createdAt) : Date.now(),
      duration: Number(duration.toFixed(3)),
      startTimeHint: Number.isFinite(startTimeHint) && startTimeHint >= 0 ? Number(startTimeHint.toFixed(3)) : 0,
      endTimeHint: Number.isFinite(endTimeHint) && endTimeHint >= 0 ? Number(endTimeHint.toFixed(3)) : undefined,
      startAdjustmentSeconds: Number.isFinite(startAdjustmentSeconds) ? Number(startAdjustmentSeconds.toFixed(3)) : 0,
      endAdjustmentSeconds: Number.isFinite(endAdjustmentSeconds) ? Number(endAdjustmentSeconds.toFixed(3)) : 0,
      adjustmentSeconds: Number.isFinite(endAdjustmentSeconds) ? Number(endAdjustmentSeconds.toFixed(3)) : 0,
      startFingerprint,
      endFingerprint,
      anchors,
      fingerprint: startFingerprint,
      fingerprints: precise ? anchors.map((anchor) => anchor.fingerprint) : fingerprints,
      fingerprintVersion,
      previewDataUrl: startPreviewDataUrl,
      previewWidth: Number.isFinite(Number(profile.previewWidth)) ? Number(profile.previewWidth) : 240,
      previewHeight: Number.isFinite(Number(profile.previewHeight)) ? Number(profile.previewHeight) : 135,
      startPreviewDataUrl,
      startPreviewWidth: Number.isFinite(Number(profile.startPreviewWidth)) ? Number(profile.startPreviewWidth) : 240,
      startPreviewHeight: Number.isFinite(Number(profile.startPreviewHeight)) ? Number(profile.startPreviewHeight) : 135,
      endPreviewDataUrl,
      endPreviewWidth: Number.isFinite(Number(profile.endPreviewWidth)) ? Number(profile.endPreviewWidth) : 240,
      endPreviewHeight: Number.isFinite(Number(profile.endPreviewHeight)) ? Number(profile.endPreviewHeight) : 135,
      sourceEpisodeUrl: typeof profile.sourceEpisodeUrl === "string" ? profile.sourceEpisodeUrl : ""
    };
  }

  function sanitizeImportedWorks(rawWorks, kind = "intro") {
    if (!rawWorks || typeof rawWorks !== "object" || Array.isArray(rawWorks)) return {};
    const output = {};
    for (const [workKey, rawEntry] of Object.entries(rawWorks)) {
      if (typeof workKey !== "string" || !workKey || !rawEntry || typeof rawEntry !== "object") continue;
      const profiles = Array.isArray(rawEntry.profiles)
        ? rawEntry.profiles.map((profile) => sanitizeImportedProfile(profile, kind)).filter(Boolean).slice(0, MAX_PROFILES_PER_WORK)
        : [];
      if (!profiles.length) continue;
      output[workKey] = {
        workKey,
        workId: rawEntry.workId == null ? null : String(rawEntry.workId),
        title: typeof rawEntry.title === "string" && rawEntry.title.trim() ? rawEntry.title.trim() : workKey,
        updatedAt: Number.isFinite(Number(rawEntry.updatedAt)) ? Number(rawEntry.updatedAt) : Date.now(),
        profiles
      };
    }
    return output;
  }

  function parseBackupPayload(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("INVALID_FORMAT");
    let rawIntro = null;
    let rawOutro = null;

    if (raw.format === LEARNING_BACKUP_FORMAT) {
      rawIntro = raw.introWorks || {};
      rawOutro = raw.outroWorks || {};
    } else if (raw.format === LEGACY_INTRO_BACKUP_FORMAT) {
      rawIntro = raw.works || {};
      rawOutro = {};
    } else if (raw.introProfiles || raw.outroProfiles) {
      rawIntro = raw.introProfiles || {};
      rawOutro = raw.outroProfiles || {};
    } else {
      throw new Error("INVALID_FORMAT");
    }

    const introWorks = sanitizeImportedWorks(rawIntro, "intro");
    const outroWorks = sanitizeImportedWorks(rawOutro, "outro");
    if (!Object.keys(introWorks).length && !Object.keys(outroWorks).length) throw new Error("INVALID_DATA");

    return {
      format: LEARNING_BACKUP_FORMAT,
      schemaVersion: Number.isFinite(Number(raw.schemaVersion)) ? Number(raw.schemaVersion) : 0,
      extensionVersion: typeof raw.extensionVersion === "string" ? raw.extensionVersion : "unknown",
      exportedAt: typeof raw.exportedAt === "string" ? raw.exportedAt : null,
      introWorks,
      outroWorks
    };
  }

  function countProfiles(works) {
    return Object.values(works || {}).reduce(
      (sum, entry) => sum + (Array.isArray(entry?.profiles) ? entry.profiles.length : 0),
      0
    );
  }

  function summarize(introWorks, outroWorks) {
    const intro = countProfiles(introWorks);
    const outro = countProfiles(outroWorks);
    const works = new Set([...Object.keys(introWorks || {}), ...Object.keys(outroWorks || {})]).size;
    let previews = 0;
    let missingPreviews = 0;
    let reliable = 0;
    let legacy = 0;
    for (const collection of [introWorks || {}, outroWorks || {}]) {
      for (const entry of Object.values(collection)) {
        for (const profile of entry?.profiles || []) {
          if (profile?.startPreviewDataUrl) previews += 1; else missingPreviews += 1;
          if (profile?.endPreviewDataUrl) previews += 1; else missingPreviews += 1;
          const anchors = Array.isArray(profile?.anchors) ? profile.anchors.length : 0;
          if (Number(profile?.anchorVersion) >= 3 && anchors >= 3) reliable += 1;
          else legacy += 1;
        }
      }
    }
    return { works, intro, outro, total: intro + outro, previews, missingPreviews, reliable, legacy };
  }

  function anchorSignature(profile) {
    const anchors = Array.isArray(profile?.anchors) ? profile.anchors : [];
    return anchors.map((anchor) => `${anchor.fingerprint}:${Number(anchor.offsetSeconds || 0).toFixed(2)}`).join(",");
  }

  function profileSignature(profile) {
    return [
      profile?.startFingerprint || profile?.fingerprint || "",
      Number(profile?.duration || 0).toFixed(2),
      Number(profile?.startTimeHint || 0).toFixed(2),
      Number(profile?.endTimeHint || 0).toFixed(2),
      anchorSignature(profile)
    ].join("|");
  }

  function profileCompleteness(profile) {
    const anchors = Array.isArray(profile?.anchors) ? profile.anchors.length : 0;
    let score = anchors * 10;
    if (profile?.startPreviewDataUrl) score += 4;
    if (profile?.endPreviewDataUrl) score += 4;
    if (Number(profile?.anchorVersion) >= 3) score += 5;
    if (Number(profile?.profileSchemaVersion) >= 2) score += 2;
    if (Number.isFinite(Number(profile?.startAdjustmentSeconds))) score += 1;
    if (Number.isFinite(Number(profile?.endAdjustmentSeconds))) score += 1;
    return score;
  }

  function mergeLearningWorks(currentRaw, incomingRaw, kind) {
    const merged = sanitizeImportedWorks(currentRaw, kind);
    const incoming = sanitizeImportedWorks(incomingRaw, kind);
    const stats = { added: 0, upgraded: 0, duplicates: 0, capped: 0, touchedWorks: new Set() };

    for (const [workKey, importedEntry] of Object.entries(incoming)) {
      const existing = merged[workKey] || {
        workKey,
        workId: importedEntry.workId,
        title: importedEntry.title,
        updatedAt: 0,
        profiles: []
      };
      const profiles = Array.isArray(existing.profiles) ? [...existing.profiles] : [];

      for (const profile of importedEntry.profiles) {
        const idIndex = profile.id ? profiles.findIndex((candidate) => candidate?.id === profile.id) : -1;
        const sig = profileSignature(profile);
        const sigIndex = profiles.findIndex((candidate) => profileSignature(candidate) === sig);
        const duplicateIndex = idIndex >= 0 ? idIndex : sigIndex;

        if (duplicateIndex >= 0) {
          const current = profiles[duplicateIndex];
          if (profileCompleteness(profile) > profileCompleteness(current)) {
            profiles[duplicateIndex] = profile;
            stats.upgraded += 1;
            stats.touchedWorks.add(workKey);
          } else {
            stats.duplicates += 1;
          }
          continue;
        }

        if (profiles.length >= MAX_PROFILES_PER_WORK) {
          stats.capped += 1;
          continue;
        }
        profiles.push(profile);
        stats.added += 1;
        stats.touchedWorks.add(workKey);
      }

      existing.workId = importedEntry.workId || existing.workId || null;
      existing.title = importedEntry.title || existing.title || workKey;
      existing.updatedAt = Math.max(Number(existing.updatedAt) || 0, Number(importedEntry.updatedAt) || 0, Date.now());
      existing.profiles = profiles.slice(0, MAX_PROFILES_PER_WORK);
      if (existing.profiles.length) merged[workKey] = existing;
    }

    return { merged, ...stats };
  }

  function mergePayloads(payloads) {
    let introWorks = {};
    let outroWorks = {};
    const sources = [];
    for (const payload of payloads) {
      const parsed = payload?.introWorks && payload?.outroWorks ? payload : parseBackupPayload(payload);
      introWorks = mergeLearningWorks(introWorks, parsed.introWorks, "intro").merged;
      outroWorks = mergeLearningWorks(outroWorks, parsed.outroWorks, "outro").merged;
      sources.push({
        schemaVersion: parsed.schemaVersion,
        extensionVersion: parsed.extensionVersion,
        exportedAt: parsed.exportedAt
      });
    }
    return { introWorks, outroWorks, sources };
  }

  function librarySignature(introRaw, outroRaw) {
    const introWorks = sanitizeImportedWorks(introRaw, "intro");
    const outroWorks = sanitizeImportedWorks(outroRaw, "outro");
    const rows = [];
    for (const [kind, works] of [["intro", introWorks], ["outro", outroWorks]]) {
      for (const workKey of Object.keys(works).sort()) {
        const entry = works[workKey];
        for (const profile of entry.profiles || []) {
          rows.push([
            kind,
            workKey,
            profile.id || "",
            profileSignature(profile),
            Number(profile.startAdjustmentSeconds || 0).toFixed(3),
            Number((profile.endAdjustmentSeconds ?? profile.adjustmentSeconds) || 0).toFixed(3),
            profile.startPreviewDataUrl || "",
            profile.endPreviewDataUrl || ""
          ].join("\u241f"));
        }
      }
    }
    return rows.sort().join("\u241e");
  }

  function createBackupPayload(introRaw, outroRaw, extensionVersion) {
    const introWorks = sanitizeImportedWorks(introRaw, "intro");
    const outroWorks = sanitizeImportedWorks(outroRaw, "outro");
    return {
      format: LEARNING_BACKUP_FORMAT,
      schemaVersion: LEARNING_BACKUP_VERSION,
      extensionVersion: String(extensionVersion || "unknown"),
      exportedAt: new Date().toISOString(),
      introWorks,
      outroWorks
    };
  }

  globalThis.BahamutBackupCore = Object.freeze({
    LEARNING_BACKUP_FORMAT,
    LEGACY_INTRO_BACKUP_FORMAT,
    LEARNING_BACKUP_VERSION,
    MAX_PROFILES_PER_WORK,
    isValidFingerprint,
    sanitizeImportedProfile,
    sanitizeImportedWorks,
    parseBackupPayload,
    countProfiles,
    summarize,
    profileSignature,
    mergeLearningWorks,
    mergePayloads,
    librarySignature,
    createBackupPayload
  });
})();
