export const AI_CHAT_LIMITS = {
  maxMessageLength: 4000,
  maxAudioBytes: 25 * 1024 * 1024,
  maxAttachmentBytes: 10 * 1024 * 1024,
  maxAttachments: 5,
  audioAccept:
    ".flac,.m4a,.mp3,.mp4,.mpeg,.mpga,.oga,.ogg,.wav,.webm,audio/flac,audio/mp4,audio/mpeg,audio/ogg,audio/wav,audio/webm,audio/x-m4a",
  audioMimeTypes: [
    "audio/flac",
    "audio/x-flac",
    "audio/mp4",
    "audio/m4a",
    "audio/x-m4a",
    "audio/mpeg",
    "audio/mp3",
    "audio/ogg",
    "audio/oga",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/webm",
    "video/webm",
    "video/mp4",
  ],
  audioExtensions: [
    ".flac",
    ".m4a",
    ".mp3",
    ".mp4",
    ".mpeg",
    ".mpga",
    ".oga",
    ".ogg",
    ".wav",
    ".webm",
  ],
} as const;

export const formatAiFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getAiFileExtension = (fileName: string) => {
  const index = fileName.lastIndexOf(".");
  if (index < 0) {
    return "";
  }

  return fileName.slice(index).toLowerCase();
};

export const isAllowedAiAudioFile = (file: File) => {
  const extension = getAiFileExtension(file.name);
  const mime = file.type.toLowerCase();

  if (
    (AI_CHAT_LIMITS.audioExtensions as readonly string[]).includes(extension)
  ) {
    return true;
  }

  return AI_CHAT_LIMITS.audioMimeTypes.some((type) => mime === type);
};
