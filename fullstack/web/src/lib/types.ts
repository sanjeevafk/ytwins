export interface Video {
  id: string;
  db_id?: number;
  title: string;
  completed: boolean;
}

export interface PlaylistMeta {
  name: string;
}

export interface PlaylistData {
  videos: Video[];
  currentIndex: number;
  darkMode: boolean;
  playbackSpeed: number;
  isFullscreen: boolean;
}
