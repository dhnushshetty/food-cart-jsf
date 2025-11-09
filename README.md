# 🍕 Nitte Foodies: A Local Vendor Food Platform

`Nitte Foodies` is a full-stack, multi-vendor food ordering platform built with Java Spring Boot and Thymeleaf. This project is designed to promote local restaurants and food vendors in and around the **Nitte, Karnataka** area, providing a modern, seamless ordering experience for students and residents.

The platform allows shop owners to register, manage their own digital storefront, and process orders, while customers can browse all local options, build a cart, and place orders.

## ✨ Features

### 🧑‍🍳 For Shop Owners (`ROLE_OWNER`)

  * **Secure Registration:** Owners can register an account which automatically creates their own shop profile.
  * **Shop Management:** Update shop details, including name, address, and description.
  * **Image Upload:** Upload a custom shop image (with validation and preview) which is stored in the database as a Base64 string.
  * **Menu Management:** Full **CRUD** (Create, Read, Update, Delete) control over menu items, including name, price, description, and image.
  * **Order Dashboard:** View a real-time queue of new and active orders placed at their shop.
  * **Status Updates:** Update the status of an order (e.g., from `PENDING` to `PREPARING` to `READY`).
  * **Statistics Page:** View a dashboard with key metrics like total revenue, new orders, and top-selling items.

### 🧑‍💻 For Customers (`ROLE_CUSTOMER`)

  * **Browse Shops:** See a "DoorDash-like" card view of all 15 registered local vendors.
  * **View Menus:** Click any shop to view its full, detailed menu.
  * **Smart Cart:** Add items to a shopping cart. The cart intelligently enforces a **"one-shop-at-a-time"** rule (you must clear your cart to order from a new shop).
  * **Place Orders:** Securely place an order, which is then sent to the shop owner's dashboard.
  * **Order History:** View a list of all past orders and their status.
  * **Responsive Design:** A fully mobile-first, responsive UI that works on any device.

## 🛠️ Tech Stack

| Backend | Frontend | Database |
| :--- | :--- | :--- |
| **Java 17+** | **Thymeleaf** | **MySQL** |
| **Spring Boot 3** | **HTML5** | |
| **Spring Security (JWT)** | **CSS3 & JavaScript** | |
| **Spring Data JPA** | (Animated & Responsive) | |
| **Maven** | | |

-----

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### Prerequisites

You will need the following tools installed on your system:

  * **Java JDK 17** or newer
  * **Apache Maven**
  * **MySQL Server** & **MySQL Workbench** (or any SQL client)

### 1\. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2\. Database Setup

1.  Open MySQL Workbench and connect to your local MySQL server.

2.  Create the database. The application is configured for a database named `food_cart_db`.

    ```sql
    CREATE DATABASE food_cart_db;
    ```

3.  **Check Configuration:** The project is pre-configured to connect to this database. Verify that `src/main/resources/application.properties` has the correct settings:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/food_cart_db
    spring.datasource.username=root
    spring.datasource.password=toor
    spring.jpa.hibernate.ddl-auto=update
    ```

    (You can change `username` and `password` to match your MySQL setup).

4.  **(Optional) Populate the Database:** When you first run the app, Hibernate (`ddl-auto=update`) will create all the tables for you. To fill the app with the 15 demo restaurants and their menus, run the SQL script below in MySQL Workbench.

\<details\>
\<summary\>Click to view the SQL script to populate all 15 vendors\</summary\>

```sql
-- First, clear any old data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE cart;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE shops;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Set your database to be the one we are working with
USE food_cart_db;

-- Hashed password for all owners (original password is "Password123" with a capital P)
SET @hashed_password = '$2a$10$nFGCoCTT33rhhDHZ6ALO.OZinVYi9YeHibwAimftxwPO9xSMmgR7y';
-- Placeholder base64 image
SET @base64_placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhqsRwwAAAABJRU5ErkJggg==';

