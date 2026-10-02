import { Avatar, AvatarGroup } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <AvatarGroup aria-label="Project members" max={4}>
      <Avatar name="Amara Okafor" />
      <Avatar name="Kenji Sato" />
      <Avatar name="Lena Fischer" />
      <Avatar name="Mateo García" />
      <Avatar name="Priya Nair" />
      <Avatar name="Sofia Rossi" />
    </AvatarGroup>
  );
}
