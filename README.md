# 🍱 Warung App: Smart Menu & QRIS Ordering System

A premium, highly-responsive web application for restaurants and "warungs" designed for seamless digital ordering. Built with React and Vite, this app allows customers to browse menus, add items to a cart, and pay instantly via QRIS.

## ✨ Key Features

-   **Dual Theme System**: Switch between **🌸 Cute Kawaii** (pastel/soft) and **✨ Luxury Gold** (premium/dark) themes via the Admin Panel.
-   **Dynamic Data Source**: Pull your menu directly from a **Google Sheet** or use built-in demo data.
-   **Smart Menu Browsing**:
    -   Categorized items (Makanan, Minuman, Dessert).
    -   Real-time search functionality.
    -   Image support with Google Drive preview integration.
-   **Seamless Checkout**:
    -   Persistent floating cart.
    -   Integrated QRIS payment generator.
    -   Order success tracking and customer/table identification.
-   **Admin Settings**:
    -   Instant theme switching.
    -   Merchant name customization.
    -   Google Sheet configuration (ID and Sheet Name).
    -   Persistent settings saved to `localStorage`.

## 🎨 Themes

### 🌸 Cute Kawaii
Designed for cafes and sweet shops. Features:
-   Pastel color palette (Pink, Cream, Brown).
-   Playful typography (`Cherry Bomb One` & `Quicksand`).
-   Dashed borders and soft, bouncy animations.

### ✨ Luxury Gold
Designed for fine dining and high-end restaurants. Features:
-   Dark mode aesthetic (Black & Gold).
-   Elegant typography (`Playfair Display` & `DM Sans`).
-   Sharp lines and premium gradients.

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   npm or yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone [repository-url]
    cd kasir-google
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## 📊 Google Sheets Integration

To use your own menu:
1.  Create a Google Sheet with the following headers in the first row:
    `name`, `category`, `price`, `description`, `image`, `emoji`
2.  Fill in your data.
3.  Go to **File** > **Share** > **Publish to web**.
4.  Copy the **Sheet ID** from the URL (the long string between `/d/` and `/edit`).
5.  Open the **Admin Settings** (Gear icon ⚙) in the app, toggle to **Sheet**, and paste your ID.

## 🛠 Tech Stack
-   **React**: UI components and state management.
-   **Vite**: Fast build tool and dev server.
-   **FontAwesome**: Iconography.
-   **Google Fonts**: Premium typography.
-   **CSS Variables**: Theme orchestration.

## 📄 License
MIT License. Feel free to use and modify for your own business!