-- --- 1. Harshitha Restaurant ---
INSERT INTO users (username, email, password, role) VALUES ('harshitha_owner', 'harshitha@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner1_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Harshitha Restaurant', 'Your stop for non-veg, biryani, and Chinese!', 'Sajaya Complex, Nitte', @owner1_id, @base64_placeholder);
SET @shop1_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Chicken Ghee Roast', 'Mangalorean special, rich and spicy', 280.00, @shop1_id, @base64_placeholder),
('Gobi Manchurian', 'Crispy cauliflower in a tangy sauce', 140.00, @shop1_id, @base64_placeholder);

-- --- 2. Hebbar Restaurant ---
INSERT INTO users (username, email, password, role) VALUES ('hebbar_owner', 'hebbar@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner2_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Hebbar Restaurant', 'Pure vegetarian Tindi, Tiffin, and Meals', 'Near NMAMIT College, Nitte', @owner2_id, @base64_placeholder);
SET @shop2_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Ghee Rice', 'Fragrant rice cooked with pure ghee', 100.00, @shop2_id, @base64_placeholder),
('Paneer Butter Masala', 'Creamy paneer in a rich tomato gravy', 220.00, @shop2_id, @base64_placeholder);

-- --- 3. Sanmathi Cafe (K B) ---
INSERT INTO users (username, email, password, role) VALUES ('sanmathi_owner', 'sanmathi@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner3_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Sanmathi Cafe (K B)', 'Burgers, Fries, and Shakes', 'Hostel Road, Nitte', @owner3_id, @base64_placeholder);
SET @shop3_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Classic Chicken Burger', 'Crispy chicken patty with lettuce and mayo', 150.00, @shop3_id, @base64_placeholder),
('Oreo Milkshake', 'Thick shake blended with Oreo cookies', 140.00, @shop3_id, @base64_placeholder);

-- --- 4. Ratna Forever Hotel ---
INSERT INTO users (username, email, password, role) VALUES ('ratna_owner', 'ratna@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner4_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Ratna Forever Hotel', 'Multi-cuisine dining & Bar', 'Karkala Padubidri Road, Nitte', @owner4_id, @base64_placeholder);
SET @shop4_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Anjal Tawa Fry', 'Kingfish steak marinated and pan-fried', 350.00, @shop4_id, @base64_placeholder),
('Kingfisher Premium (650ml)', 'Beer (Bar Item)', 160.00, @shop4_id, @base64_placeholder);

-- --- 5. RANGANATH CAFE ---
INSERT INTO users (username, email, password, role) VALUES ('ranganath_owner', 'ranganath@karkala.com', @hashed_password, 'ROLE_OWNER');
SET @owner5_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('RANGANATH CAFE', '100-year-old heritage snacks and tiffins', 'Anekere Road, Karkala', @owner5_id, @base64_placeholder);
SET @shop5_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Masale Dose', 'The original Karkala-style Masala Dosa', 35.00, @shop5_id, @base64_placeholder),
('Filter Coffee', 'Strong and authentic filter coffee', 15.00, @shop5_id, @base64_placeholder);

-- --- 6. BigBite Karkala ---
INSERT INTO users (username, email, password, role) VALUES ('bigbite_owner', 'bigbite@karkala.com', @hashed_password, 'ROLE_OWNER');
SET @owner6_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('BigBite Karkala', 'Burgers, Sundaes, and Fun', 'Banglegudde, Karkala', @owner6_id, @base64_placeholder);
SET @shop6_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Death By Chocolate Sundae', 'Brownie, choco-fudge, and ice cream', 80.00, @shop6_id, @base64_placeholder),
('Chicken Zinger Burger', 'Crispy Zinger-style chicken burger', 130.00, @shop6_id, @base64_placeholder);

-- --- 7. Kitchen Bells ---
INSERT INTO users (username, email, password, role) VALUES ('kitchen_owner', 'kitchenbells@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner7_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Kitchen Bells', 'Quick bites and fresh juice', 'Nitte', @owner7_id, @base64_placeholder);
SET @shop7_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Chicken Shawarma Roll', 'Pita wrap with roasted chicken and garlic mayo', 120.00, @shop7_id, @base64_placeholder),
('Pani Puri', 'A plate of 6 puris, with pani and filling', 40.00, @shop7_id, @base64_placeholder);

