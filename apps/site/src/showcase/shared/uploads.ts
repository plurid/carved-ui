import { useEffect, useState } from 'react';
import type { FileDescription } from '@plurid/carved-ui-react';

export interface Upload {
  id: string;
  file: FileDescription;
  /** 0–100 while uploading. */
  progress: number;
  /** Why the file was refused. */
  error?: string;
}

/**
 * Files on their way up. A stand-in for real uploads: each file's progress grows until it is
 * done, so the list shows what a real one would.
 */
export function useUploads(initial: Upload[] = []) {
  const [uploads, setUploads] = useState(initial);
  const busy = uploads.some((upload) => !upload.error && upload.progress < 100);

  useEffect(() => {
    if (!busy) return;
    const timer = setInterval(
      () =>
        setUploads((all) =>
          all.map((upload) =>
            upload.error || upload.progress >= 100
              ? upload
              : { ...upload, progress: Math.min(upload.progress + 7, 100) },
          ),
        ),
      160,
    );
    return () => clearInterval(timer);
  }, [busy]);

  return {
    uploads,
    busy,
    /** Adds files; `refuse` returns why a file cannot be taken, if it cannot. */
    add(files: File[], refuse?: (file: File) => string | undefined) {
      setUploads((all) => [
        ...all,
        ...files.map((file) => ({
          id: crypto.randomUUID(),
          file,
          progress: 0,
          error: refuse?.(file),
        })),
      ]);
    },
    remove: (id: string) => setUploads((all) => all.filter((upload) => upload.id !== id)),
    clear: () => setUploads([]),
  };
}
