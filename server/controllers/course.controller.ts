// import { NextFunction, Request, Response } from "express";
// import { CatchAsyncError } from "../middleware/catchAsyncErrors";
// import ErrorHandler from "../utils/ErrorHandler";
// import cloudinary from "cloudinary";
// import { createCourse, getAllCoursesService } from "../services/course.service";
// import CourseModel, { IComment } from "../models/course.model";
// import { redis } from "../utils/redis";
// import mongoose from "mongoose";
// import path from "path";
// import ejs from "ejs";
// import sendMail from "../utils/sendMail";
// import NotificationModel from "../models/notification.Model";
// import axios from "axios";

// // upload course
// // export const uploadCourse = CatchAsyncError(
// //   async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //       const data = req.body;
// //       const thumbnail = data.thumbnail;
// //       if (thumbnail) {
// //         const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
// //           folder: "courses",
// //         });

// //         data.thumbnail = {
// //           public_id: myCloud.public_id,
// //           url: myCloud.secure_url,
// //         };
// //       }
// //       createCourse(data, res, next);
// //     } catch (error: any) {
// //       return next(new ErrorHandler(error.message, 500));
// //     }
// //   }
// // );
// export const uploadCourse = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = req.body;
//       const thumbnail = data.thumbnail;

//       // Check if thumbnail is a string
//       if (thumbnail && typeof thumbnail === 'string') {
//         const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
//           folder: "courses",
//         });

//         data.thumbnail = {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         };
//       }

//       // Create the course with the processed data
//       const course = await CourseModel.create(data);

//       res.status(201).json({
//         success: true,
//         course,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // edit course
// // export const editCourse = CatchAsyncError(
// //   async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //       const data = req.body;

// //       const thumbnail = data.thumbnail;

// //       const courseId = req.params.id;

// //       const courseData = await CourseModel.findById(courseId) as any;

// //       // if (thumbnail && !thumbnail.startsWith("https")) {
// //       if (thumbnail ) {
// //         await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

// //         const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
// //           folder: "courses",
// //         });

// //         data.thumbnail = {
// //           public_id: myCloud.public_id,
// //           url: myCloud.secure_url,
// //         };
// //       }

// //       // if (thumbnail.startsWith("https")) {
// //       //   data.thumbnail = {
// //       //     public_id: courseData?.thumbnail.public_id,
// //       //     url: courseData?.thumbnail.url,
// //       //   };
// //       // }

// //       const course = await CourseModel.findByIdAndUpdate(
// //         courseId,
// //         {
// //           $set: data,
// //         },
// //         { new: true }
// //       );
// //       await redis.set(courseId, JSON.stringify(course)); // update course in redis
// //       res.status(201).json({
// //         success: true,
// //         course,
// //       });
// //     } catch (error: any) {
// //       return next(new ErrorHandler(error.message, 500));
// //     }
// //   }
// // );

// export const editCourse = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = req.body;
//       const courseId = req.params.id;
//       const courseData = await CourseModel.findById(courseId) as any;

//       const thumbnail = data.thumbnail;

//       // If a new thumbnail is provided
//       if (thumbnail && typeof thumbnail === 'string' && !thumbnail.startsWith("http")) {
//         // Destroy the old image if exists
//         if (courseData.thumbnail.public_id) {
//           await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
//         }

//         // Upload the new thumbnail
//         const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
//           folder: "courses",
//         });

//         data.thumbnail = {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         };
//       } else {
//         // Preserve the existing thumbnail if not updated
//         data.thumbnail = courseData.thumbnail;
//       }

//       // Update the course data in the database
//       const course = await CourseModel.findByIdAndUpdate(
//         courseId,
//         {
//           $set: data,
//         },
//         { new: true }
//       );

//       // Update the course in Redis (optional, ensure you have Redis setup correctly)
//       // await redis.set(courseId, JSON.stringify(course));

//       res.status(200).json({
//         success: true,
//         course,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // get single course --- without purchasing
// export const getSingleCourse = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const courseId = req.params.id;
// //at a minute if 100000 people visit the course and details so 100000 hit generate but among them 20 people buy course so our server slows down so maintain this CacheExists code will written
//       const isCacheExist = await redis.get(courseId);

