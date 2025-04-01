const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const checkUserExists = require("./middlewares/checkUser");
const sequelize = require("./configs/database"); // Using the Sequelize instance from configs
const authMiddleware = require('./middlewares/auth');

require("dotenv").config(); // Load environment variables

/*------- Import Routes -------*/
const userRoutes = require("./routes/usersRoute");
const projectRoutes = require("./routes/projectRoutes");
const imageUploadRoutes = require("./routes/imageUploadRoutes");
const emailUpdateRoutes = require("./routes/EmailUpdateRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const phoneUpdatesRoutes = require("./routes/PhoneUpdateRoutes");
const socialMediaRoutes = require("./routes/SocialLinkRoutes");
const otherContentRoutes = require("./routes/OtherRoutes");
const commentRoutes = require("./routes/commentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const supportCompanyRoutes = require("./routes/SupportCompanyRouter");
const headContentRoutes = require('./routes/headContentRoutes');
const CoreValuesRoutes = require('./routes/CoreValuesRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const contentOneRoutes = require('./routes/contentOneRoutes');
const contentTwoRoutes = require('./routes/contentTwoRoutes');
const contentThreeRoutes = require('./routes/contentThreeRoutes');
const ImpactRoutes = require("./routes/ImpactRoutes");
const SlideHomeRouter = require("./routes/SliderHomeRoutes");
const SlideNewsRouter = require("./routes/SliderNewsRoutes");
const SlideProjectRouter = require("./routes/SliderProjectRoutes");
const SlideSupportRouter = require("./routes/SliderSupportRoutes");
const projectStatusRoutes = require('./routes/projectStatusRoutes');
const productRoutes = require('./routes/productRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const touristAttractionRoutes = require('./routes/touristAttractionRoutes');
const touristAttractionCategoryRoutes = require('./routes/touristAttractionCategoryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const newsCategoryRoutes = require('./routes/newsCategoryRoutes');
const productSlideRoutes = require('./routes/productSlideRoutes');
const productAdsRoutes = require('./routes/productAdsRoutes');
const touristAttractionSlideRoutes = require('./routes/touristAttractionSlideRoutes');
const touristAttractionAdsRoutes = require('./routes/touristAttractionAdsRoutes');
const visionMissionRoutes = require('./routes/visionMissionRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');

/*------- Express App Setup -------*/
const app = express();

app.use(cors());

// Body parsing middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for images
app.use('/ImageUpload', express.static(path.join(__dirname, 'ImageUpload')));

// Serve static files


console.log(path.join(__dirname, 'ImageUpload'));

// Apply user check middleware
app.use(checkUserExists);

/*------- API Routes -------*/
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/imageUpload", imageUploadRoutes);
app.use("/api/email-updates", emailUpdateRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/phone-updates", phoneUpdatesRoutes);
app.use("/api/social-links", socialMediaRoutes);
app.use("/api/other-contents", otherContentRoutes);
app.use("/api/team", teamRoutes);
app.use("/api", commentRoutes);
app.use("/api/supportcompanies", supportCompanyRoutes);
app.use('/api/head-contents', headContentRoutes);
app.use('/api/core-values', CoreValuesRoutes);
app.use('/api/performances', performanceRoutes);
app.use('/api/content-ones', contentOneRoutes);
app.use('/api/content-twos', contentTwoRoutes);
app.use('/api/content-threes', contentThreeRoutes);
app.use("/api/impact", ImpactRoutes);
app.use("/api/sliders-home", SlideHomeRouter);
app.use("/api/sliders-news", SlideNewsRouter);
app.use("/api/sliders-project", SlideProjectRouter);
app.use("/api/sliders-support", SlideSupportRouter);
app.use("/api/project-status", projectStatusRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/tourist-attractions', touristAttractionRoutes);
app.use('/api/tourist-attraction-categories', touristAttractionCategoryRoutes);
app.use('/api/tourist-attraction-ads', touristAttractionAdsRoutes);
app.use('/api/tourist-attraction-slides', touristAttractionSlideRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/news-categories', newsCategoryRoutes);
app.use('/api/product-slides', productSlideRoutes);
app.use('/api/product-ads', productAdsRoutes);
app.use('/api/vision-mission', visionMissionRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);

// Add this error handling middleware after your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

/*------- Database Connection and Sync -------*/
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");

    // Just sync without modifying tables
    sequelize
      .sync()
      .then(() => {
        console.log("Database & tables synced!");
        
        const PORT = process.env.PORT || 3600;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
      })
      .catch((err) => {
        console.error("Unable to sync the database:", err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process if the connection fails
  });
module.exports = sequelize;

