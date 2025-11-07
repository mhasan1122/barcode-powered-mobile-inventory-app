const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');

    // Fix email index if it exists incorrectly
    // Drop the old non-sparse unique index and let Mongoose recreate it with sparse: true
    try {
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      
      // Get all indexes
      const indexes = await usersCollection.indexes();
      const emailIndex = indexes.find(idx => idx.key && idx.key.email === 1);
      
      // If email index exists but is not sparse, drop it
      if (emailIndex && !emailIndex.sparse) {
        console.log('Fixing email index: dropping old non-sparse index...');
        await usersCollection.dropIndex('email_1');
        console.log('Old email index dropped. Mongoose will recreate it with sparse: true.');
      }
    } catch (indexError) {
      // Index might not exist or already be correct, which is fine
      if (indexError.code !== 27) { // 27 = IndexNotFound
        console.log('Note: Could not fix email index automatically:', indexError.message);
      }
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

