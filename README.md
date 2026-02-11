# HypeShelf

**Collect and share the stuff you're hyped about.**

HypeShelf is a simple, clean web application where users can log in and share their favorite movies and recommendations in one public shelf. Built with modern web technologies, it provides a seamless experience for both public browsing and authenticated user interactions.

## 🎯 Features

### Public Experience
- **Browse Recommendations**: View a public list of the latest recommendations from all users
- **Search & Filter**: Search recommendations by title, genre, description, or author, and filter by genre
- **Read-Only Access**: Public users can view all recommendations without authentication
- **Sign In Prompt**: Clear call-to-action to sign in and add your own recommendations

### Authenticated User Features
- **Create Recommendations**: Add new recommendations with:
  - Title
  - Genre(s) - select from predefined genres or use custom ones
  - Link (URL) to the movie/content
  - Short blurb describing the recommendation
  - Display name (shown as "Added by")
- **View All Recommendations**: See all recommendations from all users
- **Delete Own Recommendations**: Users can delete only their own recommendations
- **Genre Filtering**: Filter recommendations by genre with multi-select support
- **Search Functionality**: Search across titles, genres, descriptions, and links

### Admin Features
- **Delete Any Recommendation**: Admins can delete recommendations from any user
- **Staff Picks**: Admins can mark recommendations as "Staff Pick" to highlight quality content
- **Full Access**: Complete control over all recommendations in the system