//       if (isCacheExist) {
//         const course = JSON.parse(isCacheExist);
//         res.status(200).json({
//           success: true,
//           course,
//         });
//       } else {
//         const course = await CourseModel.findById(req.params.id).select(
//           "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
//         );

//         await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

//         res.status(200).json({
//           success: true,
//           course,
//         });
//       }
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // get all courses --- without purchasing
// export const getAllCourses = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const courses = await CourseModel.find().select(
//         "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
//       );

//       res.status(200).json({
//         success: true,
//         courses,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // get course content -- only for valid user
// export const getCourseByUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userCourseList = req.user?.courses;
//       const courseId = req.params.id;

//       const courseExists = userCourseList?.find(
//         (course: any) => course._id.toString() === courseId
//       );

//       if (!courseExists) {
//         return next(
//           new ErrorHandler("You are not eligible to access this course", 404)
//         );
//       }

//       const course = await CourseModel.findById(courseId);

//       const content = course?.courseData;

//       res.status(200).json({
//         success: true,
//         content,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // add question in course
// interface IAddQuestionData {
//   question: string;
//   courseId: string;
//   contentId: string;
// }

// export const addQuestion = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { question, courseId, contentId }: IAddQuestionData = req.body;
//       const course = await CourseModel.findById(courseId);

//       if (!mongoose.Types.ObjectId.isValid(contentId)) {
//         return next(new ErrorHandler("Invalid content id", 400));
//       }

//       const couseContent = course?.courseData?.find((item: any) =>
//         item._id.equals(contentId)
//       );

//       if (!couseContent) {
//         return next(new ErrorHandler("Invalid content id", 400));
//       }

//       // create a new question object
//       const newQuestion: any = {
//         user: req.user,
//         question,
//         questionReplies: [],
//       };

//       // add this question to our course content
//       couseContent.questions.push(newQuestion);

//       await NotificationModel.create({
//         user: req.user?._id,
//         title: "New Question Received",
//         message: `You have a new question in ${couseContent.title}`,
//       });

//       // save the updated course
//       await course?.save();

//       res.status(200).json({
//         success: true,
//         course,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // add answer in course question
// interface IAddAnswerData {
//   answer: string;
//   courseId: string;
//   contentId: string;
//   questionId: string;
// }

// export const addAnwser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { answer, courseId, contentId, questionId }: IAddAnswerData =
//         req.body;

//       const course = await CourseModel.findById(courseId);

//       if (!mongoose.Types.ObjectId.isValid(contentId)) {
//         return next(new ErrorHandler("Invalid content id", 400));
//       }

//       const couseContent = course?.courseData?.find((item: any) =>
//         item._id.equals(contentId)
//       );

//       if (!couseContent) {
//         return next(new ErrorHandler("Invalid content id", 400));
//       }

//       const question = couseContent?.questions?.find((item: any) =>
//         item._id.equals(questionId)
//       );

//       if (!question) {
//         return next(new ErrorHandler("Invalid question id", 400));
//       }

//       // create a new answer object
//       const newAnswer: any = {
//         user: req.user,
//         answer,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       // add this answer to our course content
//       question.questionReplies.push(newAnswer);

//       await course?.save();

//       if (req.user?._id === question.user._id) {
//         // create a notification
//         await NotificationModel.create({
//           user: req.user?._id,
//           title: "New Question Reply Received",
//           message: `You have a new question reply in ${couseContent.title}`,
//         });
//       } else {
//         const data = {
//           name: question.user.name,
//           title: couseContent.title,
//         };
        
//         const html = await ejs.renderFile(
//           path.join(__dirname, "../mails/question-reply.ejs"),
//           data
//         );

//         try {
//           await sendMail({
//             email: question.user.email,
//             subject: "Question Reply",
//             template: "question-reply.ejs",
//             data,
//           });
//         } catch (error: any) {
//           return next(new ErrorHandler(error.message, 500));
//         }
//       }

//       res.status(200).json({
//         success: true,
//         course,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // add review in course
// interface IAddReviewData {
//   review: string;
//   rating: number;
//   userId: string;
// }

// export const addReview = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userCourseList = req.user?.courses;

//       const courseId = req.params.id;
      
