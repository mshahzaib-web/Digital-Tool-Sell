const Tool = require('../models/Tool');

// @desc    Get all tools (with filters, sorting, search, and pagination)
// @route   GET /api/tools
// @access  Public
const getTools = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All Categories' && category !== '') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by search query
    if (search) {
      query.$or = [
        { toolName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc' || sort === 'priceAsc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc' || sort === 'priceDesc') {
      sortOptions = { price: -1 };
    }

    // Pagination calculation
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Tool.countDocuments(query);
    const tools = await Tool.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: tools.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      tools
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tools' });
  }
};

// @desc    Get latest tools (fetch only 6 newest tools)
// @route   GET /api/latest-tools
// @access  Public
const getLatestTools = async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 }).limit(6);
    res.json({ success: true, count: tools.length, tools });
  } catch (error) {
    console.error('Error fetching latest tools:', error);
    res.status(500).json({ success: false, message: 'Server error fetching latest tools' });
  }
};

// @desc    Search tools by query parameter
// @route   GET /api/search
// @access  Public
const searchTools = async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) {
      return res.json({ success: true, tools: [] });
    }

    const tools = await Tool.find({
      $or: [
        { toolName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    });

    res.json({ success: true, count: tools.length, tools });
  } catch (error) {
    console.error('Error searching tools:', error);
    res.status(500).json({ success: false, message: 'Server error searching tools' });
  }
};

// @desc    Get all categories with tool count
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    // Default categories from the mockups
    const defaultCategories = [
      'Design & AI Tools',
      'SEO Tools',
      'AI Tools',
      'Writing Tools',
      'Streaming Services'
    ];

    // Aggregate tool counts grouped by category
    const aggregates = await Tool.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countsMap = {};
    aggregates.forEach(item => {
      if (item._id) {
        countsMap[item._id] = item.count;
      }
    });

    // Merge default categories and dynamic ones from database
    const categoriesList = [...defaultCategories];
    Object.keys(countsMap).forEach(cat => {
      if (!categoriesList.includes(cat)) {
        categoriesList.push(cat);
      }
    });

    const categories = categoriesList.map(catName => ({
      name: catName,
      count: countsMap[catName] || 0
    }));

    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
};

// @desc    Get single tool details (includes related tools in the same category)
// @route   GET /api/tools/:id
// @access  Public
const getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    // Fetch related tools in the same category (excluding current tool, limit to 3)
    const relatedTools = await Tool.find({
      category: tool.category,
      _id: { $ne: tool._id }
    }).limit(3);

    res.json({ success: true, tool, relatedTools });
  } catch (error) {
    console.error('Error fetching tool details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tool details' });
  }
};

// @desc    Create new tool
// @route   POST /api/tools
// @access  Private (Admin Protected)
const createTool = async (req, res) => {
  try {
    const {
      toolName,
      image,
      category,
      price,
      pricingType,
      description,
      features,
      stockStatus,
      deliveryTime,
      sellerNotes,
      websiteUrl,
      rating,
      discount
    } = req.body;

    // Validation
    if (!toolName || !image || !category || price === undefined || !pricingType || !description) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    // Parse features if they come as string or array
    let processedFeatures = [];
    if (typeof features === 'string') {
      processedFeatures = features.split('\n').map(f => f.trim()).filter(f => f.length > 0);
    } else if (Array.isArray(features)) {
      processedFeatures = features.map(f => String(f).trim()).filter(f => f.length > 0);
    }

    const tool = await Tool.create({
      toolName,
      image,
      category,
      price: Number(price),
      pricingType,
      description,
      features: processedFeatures,
      stockStatus,
      deliveryTime,
      sellerNotes,
      websiteUrl,
      rating: rating ? Number(rating) : 5,
      discount: discount ? Number(discount) : 0
    });

    res.status(201).json({ success: true, message: 'Tool created successfully', tool });
  } catch (error) {
    console.error('Error creating tool:', error);
    res.status(500).json({ success: false, message: 'Server error creating tool' });
  }
};

// @desc    Update an existing tool
// @route   PUT /api/tools/:id
// @access  Private (Admin Protected)
const updateTool = async (req, res) => {
  try {
    const {
      toolName,
      image,
      category,
      price,
      pricingType,
      description,
      features,
      stockStatus,
      deliveryTime,
      sellerNotes,
      websiteUrl,
      rating,
      discount
    } = req.body;

    let tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    // Parse features if they come as string or array
    let processedFeatures = tool.features;
    if (features !== undefined) {
      if (typeof features === 'string') {
        processedFeatures = features.split('\n').map(f => f.trim()).filter(f => f.length > 0);
      } else if (Array.isArray(features)) {
        processedFeatures = features.map(f => String(f).trim()).filter(f => f.length > 0);
      }
    }

    const updatedData = {
      toolName: toolName || tool.toolName,
      image: image || tool.image,
      category: category || tool.category,
      price: price !== undefined ? Number(price) : tool.price,
      pricingType: pricingType || tool.pricingType,
      description: description || tool.description,
      features: processedFeatures,
      stockStatus: stockStatus || tool.stockStatus,
      deliveryTime: deliveryTime || tool.deliveryTime,
      sellerNotes: sellerNotes !== undefined ? sellerNotes : tool.sellerNotes,
      websiteUrl: websiteUrl !== undefined ? websiteUrl : tool.websiteUrl,
      rating: rating !== undefined ? Number(rating) : tool.rating,
      discount: discount !== undefined ? Number(discount) : tool.discount
    };

    tool = await Tool.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({ success: true, message: 'Tool updated successfully', tool });
  } catch (error) {
    console.error('Error updating tool:', error);
    res.status(500).json({ success: false, message: 'Server error updating tool' });
  }
};

// @desc    Delete a tool
// @route   DELETE /api/tools/:id
// @access  Private (Admin Protected)
const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    await Tool.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Error deleting tool:', error);
    res.status(500).json({ success: false, message: 'Server error deleting tool' });
  }
};

module.exports = {
  getTools,
  getLatestTools,
  searchTools,
  getCategories,
  getToolById,
  createTool,
  updateTool,
  deleteTool
};
