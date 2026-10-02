import { useEffect, useState } from 'react';
import { Button, DropZone, FileItem, FileList } from '@plurid/carved-ui-react';
import type { FileDescription } from '@plurid/carved-ui-react';

interface Upload {
  id: string;
  file: FileDescription;
  progress: number;
  error?: string;
}

const accepted = ['image/png', 'image/jpeg', 'image/webp'];

export default function Example() {
  const [uploads, setUploads] = useState<Upload[]>([
    { id: 'brief', file: { name: 'Brand brief.png', size: 482_113 }, progress: 100 },
    {
      id: 'scan',
      file: { name: 'Signed contract.tiff', size: 18_400_000 },
      progress: 0,
      error: 'TIFF images are not accepted.',
    },
  ]);
  const uploading = uploads.some((upload) => !upload.error && upload.progress < 100);

  // A stand-in for real uploads: each new file's progress grows until it is done.
  useEffect(() => {
    if (!uploading) return;
    const timer = setInterval(
      () =>
        setUploads((all) =>
          all.map((upload) =>
            upload.error || upload.progress >= 100
              ? upload
              : { ...upload, progress: Math.min(upload.progress + 9, 100) },
          ),
        ),
      180,
    );
    return () => clearInterval(timer);
  }, [uploading]);

  const add = (files: File[]) =>
    setUploads((all) => [
      ...all,
      ...files.map((file) => ({ id: crypto.randomUUID(), file, progress: 0 })),
    ]);
  const remove = (id: string) => setUploads((all) => all.filter((upload) => upload.id !== id));

  return (
    <div className="stack">
      <DropZone
        label="Drop images here"
        description="PNG, JPEG or WebP, up to 10 MB each."
        acceptedFileTypes={accepted}
        allowsMultiple
        onSelect={add}
      />
      <FileList aria-label="Chosen images">
        {uploads.map((upload) => (
          <FileItem
            key={upload.id}
            file={upload.file}
            progress={upload.error || upload.progress >= 100 ? undefined : upload.progress}
            error={upload.error}
            onRemove={() => remove(upload.id)}
          />
        ))}
      </FileList>
      {uploads.length > 1 && (
        <div className="row">
          <Button variant="ghost" size="sm" onPress={() => setUploads([])}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