-- --- 8. Drink Hub ---
INSERT INTO users (username, email, password, role) VALUES ('drinkhub_owner', 'drinkhub@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner8_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Drink Hub', 'Fresh Juices, Milkshakes, and Mojitos', 'Shisha Food Court, Nitte', @owner8_id, @base64_placeholder);
SET @shop8_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Virgin Mint Mojito', 'Classic non-alcoholic mojito', 90.00, @shop8_id, @base64_placeholder),
('Nutella Waffle', 'Fresh waffle topped with Nutella', 160.00, @shop8_id, @base64_placeholder);

-- --- 9. Taste of Haven ---
INSERT INTO users (username, email, password, role) VALUES ('haven_owner', 'haven@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner9_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Taste of Haven', 'Cakes, Pastries, and Bakery Delights', 'Kallya, Near Nitte Parapady', @owner9_id, @base64_placeholder);
SET @shop9_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Red Velvet Pastry', 'A slice of rich red velvet cake', 90.00, @shop9_id, @base64_placeholder),
('Chicken Puff', 'Flaky pastry with a spicy chicken filling', 30.00, @shop9_id, @base64_placeholder);

-- --- 10. Salt and Pepper ---
INSERT INTO users (username, email, password, role) VALUES ('saltpepper_owner', 'saltpepper@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner10_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Salt and Pepper', 'Family restaurant serving Indian & Chinese', 'Kallya, Nitte', @owner10_id, @base64_placeholder);
SET @shop10_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Chicken Lollipop', 'Spicy fried chicken drumettes', 250.00, @shop10_id, @base64_placeholder),
('Fish Thali', 'Rice, Anjal fry, and fish curry', 150.00, @shop10_id, @base64_placeholder);

-- --- 11. Halli Mane Restaurant ---
INSERT INTO users (username, email, password, role) VALUES ('hallimane_owner', 'hallimane@nitte.com', @hashed_password, 'ROLE_OWNER');
SET @owner11_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Halli Mane Restaurant', 'Authentic Naati-style non-veg food', 'Karkala Road, Nitte', @owner11_id, @base64_placeholder);
SET @shop11_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Mutton Biryani', 'Naati-style biryani with tender mutton', 280.00, @shop11_id, @base64_placeholder),
('Naati Koli Fry', 'Spicy country chicken fry', 300.00, @shop11_id, @base64_placeholder);

-- --- 12. Sanman Regency ---
INSERT INTO users (username, email, password, role) VALUES ('sanman_owner', 'sanman@karkala.com', @hashed_password, 'ROLE_OWNER');
SET @owner12_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Sanman Regency', 'Fine Dine, Lodging & Bar', 'Near Bus Stand, Karkala', @owner12_id, @base64_placeholder);
SET @shop12_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Prawns Ghee Roast', 'Classic Mangalorean prawns', 320.00, @shop12_id, @base64_placeholder),
('Tuborg Green (650ml)', 'Beer (Bar Item)', 180.00, @shop12_id, @base64_placeholder);

-- --- 13. Rockside Resto Bar ---
INSERT INTO users (username, email, password, role) VALUES ('rockside_owner', 'rockside@karkala.com', @hashed_password, 'ROLE_OWNER');
SET @owner13_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Rockside Resto Bar', 'Bar, Restaurant & Lodging', 'Salmar, Karkala', @owner13_id, @base64_placeholder);
SET @shop13_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Tandoori Chicken (Full)', 'Whole chicken marinated and grilled', 450.00, @shop13_id, @base64_placeholder),
('Heineken (650ml)', 'Beer (Bar Item)', 240.00, @shop13_id, @base64_placeholder);

-- --- 14. Ribbons and Balloons ---
INSERT INTO users (username, email, password, role) VALUES ('ribbons_owner', 'ribbons@karkala.com', @hashed_password, 'ROLE_OWNER');
SET @owner14_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Ribbons and Balloons', 'Cakes, Pastries and Savouries', 'Near Bus Stand, Karkala', @owner14_id, @base64_placeholder);
SET @shop14_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Chocolate Truffle Cake (1/2 Kg)', 'Rich layered chocolate cake', 550.00, @shop14_id, @base64_placeholder),
('Chicken 65 Roll', 'Spicy Chicken 65 in a wrap', 90.00, @shop14_id, @base64_placeholder);