//       // check if courseId already exists in userCourseList based on _id

//       const courseExists = userCourseList?.some(
//         (course: any) => course._id.toString() === courseId.toString()
//       );
      
//       if (!courseExists) {
//         return next(
//           new ErrorHandler("You are not eligible to access this course", 404)
//         );
//       }

//       const course = await CourseModel.findById(courseId);

//       const { review, rating } = req.body as IAddReviewData;

//       const reviewData: any = {
//         user: req.user,
//         rating,
//         comment: review,
//       };

//       course?.reviews.push(reviewData);

//       let avg = 0;

//       course?.reviews.forEach((rev: any) => {
//         avg += rev.rating;
//       });

//       if (course) {
//         course.ratings = avg / course.reviews.length; // one example we have 2 reviews one is 5 another one is 4 so math working like this = 9 / 2  = 4.5 ratings
//       }

//       await course?.save();

//       await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

//       // create notification
//       await NotificationModel.create({
//         user: req.user?._id,
//         title: "New Review Received",
//         message: `${req.user?.name} has given a review in ${course?.name}`,
//       });


//       res.status(200).json({
//         success: true,
//         course,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // add reply in review
// interface IAddReviewData {
//   comment: string;
//   courseId: string;
//   reviewId: string;
// }
// export const addReplyToReview = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { comment, courseId, reviewId } = req.body as IAddReviewData;

//       const course = await CourseModel.findById(courseId);

//       if (!course) {
//         return next(new ErrorHandler("Course not found", 404));
//       }

//       const review = course?.reviews?.find(
//         (rev: any) => rev._id.toString() === reviewId
//       );

//       if (!review) {
//         return next(new ErrorHandler("Review not found", 404));
//       }

//       const replyData: any = {
//         user: req.user,
//         comment,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       if (!review.commentReplies) {
//         review.commentReplies = [];
//       }

//       review.commentReplies?.push(replyData);

//       await course?.save();

//       await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

//       res.status(200).json({
//         success: true,
//         course,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // get all courses --- only for admin
// export const getAdminAllCourses = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       getAllCoursesService(res);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // Delete Course --- only for admin
// export const deleteCourse = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;

//       const course = await CourseModel.findById(id);

//       if (!course) {
//         return next(new ErrorHandler("course not found", 404));
//       }

//       await course.deleteOne({ id });

//       await redis.del(id);

//       res.status(200).json({
//         success: true,
//         message: "course deleted successfully",
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // generate video url
// export const generateVideoUrl = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { videoId } = req.body;

//       //For videmo video

//       // const {videoUrl}=req.body
//       // const videoId=videoUrl.split("/").pop()

