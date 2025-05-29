const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const checkAuth = require('../utils/checkAuth');

const prisma = new PrismaClient();

// Get count all postcards of user
router.get('/count/:userId', async (req, res) => {
  try {
    const postcardCount = await prisma.postcard.count({
      where: {
        userId: {
          equals: req.params.userId,
        },
      },
    });
    res.status(200).json(postcardCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get postcards of current user
router.get('/user/:userId', checkAuth, async (req, res) => {
  try {
    const postcards = await prisma.postcard.findMany({
      skip: Number(req.query.skip),
      take: Number(req.query.take),
      where: {
        userId: {
          equals: req.params.userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(postcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get count of public postcards of user
router.get('/count/public/:userId', async (req, res) => {
  try {
    const postcardCount = await prisma.postcard.count({
      where: {
        userId: {
          equals: req.params.userId,
        },
        public: {
          equals: true,
        },
      },
    });
    res.status(200).json(postcardCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get public postcards of user
router.get('/public/:userId', async (req, res) => {
  try {
    const postcards = await prisma.postcard.findMany({
      skip: Number(req.query.skip),
      take: Number(req.query.take),
      where: {
        userId: {
          equals: req.params.userId,
        },
        public: {
          equals: true,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(postcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get count all public postcards of all users
router.get('/publicCount', async (req, res) => {
  try {
    const postcardCount = await prisma.postcard.count({
      where: {
        public: {
          equals: true,
        },
      },
    });
    res.status(200).json(postcardCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get public postcards of all users in page
router.get('/public', async (req, res) => {
  try {
    const postcards = await prisma.postcard.findMany({
      skip: Number(req.query.skip),
      take: Number(req.query.take),
      where: {
        public: {
          equals: true,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json(postcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get count of all postcards in album by albumId
router.get('/inalbum/count/:albumId', checkAuth, async (req, res) => {
  try {
    const postcardCount = await prisma.postcard.count({
      where: {
        albumId: {
          equals: req.params.albumId,
        },
      },
    });
    res.status(200).json(postcardCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all postcards in album by albumId
router.get('/inalbum/:albumId', checkAuth, async (req, res) => {
  try {
    const postcards = await prisma.postcard.findMany({
      skip: Number(req.query.skip),
      take: Number(req.query.take),
      where: {
        albumId: {
          equals: req.params.albumId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(postcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get one postcard by id
router.get('/:id', async (req, res) => {
  try {
    const postcard = await prisma.postcard.findUnique({
      where: {
        id: req.params.id,
        // userId: Number(req.params.userId),
      },
    });
    res.status(200).json(postcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//create new postcard
router.post('/', checkAuth, async (req, res) => {
  try {
    const postcard = await prisma.postcard.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        tag: req.body.tag,
        public: req.body.public,
        albumId: req.body.albumId,
        userId: req.body.userId,
      },
    });

    res.status(201).json(postcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update postcard (not used yet)
router.put('/:id', async (req, res) => {
  try {
    const postcard = await prisma.postcard.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        albumId: req.body.albumId,
        likes: req.body.likes,
      },
    });
    res.status(200).json(postcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete postcard
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const postcard = await prisma.postcard.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(postcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
