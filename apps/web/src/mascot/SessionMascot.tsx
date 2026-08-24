import type { ActivitySessionSnapshot } from '@fantasia/engine-core';
import { Mascot } from './Mascot';
import type { MascotAvatarId } from './mascot-assets';
import { mascotReaction, type SessionMascotMessages } from './mascot-reaction';

export interface SessionMascotProps {
  avatarId: MascotAvatarId;
  session: ActivitySessionSnapshot;
  messages: SessionMascotMessages;
  reducedMotion?: boolean;
}

export function SessionMascot({
  avatarId,
  session,
  messages,
  reducedMotion,
}: SessionMascotProps) {
  const reaction = mascotReaction(session, messages);
  return (
    <Mascot
      avatarId={avatarId}
      message={reaction.message}
      reducedMotion={reducedMotion}
      state={reaction.state}
    />
  );
}
