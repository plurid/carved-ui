import { Avatar, AvatarGroup } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <AvatarGroup aria-label="Project members" max={4}>
      <Avatar name="Ana Pop" />
      <Avatar name="Ioan Marin" />
      <Avatar name="Mara Ilie" />
      <Avatar name="Radu Stan" />
      <Avatar name="Elena Dobre" />
      <Avatar name="Victor Ene" />
    </AvatarGroup>
  );
}
