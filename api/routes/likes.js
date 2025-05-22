const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const checkAuth = require('../utils/checkAuth');

const prisma = new PrismaClient();

// get likes of current user
router.get('/user/:userId', checkAuth, async (req, res) => {
  try {
    const userLikes = await prisma.like.findMany({
      where: {
        userId: {
          equals: req.params.userId,
        },
      },
    });
    res.status(200).json(userLikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get count of likes current user for faves page
router.get('/userLikes/count/:userId', checkAuth, async (req, res) => {
  try {
    const likeCount = await prisma.like.count({
      where: {
        userId: {
          equals: req.params.userId,
        },
      },
    });
    res.status(200).json(likeCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get likes of current user with postcards for faves page
router.get('/userLikes/:userId', checkAuth, async (req, res) => {
  try {
    const userLikes = await prisma.like.findMany({
      skip: Number(req.query.skip),
      take: Number(req.query.take),
      where: {
        userId: {
          equals: req.params.userId,
        },
      },
      include: {
        postcard: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            likes: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(userLikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add like
router.post('/', checkAuth, async (req, res) => {
  try {
    const like = await prisma.like.create({
      data: {
        userId: req.body.userId,
        postcardId: req.body.postcardId,
      },
    });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete like
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const like = await prisma.like.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(like);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete likes of postcard
router.delete('/postcard/:postcardId', checkAuth, async (req, res) => {
  try {
    const likes = await prisma.like.deleteMany({
      where: {
        postcardId: {
          equals: req.params.postcardId,
        },
      },
    });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
