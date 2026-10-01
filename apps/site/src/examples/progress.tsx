import { ProgressBar, Skeleton, Spinner } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack narrow">
      <ProgressBar label="Uploading" value={64} />
      <ProgressBar label="Preparing the build" />
      <div className="row">
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" aria-label="Loading projects" />
      </div>
      <Skeleton style={{ blockSize: '1.25rem', inlineSize: '70%' }} />
    </div>
  );
}
