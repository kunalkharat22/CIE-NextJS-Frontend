# Client Proof Page

This folder contains a standalone presentation page designed to demonstrate the application to clients effectively. It is decoupled from the main app builds and can be hosted separately (e.g., via Netlify Drop or a separate site configuration).

## 📂 Directory Structure

```text
proof/
├── index.html            # Main standalone React page
├── README.md             # This guide
└── assets/
    ├── demo.mp4          # (Optional) Local video file
    └── screens/          # Folder for screenshot images
```

## 🚀 Setup Instructions

### 1. Add Screenshots
1.  Take screenshots of your application flow.
2.  Save them into `proof/assets/screens/`.
3.  **Naming Recommendation:** Use numbered prefixes to keep them organized (e.g., `01-login.png`, `02-dashboard.png`).
4.  Open `proof/index.html` in your code editor.
5.  Update the `SCREENSHOTS` array at the top of the `<script>` block:

    ```javascript
    const SCREENSHOTS = [
      { src: "assets/screens/01-login.png", caption: "Login Page" },
      { src: "assets/screens/02-dashboard.png", caption: "Main Dashboard View" },
      // Add more as needed...
    ];
    ```

### 2. Configure Video
You have two options for the "Video Demo" section.

#### Option A: Embed (Recommended)
Host your video on Loom, YouTube (Unlisted), or Vimeo for better streaming performance.
1.  Upload your video.
2.  Get the embed URL (e.g., `https://www.youtube.com/embed/xyz...`).
3.  Update the config in `proof/index.html`:
    ```javascript
    const VIDEO_EMBED_URL = "https://www.youtube.com/embed/YOUR_VIDEO_ID";
    ```

#### Option B: Local Video
1.  Save your video walkthrough as `demo.mp4` inside `proof/assets/`.
2.  Ensure `VIDEO_EMBED_URL` is set to an empty string `""` in `index.html`.
3.  The page will automatically load `assets/demo.mp4`.
    * **Note:** Keep the video file size small (compressed) to avoid bloating the git repository.

## 🌐 Deployment (Netlify)

To deploy this proof page as a separate link:

1.  Log in to Netlify.
2.  **Add new site** -> **Import from existing project**.
3.  Select this repository.
4.  **Important:** Configure the build settings as follows:
    *   **Base directory:** `proof` (or leave root and set Publish directory to `proof`)
    *   **Publish directory:** `proof` (if your Base is root) OR `.` (if your Base is `proof`)
    *   **Build command:** *(Leave completely empty)*
5.  Deploy.

This will serve the `index.html` directly without running any Next.js/React build processes, creating a fast, standalone proof link.
