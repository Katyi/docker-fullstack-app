const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const checkAuth = require('../utils/checkAuth');

const prisma = new PrismaClient();

// Get all albums of user
router.get('/user/:userId', checkAuth, async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
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
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get count all albums of user
router.get('/user/count/:userId', checkAuth, async (req, res) => {
  try {
    const albumCount = await prisma.album.count({
      where: {
        userId: {
          equals: req.params.userId,
        },
      },
    });
    res.status(200).json(albumCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get album by id
router.get('/:id', checkAuth, async (req, res) => {
  try {
    const album = await prisma.album.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//create album
router.post('/', checkAuth, async (req, res) => {
  try {
    const album = await prisma.album.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId,
        // imageUrl: req.body.imageUrl,
      },
    });

    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update album
router.put('/:id', async (req, res) => {
  try {
    const album = await prisma.album.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
      },
    });
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete album
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const album = await prisma.album.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
