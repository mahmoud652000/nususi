const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

dotenv.config();
const app = express();

app.use(express.json());

// إنشاء مجلد uploads تلقائي
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 uploads folder created');
}

// السماح بالوصول للملفات
app.use('/uploads', express.static(uploadDir));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));