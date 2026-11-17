declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

export function loadPickerApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.picker) {
      resolve();
      return;
    }

    const checkGapi = () => {
      if (window.gapi) {
        window.gapi.load('picker', {
          callback: () => {
            resolve();
          },
          onerror: () => {
            reject(new Error('Failed to load Google Picker library'));
          },
        });
      } else {
        setTimeout(checkGapi, 100);
      }
    };

    checkGapi();
  });
}

export interface PickedFileResult {
  id: string;
  name: string;
  mimeType: string;
  url?: string;
}

export async function showGooglePicker({
  accessToken,
  onPick,
  onCancel,
  onError,
}: {
  accessToken: string;
  onPick: (file: PickedFileResult) => void;
  onCancel?: () => void;
  onError?: (err: Error) => void;
}): Promise<void> {
  try {
    await loadPickerApi();

    if (!window.google?.picker) {
      throw new Error('Google Picker is not available');
    }

    const pickerOrigin =
      window.location.ancestorOrigins &&
      window.location.ancestorOrigins.length > 0
        ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
        : window.location.origin;

    // View configured for images and documents
    const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_IMAGES)
      .setIncludeFolders(true)
      .setMimeTypes('image/png,image/jpeg,image/webp,image/gif,image/heic');

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .addView(window.google.picker.ViewId.DOCS)
      .setOAuthToken(accessToken)
      .setOrigin(pickerOrigin)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          onPick({
            id: doc.id,
            name: doc.name,
            mimeType: doc.mimeType,
            url: doc.url,
          });
        } else if (data.action === window.google.picker.Action.CANCEL) {
          if (onCancel) onCancel();
        }
      })
      .build();

    picker.setVisible(true);
  } catch (err: any) {
    console.error('Google Picker error:', err);
    if (onError) onError(err);
  }
}
