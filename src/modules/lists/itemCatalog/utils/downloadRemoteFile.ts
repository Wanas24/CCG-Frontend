const saveBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const downloadRemoteFile = async (
  url: string,
  fileName: string,
): Promise<void> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  const blob = await response.blob();
  saveBlob(blob, fileName);
};