//       const response = await axios.post(
//         `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
//         { ttl: 300 },
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Apisecret ${process.env.VIMEO_API_SECRET}`,
//           },
//         }
//       );
//       res.json(response.data);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );


import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import axios from "axios";




export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      // Check if thumbnail is a string
      if (thumbnail && typeof thumbnail === 'string') {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      // Create the course with the processed data
      const course = await CourseModel.create(data);

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);



// Adding a Year to a Course

export const AddYeartoCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.courseId;
    const { year } = req.body;

    if (!courseId || !year) {
      return res.status(400).json({ success: false, message: 'Course ID and year are required' });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if year already exists
    const yearExists = course.years.some(y => y.year === year);
    if (yearExists) {
      return res.status(400).json({ success: false, message: 'Year already exists' });
    }

    // Add the new year
    course.years.push({ year, subjects: [] });
    await course.save();

    res.status(201).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
})

// Edit Year
export const EditYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId } = req.params;
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ success: false, message: 'Year is required' });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const yearToEdit = course.years.id(yearId);
    if (!yearToEdit) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    yearToEdit.year = year;
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete Year
export const DeleteYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId } = req.params;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const yearToDelete = course.years.id(yearId);
    if (!yearToDelete) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    course.years.pull(yearToDelete._id);
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});



// Adding a Subject to a Year


export const AddSubjectToYear = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { courseId, yearId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Subject name is required" });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const year = course.years.id(yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: "Year not found" });
    }

    year.subjects.push({ name, questions: [] });
    await course.save();

    res.status(201).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
})

// Edit Subject
export const EditSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Subject name is required' });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const year = course.years.id(yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    const subjectToEdit = year.subjects.id(subjectId);
    if (!subjectToEdit) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    subjectToEdit.name = name;
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete Subject
export const DeleteSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId } = req.params;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const year = course.years.id(yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    const subjectToDelete = year.subjects.id(subjectId);
    if (!subjectToDelete) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    year.subjects.pull(subjectToDelete._id);
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});



// Adding a Question to a Subject




export const AddQuestToSubject = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId } = req.params;
    const { text, answers } = req.body;

    if (!text || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "Question text and at least one answer are required" });
    }

    // Upload question image to Cloudinary if the question contains an image
    let processedText = text;
    if (typeof text === 'object' && text.type === 'image' && text.content) {
      const result = await cloudinary.v2.uploader.upload(text.content, {
        folder: 'questions',
      });
      processedText = { ...text, content: result.secure_url };
    }

    // Upload images to Cloudinary if answers contain images
    const uploadedAnswers = await Promise.all(
      answers.map(async (answer: any) => {
        if (answer.type === 'image' && answer.content) {
          const result = await cloudinary.v2.uploader.upload(answer.content, {
            folder: 'answers',
          });
          return {
            ...answer,
            content: result.secure_url,
          };
        }
        return answer;
      })
    );

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const year = course.years.id(yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: "Year not found" });
    }

    const subject = year.subjects.id(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    subject.questions.push({ text: processedText, answers: uploadedAnswers });
    await course.save();

    res.status(201).json({
      success: true,
      course,
      uploadedImages: {
        question: typeof processedText === 'object' && processedText.type === 'image' ? processedText.content : null,
        answers: uploadedAnswers.filter(answer => answer.type === 'image').map(answer => answer.content)
      }
    });

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
})

// Edit Question
export const EditQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId, questionId } = req.params;
    const { text, answers } = req.body;

    if (!text || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'Question text and at least one answer are required' });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const year = course.years.id(yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    const subject = year.subjects.id(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const questionToEdit = subject.questions.id(questionId);
    if (!questionToEdit) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    questionToEdit.text = text;
    questionToEdit.answers = answers;
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete Question
export const DeleteQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, yearId, subjectId, questionId } = req.params;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const year = course.years.id(yearId);
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }

    const subject = year.subjects.id(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const questionToDelete = subject.questions.id(questionId);
    if (!questionToDelete) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    subject.questions.pull(questionToDelete._id);
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});



export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id;
      const courseData = await CourseModel.findById(courseId) as any;

      const thumbnail = data.thumbnail;

      // If a new thumbnail is provided
      if (thumbnail && typeof thumbnail === 'string' && !thumbnail.startsWith("http")) {
        // Destroy the old image if exists
        if (courseData.thumbnail.public_id) {
          await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
        }

        // Upload the new thumbnail
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        // Preserve the existing thumbnail if not updated
        data.thumbnail = courseData.thumbnail;
      }

      // Update the course data in the database
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      // Update the course in Redis (optional, ensure you have Redis setup correctly)
      // await redis.set(courseId, JSON.stringify(course)); 

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get single course --- without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      //at a minute if 100000 people visit the course and details so 100000 hit generate but among them 20 people buy course so our server slows down so maintain this CacheExists code will written
      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses --- without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course content -- only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      couseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${couseContent.title}`,
      });

      // save the updated course
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add answer in course question
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnwser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const question = couseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // add this answer to our course content
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        // create a notification
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Received",
          message: `You have a new question reply in ${couseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: couseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add review in course
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      // check if courseId already exists in userCourseList based on _id

      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length; // one example we have 2 reviews one is 5 another one is 4 so math working like this = 9 / 2  = 4.5 ratings
      }

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      // create notification
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Review Received",
        message: `${req.user?.name} has given a review in ${course?.name}`,
      });


      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add reply in review
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses --- only for admin
export const getAdminAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete Course --- only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("course not found", 404));
      }

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// generate video url
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;

      //For videmo video

      // const {videoUrl}=req.body
      // const videoId=videoUrl.split("/").pop()

      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VIMEO_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
