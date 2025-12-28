
export interface SharedFile {
  id: string;
  originalName: string;
  size: number;
  type: string;
  uploadTime: string;
  downloadCount: number;
  dataUrl: string; // Base64 or Blob URL for simulation
}

export type AppView = 'upload' | 'view' | 'admin';
