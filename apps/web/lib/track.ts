import { track as databuddyTrack } from '@databuddy/sdk/react';

export function track(event: string, properties?: Record<string, unknown>) {
  try {
    databuddyTrack(event, properties ?? {});
  } catch {
  }
}
