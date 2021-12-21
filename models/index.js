const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

User.hasMany(Comment, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION"
});

Post.hasMany(Comment, {
    foreignKey: "post_id",
    onUpdate: "NO ACTION"
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
    onUpdate: "NO ACTION"
});

Comment.belongsTo(Post, {
    foreignKey: 'postId',
    onDelete: "CASCADE",
    onUpdate: "NO ACTION"
});

Comment.belongsTo(User, {
    foreignKey: 'userId',
    onUpdate: "NO ACTION",
    onDelete: "CASCADE"
});

module.exports = { User, Post, Comment };