### User Experience
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean UI**: Minimal, modern interface with intuitive navigation
- **Real-time Updates**: Recommendations update in real-time using Convex

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/) - Secure user authentication and management
- **Backend/Database**: [Convex](https://www.convex.dev/) - Real-time backend with automatic API generation
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)
- A [Clerk](https://clerk.com/) account
- A [Convex](https://www.convex.dev/) account

## 💻 Platform-Specific Setup

### Linux Setup

#### Installing Node.js and npm

**Option 1: Using NodeSource (Recommended for Ubuntu/Debian)**

```bash
# Update package index
sudo apt update

# Install curl if not already installed
sudo apt install -y curl

# Add NodeSource repository (for Node.js 20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

**Option 2: Using nvm (Node Version Manager)**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell configuration
source ~/.bashrc  # or ~/.zshrc if using zsh

# Install Node.js LTS version
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

**Option 3: Using Package Manager (Ubuntu/Debian)**

```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Verify installation
node --version
npm --version
```

**For Fedora/RHEL/CentOS:**

```bash
# Install Node.js and npm
sudo dnf install -y nodejs npm

# Verify installation
node --version
npm --version
```

**For Arch Linux:**

```bash
# Install Node.js and npm
sudo pacman -S nodejs npm

# Verify installation
node --version
npm --version
```

#### Installing Git

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y git
```

**Fedora/RHEL/CentOS:**
```bash
sudo dnf install -y git
```

**Arch Linux:**
```bash
sudo pacman -S git
```

#### Installing pnpm (Optional)

```bash
# Using npm
npm install -g pnpm

# Or using standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Linux-Specific Notes

- If you encounter permission errors when installing global packages, you may need to configure npm to use a different directory or use `sudo` (not recommended for security reasons)
- For better security, consider using a Node version manager like `nvm` or `fnm`
- Some Linux distributions may have older Node.js versions in their repositories; using NodeSource or nvm is recommended for the latest versions

### macOS Setup

#### Installing Homebrew (Package Manager)

If you don't have Homebrew installed:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to your PATH (for Apple Silicon Macs)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# For Intel Macs, Homebrew is typically installed to /usr/local
```

#### Installing Node.js and npm

**Option 1: Using Homebrew (Recommended)**

```bash
# Install Node.js (includes npm)
brew install node

# Verify installation
node --version
npm --version
```

**Option 2: Using nvm (Node Version Manager)**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell configuration
source ~/.zshrc  # or ~/.bash_profile if using bash

# Install Node.js LTS version
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

**Option 3: Using Official Installer**

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the macOS installer (.pkg file)
3. Run the installer and follow the prompts
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Installing Git

**Using Homebrew:**
```bash
brew install git
```

**Or download from:**
- Visit [git-scm.com/download/mac](https://git-scm.com/download/mac)
- Or use Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

#### Installing pnpm (Optional)

```bash
# Using Homebrew
brew install pnpm

# Or using npm
npm install -g pnpm

# Or using standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### macOS-Specific Notes

- **Apple Silicon (M1/M2/M3)**: Most tools work natively, but if you encounter issues, you may need to use Rosetta 2 for some packages
- **Permissions**: You may need to grant Terminal full disk access in System Preferences → Security & Privacy → Privacy → Full Disk Access
- **Xcode Command Line Tools**: Some npm packages may require Xcode Command Line Tools. Install with: `xcode-select --install`
- **Shell**: macOS Catalina and later use `zsh` as the default shell. If you're using `nvm`, make sure to add it to `~/.zshrc` instead of `~/.bash_profile`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Hypeshelf
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Clerk Authentication

1. Create a new application in the [Clerk Dashboard](https://dashboard.clerk.com/)
2. Copy your Clerk publishable key and secret key
3. Create a JWT template in Clerk:
   - Go to **JWT Templates** → **New template** → choose **Convex**
   - Name must be **`convex`** (do not rename)
   - Copy the **Issuer** URL (e.g. `https://xxx.clerk.accounts.dev`)

### 4. Set Up Convex Backend

1. Install Convex CLI globally (if not already installed):
   ```bash
   npm install -g convex
   ```

2. Initialize Convex in your project:
   ```bash
   npx convex dev
   ```
   This will:
   - Create a new Convex project (or connect to existing one)
   - Set up the Convex dashboard
   - Start the development backend

3. Set the Clerk JWT issuer in Convex:
   ```bash
   npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://YOUR_ISSUER.clerk.accounts.dev"
   ```
   Replace `YOUR_ISSUER` with the issuer URL from step 3 of Clerk setup.

   Alternatively, set it in the Convex Dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add: `CLERK_JWT_ISSUER_DOMAIN` = your Issuer URL

4. Redeploy Convex to pick up the new environment variable:
   ```bash
   npx convex dev
   ```

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

You can find these values in:
- **Clerk keys**: Clerk Dashboard → API Keys
- **Convex URL**: Convex Dashboard → Settings → Deployment URL

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 7. Create Your First User

1. Sign in to the application using Clerk
2. Create your first recommendation - this will automatically create your user record in the database
3. Note: User records are created only when you create your first recommendation (not on sign-in only)

## 📁 Project Structure

```
Hypeshelf/
├── app/                          # Next.js App Router directory
│   ├── _components/              # Reusable React components
│   │   ├── Footer.tsx            # Footer component
│   │   ├── HomeContent.tsx       # Main home page content
│   │   ├── PublicRecommendationsSection.tsx  # Recommendations display with filtering
│   │   ├── RecommendationList.tsx            # Recommendation list component
│   │   └── ThemeToggle.tsx       # Dark/light mode toggle
│   ├── _lib/                     # Utility libraries
│   │   ├── genres.ts             # Genre definitions
│   │   └── linkPreview.ts        # Link preview utilities
│   ├── recommendations/          # Recommendation routes
│   │   └── new/                  # New recommendation form
│   │       └── page.tsx
│   ├── sign-in/                  # Clerk sign-in route
│   ├── sign-up/                  # Clerk sign-up route
│   ├── ConvexClientProvider.tsx  # Convex React provider wrapper
│   ├── ThemeProvider.tsx         # Theme context provider
│   ├── UnregisteredUserGuard.tsx # User registration guard
│   ├── layout.tsx                # Root layout with auth and providers
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── convex/                       # Convex backend
│   ├── _generated/               # Auto-generated Convex files
│   ├── auth.config.ts            # Clerk authentication configuration
│   ├── recommendations.ts        # Recommendation mutations and queries
│   ├── schema.ts                 # Database schema definitions
│   └── users.ts                  # User-related queries and mutations
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── requirements.md               # Project requirements
└── README.md                     # This file
```

## 🔐 Security & Role-Based Access Control

HypeShelf implements robust security measures:

### Authentication
- All authenticated operations require valid Clerk JWT tokens
- Convex validates tokens using the configured Clerk issuer
- Unauthenticated users can only view recommendations (read-only)

### Role-Based Access Control (RBAC)

#### User Role (Default)
- ✅ Create recommendations
- ✅ Delete own recommendations only
- ❌ Cannot delete other users' recommendations
- ❌ Cannot mark staff picks

#### Admin Role
- ✅ Create recommendations
- ✅ Delete any recommendation (own or others')
- ✅ Mark/unmark recommendations as "Staff Pick"
- Full administrative control

### Security Implementation
- Server-side validation in Convex mutations ensures users can only perform permitted actions
- Role checks are performed on the backend, not just the frontend
- User ownership is verified before allowing deletion
- All mutations throw descriptive errors for unauthorized actions

## 🎨 Key Features Explained

### Genre System
- Predefined genres: Action, Adventure, Comedy, Drama, Horror, Fantasy
- Support for custom genres (users can type their own)
- Multi-genre support (comma-separated)
- Genre filtering with multi-select capability

### Staff Picks
- Admins can mark any recommendation as a "Staff Pick"
- Staff picks are visually highlighted with a badge
- Toggle functionality to add/remove staff pick status

### Search & Filter
- Real-time search across:
  - Recommendation titles
  - Genres
  - Descriptions (blurbs)
  - Links
  - Author names
- Genre filtering with "All" option to clear filters
- Combined search and filter functionality

## 🧪 Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

### Convex Development

- `npx convex dev` - Start Convex development backend with hot reload
- `npx convex deploy` - Deploy Convex backend to production

### Code Structure Best Practices

- **Components**: Organized in `_components` directory for reusability
- **Utilities**: Shared logic in `_lib` directory
- **Type Safety**: Full TypeScript coverage with Convex-generated types
- **Error Handling**: Comprehensive error messages for user feedback
- **Accessibility**: ARIA labels and semantic HTML throughout

## 📝 Notes

- User records are created automatically when a user creates their first recommendation
- The public recommendations list is limited to the latest 50 recommendations
- All timestamps are stored as Unix timestamps (milliseconds)
- Link previews use fallback thumbnails when previews are unavailable

## 🤝 Contributing

This is a project built according to specific requirements. For modifications or contributions, please ensure:
- Code follows TypeScript best practices
- Security measures are maintained
- Role-based access control is properly implemented
- UI remains clean and minimal

## 📄 License

[Add your license information here]

---

**Built with ❤️ using Next.js, Clerk, and Convex**
