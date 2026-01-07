# 🌌 Galactic Warp

**Galactic Warp** is a retro-style space shooter mini-app built for **Farcaster Frames**. Pilot your ship, blast through waves of enemies, and compete for the top spot on the global leaderboard.

![Galactic Warp Banner](/public/opengraph-image.png)

## 🚀 Features

*   **Mini-App Ready**: Optimized for Farcaster Frames (v2) with mobile-responsive design and touch controls.
*   **Web3 Integration**:
    *   **Mint to Play**: 0.00001 ETH entry ticket (on Base Sepolia/Base).
    *   **OnchainKit**: Seamless wallet connection and transaction management.
*   **Gameplay**:
    *   **The Void**: Infinite survival mode with increasing difficulty.
    *   **Combat**: Dynamic enemy spawning, projectile physics, and collision detection.
    *   **Stats**: Track Lives, Score, and Wave progress.
*   **Social**:
    *   **Global Leaderboard**: Compete with other players for the highest score.
    *   **Player Profile**: View your personal stats and high scores.
*   **Tech**: Built with Next.js 16 (Turbopack), Firebase (Firestore), and Tailwind CSS.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/)
*   **Blockchain**: [OnchainKit](https://onchainkit.xyz/) + [Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Database**: [Firebase](https://firebase.google.com/) (Firestore)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📦 Installation

**IMPORTANT**: This project relies on specific versions of `wagmi` and `@coinbase/onchainkit` for compatibility.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Dianaabasi/Galactic-warp.git
    cd Galactic-warp
    ```

2.  **Install dependencies**:
    > **Note**: Use `--legacy-peer-deps` if you encounter peer dependency warnings.
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```bash
    # OnchainKit / WalletConnect
    NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key
    NEXT_PUBLIC_WC_PROJECT_ID=your_reown_project_id

    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Mobile & Farcaster Support

*   **Responsive**: The game renders correctly on mobile devices.
*   **Touch Controls**: When accessed on mobile (or simulated mobile view), a virtual D-Pad and Fire button overlay will appear automatically.
*   **Frame Metadata**: Ready for Farcaster Frame Validator testing.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
