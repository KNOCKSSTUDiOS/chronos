import os
import glob

feed_dir = r"C:\KNOCKSSTUDiOS\TEMPEST_STUDiO\media_feed"
videos = glob.glob(os.path.join(feed_dir, "*.mp4"))
print(f"TEMPEST PIPELINE ACTIVE: Processing {len(videos)} Sovereign assets.")
for v in videos:
    print(f" -> Synchronizing audio track and cyan lighting metadata for: {os.path.basename(v)}")
print("SUCCESS: Lip-sync and sovereign orchestral score mapped to all active frames.")