-- --- 15. Hotel Savita ---
INSERT INTO users (username, email, password, role) VALUES ('savita_owner', 'savita@karkala.com', @hashed_password, 'ROLE_OWNER');
SET @owner15_id = LAST_INSERT_ID();
INSERT INTO shops (shop_name, description, address, owner_id, image_url) VALUES ('Hotel Savita', 'Rooftop Family Bar & Restaurant', 'Salmar, Karkala', @owner15_id, @base64_placeholder);
SET @shop15_id = LAST_INSERT_ID();
INSERT INTO menu_items (name, description, price, shop_id, image_url) VALUES
('Masala Dosa', 'Classic South Indian Dosa', 50.00, @shop15_id, @base64_placeholder),
('Kingfisher Ultra (650ml)', 'Beer (Bar Item)', 200.00, @shop15_id, @base64_placeholder);

SELECT 'Successfully created 15 owners, 15 shops, and populated all menus.' AS Status;
```

\</details\>

### 3\. Run the Application

You can run the application from your terminal using Maven:

```bash
./mvnw spring-boot:run
```

Or, you can run the main application class (`FoodCartPlatformApplication.java`) directly from your Kiro AI IDE.

The application will start on `http://localhost:8080`.

-----

## DEMO: How to Use

Once the application is running, you can test all features using the pre-built accounts.

### 🔑 Demo Accounts (Shop Owners)

The password for **all 15 shop owners** is: **`Password123`** (with a capital 'P')

| Shop Name | Username (ID) |
| :--- | :--- |
| Harshitha Restaurant | `harshitha_owner` |
| Hebbar Restaurant | `hebbar_owner` |
| Sanmathi Cafe (K B) | `sanmathi_owner` |
| Ratna Forever Hotel | `ratna_owner` |
| RANGANATH CAFE | `ranganath_owner` |
| BigBite Karkala | `bigbite_owner` |
| Kitchen Bells | `kitchen_owner` |
| Drink Hub | `drinkhub_owner` |
| ...and so on for all 15. |

### 🧑‍💻 Customer Account

To test the customer experience, please use the "Register" page to create a new customer account.

## 📸 Screenshots
<img width="1920" height="1080" alt="Screenshot 2025-11-09 224743" src="https://github.com/user-attachments/assets/08edd8a8-529e-4523-9a5b-a4692c37f0cb" />
<img width="1920" height="1080" alt="Screenshot 2025-11-09 224938" src="https://github.com/user-attachments/assets/dd209f48-cd0d-4d67-8495-60f9f53b416f" />
<img width="1920" height="1080" alt="Screenshot 2025-11-09 224946" src="https://github.com/user-attachments/assets/f2b71907-21c3-4ac2-ba6c-0a6a0d48793c" />
<img width="1920" height="1080" alt="Screenshot 2025-11-09 225014" src="https://github.com/user-attachments/assets/433533f2-0c43-434d-a4bf-b582ba901491" />
<img width="1920" height="1080" alt="Screenshot 2025-11-09 225034" src="https://github.com/user-attachments/assets/40dc4507-e115-430f-ac36-124a7b50a0de" />
<img width="1920" height="1080" alt="Screenshot 2025-11-09 225043" src="https://github.com/user-attachments/assets/3462dfc2-8866-4f02-acec-30f6f8d87caa" />
<img width="1920" height="1080" alt="Screenshot 2025-11-09 225112" src="https://github.com/user-attachments/assets/81d3deca-584f-47fc-add6-3f19493c45bb" />
<img width="1920" height="1080" alt="Screenshot 2025-11-09 225124" src="https://github.com/user-attachments/assets/602d6737-8d48-4eb4-8f7f-2f182e3c24a1" />
<img width="1920" height="1080" alt="Screenshot 2025-11-09 225131" src="https://github.com/user-attachments/assets/bb875cbd-fa54-4863-9038-7915c5920886" />



## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
