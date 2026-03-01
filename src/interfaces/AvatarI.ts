/** Avatar: a second "character" that can be sent on expeditions so the main can keep cultivating. */
export interface AvatarI {
  id: number;
  name: string;
  /** Single stat used for expedition effectiveness / future training. */
  power: number;
  isBusy: boolean;
  /** When on expedition: timestamp (ms) when the expedition ends. */
  expeditionEndTime: number | null;
  /** When on expedition: mission id. */
  expeditionMissionId: number | null;
}
