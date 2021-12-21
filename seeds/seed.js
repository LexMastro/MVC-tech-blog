const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        await sequelize.query("SET FOREIGN_KEY_CHECKS=0;")
        console.log({ userData });
        const users = await User.bulkCreate(userData, {
            individualHooks: true,
            returning: true,
        });
        const posts = await Post.bulkCreate(postData, {
            individualHooks: true,
            returning: true,
        });
        const comments = await Comment.bulkCreate(commentData, {
            individualHooks: true,
            returning: true,
            cascade: true,
        });
        await sequelize.query("SET FOREIGN_KEY_CHECKS=1;")




        process.exit(0);
    } catch (error) {
        console.log(error)
    }
};

seedDatabase();