const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const AdDimensionsRoutes = require("./modules/adDimensions/adDimensions.routes");
const AdsRoutes = require("./modules/ads/ads.routes");
const CategoriesRoutes = require("./modules/categories/categories.routes");
const CategoryProductSpecificationsRoutes = require("./modules/categoryProductSpecifications/categoryProductSpecifications.routes");
const ChatsRoutes = require("./modules/chats/chats.routes");
const MessagesRoutes = require("./modules/messages/messages.routes");
const ProductCategoriesRoutes = require("./modules/productCategories/productCategories.routes");
const ProductColorsRoutes = require("./modules/productColors/productColors.routes");
const ProductImagesRoutes = require("./modules/productImages/productImages.routes");
const ProductReviewsRoutes = require("./modules/productReviews/productReviews.routes");
const ProductsRoutes = require("./modules/products/products.routes");
const ProductStatsRoutes = require("./modules/productStats/productStats.routes");
const PromotedProductsRoutes = require("./modules/promotedProducts/promotedProducts.routes");
const ReelsRoutes = require("./modules/reels/reels.routes");
const ShopCalendersRoutes = require("./modules/shopCalenders/shopCalenders.routes");
const ShopDocumentsRoutes = require("./modules/shopDocuments/shopDocuments.routes");
const ShopsRoutes = require("./modules/shops/shops.routes");
const ReelStatsRoutes = require("./modules/reelStats/reelStats.routes");
const ShopsSubscriptionsRoutes = require("./modules/shopSubscriptions/shopSubscriptions.routes");
const ShopViewRoutes = require("./modules/shopViews/shopViews.routes");
const SubscriptionRoutes = require("./modules/subscriptions/subscriptions.routes");
const UserRoutes = require("./modules/users/users.routes");
const FavoritesRoutes = require("./modules/favorites/favorites.routes");
const ShopFollowersRoutes = require("./modules/shopFollowers/shopFollowers.routes");
const OrdersRoutes = require("./modules/orders/orders.routes");
const OrderedProductsRoutes = require("./modules/orderedProducts/orderedProducts.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const {
  usersTag,
  adsTag,
  categoriesTag,
  chatsTag,
  messagesTag,
  productCategoriesTag,
  productColorsTag,
  productImagesTag,
  productReviewsTag,
  productsTag,
  productStatsTag,
  promotedProductsTag,
  reelsTag,
  shopCalendersTag,
  shopDocumentsTag,
  shopsTag,
  shopsSubscriptionsTag,
  shopViewsTag,
  subscriptionsTag,
  categoryProductSpecificationsTag,
  adDimensionsTag,
  ordersTag,
  orderedProductsTag,
  shopFollowersTag,
  favoritesTag,
  reelStatsTag,
} = require("./utils/apiSwaggerTags");
const { Server } = require("socket.io");
// const responseTime = require("express-response-time");
// app.use(responseTime());
app.use("/files", express.static("files"));
app.use("/extracted", express.static("extracted"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));
//routes
app.use("/ad-dimensions", adDimensionsTag, AdDimensionsRoutes);
app.use("/ads", adsTag, AdsRoutes);
app.use("/categories", categoriesTag, CategoriesRoutes);
app.use("/chats", chatsTag, ChatsRoutes);
app.use("/messages", messagesTag, MessagesRoutes);
app.use("/product-categories", productCategoriesTag, ProductCategoriesRoutes);
app.use("/product-colors", productColorsTag, ProductColorsRoutes);
app.use("/product-images", productImagesTag, ProductImagesRoutes);
app.use("/product-reviews", productReviewsTag, ProductReviewsRoutes);
app.use("/products", productsTag, ProductsRoutes);
app.use("/product-stats", productStatsTag, ProductStatsRoutes);
app.use("/reel-stats", reelStatsTag, ReelStatsRoutes);
app.use("/promoted-products", promotedProductsTag, PromotedProductsRoutes);
app.use("/reels", reelsTag, ReelsRoutes);
app.use("/shop-calenders", shopCalendersTag, ShopCalendersRoutes);
app.use("/shop-documents", shopDocumentsTag, ShopDocumentsRoutes);
app.use("/shop-followers", shopFollowersTag, ShopFollowersRoutes);
app.use("/shops", shopsTag, ShopsRoutes);
app.use("/favorites", favoritesTag, FavoritesRoutes);
app.use("/orders", ordersTag, OrdersRoutes);
app.use("/ordered-products", orderedProductsTag, OrderedProductsRoutes);
app.use(
  "/shops-subscriptions",
  shopsSubscriptionsTag,
  ShopsSubscriptionsRoutes
);
app.use("/shop-views", shopViewsTag, ShopViewRoutes);
app.use("/subscriptions", subscriptionsTag, SubscriptionRoutes);
app.use("/users", usersTag, UserRoutes);
app.use(
  "/category-product-specifications",
  categoryProductSpecificationsTag,
  CategoryProductSpecificationsRoutes
);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// const options = {
//   key: fs.readFileSync("/etc/letsencrypt/live/api.exactonline.co.tz/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/api.exactonline.co.tz/fullchain.pem"),
// };
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (Adjust in production)
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // Listen for incoming messages
  socket.on("sendMessage", (data) => {
    // console.log("Message received:", data);
    console.log("Message received", data);
    io.emit("receiveMessage", data); // Broadcast to all clients
  });
  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
app.get("/", (req, res) => {
  try {
    res.send("Server is working fine");
  } catch (error) {}
});

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
