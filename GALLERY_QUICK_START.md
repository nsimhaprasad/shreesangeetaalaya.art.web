# Gallery Quick Start Guide

## What's Been Implemented

A complete photo gallery system with two integration options:
1. **Google Photos** - Embed a shared Google Photos album (recommended)
2. **Local Folder** - Upload photos to the server manually

---

## Quick Start: Using Google Photos (Recommended)

### Step 1: Create a Google Photos Album

1. Go to [Google Photos](https://photos.google.com)
2. Create a new album or select an existing one
3. Add photos to the album
4. Click the **Share** button
5. Turn ON **"Create link"** to make it public
6. **Copy the shared URL** - it will look like:
   - `https://photos.app.goo.gl/XYZ123ABC456`

### Step 2: Configure in LMS Admin

1. Start your Rails server:
   ```bash
   cd /home/user/shreesangeetaalaya.art.web/lms-app
   bin/dev
   ```

2. Login as an admin user

3. Navigate to: **`/admin/gallery`**

4. Configure the settings:
   - ✅ Check **"Enable Gallery"**
   - ✅ Check **"Use Google Photos"**
   - Enter a **Gallery Title** (e.g., "Photo Gallery")
   - Enter a **Description** (optional)
   - **Paste the Google Photos URL** you copied
   - Click **"Save Settings"**

5. Click **"Preview Gallery"** to view

### Step 3: View the Gallery

The gallery is now available at:
- **Public:** `http://localhost:3000/gallery`
- **Students:** `http://localhost:3000/student/gallery` (requires login)
- **Teachers:** `http://localhost:3000/teacher/gallery` (requires login)

---

## Quick Start: Using Local Folder

### Step 1: Configure in LMS Admin

1. Navigate to: **`/admin/gallery`**

2. Configure the settings:
   - ✅ Check **"Enable Gallery"**
   - ❌ **UNCHECK** "Use Google Photos"
   - Enter a **Gallery Title**
   - Enter a **Description** (optional)
   - Click **"Save Settings"**

### Step 2: Upload Photos

Upload image files to the folder:
```bash
/home/user/shreesangeetaalaya.art.web/lms-app/public/gallery/
```

Supported formats: JPG, JPEG, PNG, GIF, WebP

Example:
```bash
# Copy photos to the gallery folder
cp ~/my-photos/*.jpg /home/user/shreesangeetaalaya.art.web/lms-app/public/gallery/
```

### Step 3: View the Gallery

Photos will appear automatically at:
- **Public:** `http://localhost:3000/gallery`
- **Students:** `http://localhost:3000/student/gallery`
- **Teachers:** `http://localhost:3000/teacher/gallery`

---

## Gallery Features

### Google Photos Mode
- Full album embed with zoom and navigation
- Automatic updates when you add photos to the album
- No server storage needed
- Professional appearance

### Local Folder Mode
- Responsive photo grid
- **Lightbox viewer** for full-size photos
- **Keyboard navigation:**
  - `←` Previous photo
  - `→` Next photo
  - `Esc` Close
- Photos sorted by newest first

---

## Admin Routes

| URL | Purpose |
|-----|---------|
| `/admin/gallery` | Configure gallery settings |

## Public/User Routes

| URL | Description | Authentication |
|-----|-------------|----------------|
| `/gallery` | Public gallery | None |
| `/student/gallery` | Student gallery | Student login required |
| `/teacher/gallery` | Teacher gallery | Teacher login required |

---

## Example: Setting up Google Photos

1. **Create Album:**
   - Open Google Photos
   - Click "+" → "Album"
   - Add photos
   - Name your album

2. **Share Album:**
   - Click "Share" icon
   - Toggle ON "Create link"
   - Click "Copy link"
   - URL example: `https://photos.app.goo.gl/XYZ123`

3. **Configure in LMS:**
   - Go to `/admin/gallery`
   - Enable gallery
   - Choose "Use Google Photos"
   - Paste the URL
   - Save

4. **Done!** Gallery is live at `/gallery`

---

## Example: Setting up Local Folder

1. **Upload Photos:**
   ```bash
   # Example: Copy photos from Downloads
   cp ~/Downloads/event-photos/*.jpg /home/user/shreesangeetaalaya.art.web/lms-app/public/gallery/
   ```

2. **Configure in LMS:**
   - Go to `/admin/gallery`
   - Enable gallery
   - UNCHECK "Use Google Photos"
   - Save

3. **Done!** Photos appear at `/gallery`

---

## Troubleshooting

### Google Photos not showing?

**Issue:** Iframe shows error or blank page

**Solution:**
1. Verify album is publicly shared (toggle ON "Create link")
2. Test URL in a new browser tab
3. Make sure URL is complete (starts with `https://`)
4. Check that album ID was extracted (visible in admin settings)

### Local photos not appearing?

**Issue:** Gallery shows "No photos available"

**Solution:**
1. Verify photos are in `public/gallery/` folder
2. Check file extensions are supported (.jpg, .png, etc.)
3. Ensure "Use Google Photos" is UNCHECKED in settings
4. Refresh the gallery page

### Gallery not accessible?

**Issue:** 404 or access denied

**Solution:**
1. Verify "Enable Gallery" is checked in `/admin/gallery`
2. For student/teacher views, ensure you're logged in
3. Check that Rails server is running

---

## File Locations

```
lms-app/
├── app/
│   ├── controllers/
│   │   ├── admin/gallery_controller.rb          # Admin settings
│   │   ├── public/gallery_controller.rb         # Public view
│   │   ├── student/gallery_controller.rb        # Student view
│   │   └── teacher/gallery_controller.rb        # Teacher view
│   ├── models/
│   │   └── gallery_setting.rb                   # Settings model
│   └── javascript/Pages/
│       ├── Admin/Gallery/Settings.jsx           # Admin UI
│       ├── Public/Gallery/Index.jsx             # Public UI
│       ├── Student/Gallery/Index.jsx            # Student UI
│       └── Teacher/Gallery/Index.jsx            # Teacher UI
└── public/
    └── gallery/                                  # Local photos folder
        └── README.md                             # Instructions
```

---

## Next Steps

1. ✅ Test the gallery with Google Photos
2. ✅ Test the gallery with local photos
3. ✅ Share gallery URL with users
4. 📝 Add photos regularly
5. 🎨 Customize title and description

---

## Support

For detailed implementation information, see:
- **Full Documentation:** `GALLERY_IMPLEMENTATION.md`
- **Model Code:** `app/models/gallery_setting.rb`
- **Admin Controller:** `app/controllers/admin/gallery_controller.rb`

Enjoy your new gallery! 📸
