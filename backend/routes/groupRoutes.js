const express = require("express");
const router = express.Router();

const {
  newGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  addMember,

  deleteMember,
  getGroupPosts,
  addPost,
  deletePost,
} = require("../controllers/groupController");
const {isAuthenticated, authorize} = require('../middlewares/auth')

router.route("/").post(isAuthenticated,newGroup);
router.route("/:id").get(isAuthenticated,getGroup);
router.route("/update/:id").put(isAuthenticated,updateGroup);
router.route("/delete/:id").delete(isAuthenticated,deleteGroup);
router.route("/:id/addmember").post(isAuthenticated,addMember);
router.route("/:id/deletemember").delete(isAuthenticated,deleteMember);
router.route("/:id/getposts").get(isAuthenticated,getGroupPosts);
router.route("/:id/addpost").post(isAuthenticated,addPost);
router.route("/:id/deletepost").delete(isAuthenticated,deletePost);

module.exports = router;