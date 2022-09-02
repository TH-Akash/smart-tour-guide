import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import { createError } from "../middleware/error.js";
// metching learning library inport 
import MonkeyLearn from "monkeylearn"
// creating a post

let model_id = 'cl_pi3C7JiL'
export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id).populate([
      {
        path: "reviews.user",
        select: "firstname lastname  username profilePicture",
      },
      { path: "userId", select: "profilePicture firstname lastname  username " },
    ]);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPostByDistrict = async (req, res) => {

  const id = req.params.id;



  try {
    const post = await PostModel.find({ district: id }).populate([
      {
        path: "reviews.user",
        select: "firstname lastname  username profilePicture",
      },
      { path: "userId", select: "profilePicture firstname lastname  username " },
    ]);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }






}
export const getPosts = async (req, res) => {

  const { search } = req.query


  // {$or:[{region: "NA"},{sector:"Some Sector"}]}
  let queary = {};

  if (search?.length >= 2) {

    queary.title = new RegExp(search, "i")
    // queary.userName = new RegExp(search, "i")
  }



  try {
    const post = await PostModel.find(queary.title ? { $or: [{ title: queary.title }, { userName: queary.title }, { desc: queary.title }] } : {}).populate([
      {
        path: "reviews.user",
        select: "firstname lastname  username profilePicture ",
      },
      { path: "userId", select: "firstname lastname  username profilePicture" },
    ]).sort({ _id: -1 })
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};
// export const getPostById = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const post = await PostModel.findById(id);
//     res.status(200).json(post);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// update post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated!");
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) { }
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;



  try {
    const post = await PostModel.findByIdAndDelete(id);


    res.status(200).json("Post deleted.");

  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post disliked");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};


export const createReview = async (req, res, next) => {
  const { rating, comment } = req.body;



  try {
    const touristPlace = await PostModel.findById({ _id: req.params.id });

    if (touristPlace) {


      const alreadyReviewed = touristPlace.reviews.find(
        (r) => r.user.toString() === req.body._id.toString()
      );

      if (alreadyReviewed) {
        return next(createError(409, " already reviewed"));
      }

      try {

        const ml = new MonkeyLearn('094ac73bdb91029e92422b751948a1b39bd6cb82')

        // metching learning to filtter review 
        let data = [comment]

        let res = await ml.classifiers.classify(model_id, data)

        //  tag_name
        // Positive

        let tagName = res.body[0].classifications[0].tag_name
        let confidence = res.body[0].classifications[0].confidence * 100

        // console.log(confidence, tagName)

        if (tagName === "Negative" || (tagName === "Neutral" && confidence < 80)) {

          return next(createError(409, "You comment is biolate our community guidelines and policies. you cann't post this type of comments"));

        } else {

          try {

            // console.log("success")

            //  save review on database


            const review = {
              rating: Number(rating),
              comment,
              user: req.body._id,
            };

            touristPlace.reviews.push(review);

            touristPlace.numReviews = touristPlace.reviews.length;

            touristPlace.rating =
              touristPlace.reviews.reduce((acc, item) => item.rating + acc, 0) /
              touristPlace.reviews.length;

            const res = await touristPlace.save();
            res.status(201).json({ message: "Review added", success: true });



          } catch (error) {

            return next(error);

          }


        }

      } catch (error) {
        return next(error);
      }
    } else {
      return next(createError(404, "product not found"));
    }
  } catch (error) {
    next(error);
  }
};