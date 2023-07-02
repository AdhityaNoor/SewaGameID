import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import Order from '../models/orderModel.js'

// @desc        Auth user & get token
// @route       POST /api/users/login
// @access      Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Email atau Kata Sandi tidak valid')
  }
})

// @desc        Register a new user
// @route       POST /api/users
// @access      Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User sudah ada')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: {
        address: '',
        city: '',
        postalCode: '',
        phoneNumber: '',
      },
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Detail yang dimasukan tidak sesuai')
  }
})

// @desc        Get user profile
// @route       GET /api/users/profile
// @access      Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User tidak ditemukan')
  }
})

// @desc        Update user profile
// @route       PUT /api/users/profile
// @access      Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  console.log(req.body.address)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.address.address = req.body.address.address || user.address.address
    user.address.city = req.body.address.city || user.address.city
    user.address.postalCode =
      req.body.address.postalCode || user.address.postalCode
    user.address.phoneNumber =
      req.body.address.phoneNumber || user.address.phoneNumber
    if (req.body.password) {
      user.password = req.body.password
    }

    const updateUser = await user.save()

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      address: {
        address: updateUser.address.address,
        city: updateUser.address.city,
        postalCode: updateUser.address.postalCode,
        phoneNumber: updateUser.address.phoneNumber,
      },
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User tidak ditemukan')
  }
})

// @desc        Get all users
// @route       GET /api/users
// @access      Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc        Delete a user
// @route       DELETE /api/users/:id
// @access      Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    if (user.hasPaidOrders) {
      res.status(403)
      throw new Error('User dengan pesanan terbayar tidak dapat dihapus.')
    }
    await Order.deleteMany({ user: req.params.id })
    await user.remove()
    res.json({ message: 'User telah dihapus' })
  } else {
    res.status(404)
    throw new Error('User tidak ditemukan')
  }
})

// @desc        Get a user by ID
// @route       GET /api/users/:id
// @access      Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User tidak ditemukan')
  }
})

// @desc        Update user
// @route       PUT /api/users/:id
// @access      Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updateUser = await user.save()

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User tidak ditemukan')
  }
})

export {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  updateUser,
  getUserById,
  getUsers,
  deleteUser,
}
