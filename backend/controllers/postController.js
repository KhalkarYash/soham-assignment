const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

const createPost = async (req, res) => {
  try {
    const { content, image, video } = req.body;

    const post = new Post({
      author: req.userId,
      content,
      image,
      video
    });

    await post.save();
    await post.populate('author', 'username profilePic');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const friendIds = user.friends;

    const posts = await Post.find({
      author: { $in: [...friendIds, req.userId] }
    })
      .populate('author', 'username profilePic')
      .populate('comments.author', 'username profilePic')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username profilePic')
      .populate('comments.author', 'username profilePic');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.userId)) {
      post.likes = post.likes.filter(id => !id.equals(req.userId));
    } else {
      post.likes.push(req.userId);
      
      if (!post.author.equals(req.userId)) {
        await Notification.create({
          user: post.author,
          from: req.userId,
          type: 'like',
          post: post._id
        });
      }
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { text, image } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      author: req.userId,
      text,
      image
    });

    await post.save();
    await post.populate('comments.author', 'username profilePic');

    if (!post.author.equals(req.userId)) {
      await Notification.create({
        user: post.author,
        from: req.userId,
        type: 'comment',
        post: post._id
      });
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.author.equals(req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { content, image, video } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.author.equals(req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.content = content || post.content;
    post.image = image || post.image;
    post.video = video || post.video;

    await post.save();
    await post.populate('author', 'username profilePic');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'username profilePic')
      .populate('comments.author', 'username profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getFeed,
  getPost,
  likePost,
  addComment,
  deletePost,
  editPost,
  getUserPosts
};
