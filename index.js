const Course = require("./models/course");
const Department = require("./models/department");
const Module = require("./models/module");
const User = require("./models/user");
const LevelOfStudy = require("./models/levelOfStudy");
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authenticateToken = require("./authentication/authController");
const Session = require("./models/session");



const jwt = require("jsonwebtoken");
const authToken = require("./authentication/authenticateToken");
const app = express();

const corsOptions = {
  origin: [
    "https://courses-catalogue-front.vercel.app",
    "https://katalogpredmeta.fon.bg.ac.rs",
    "http://localhost:3000",
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

//Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

//Root route
app.get("/", (req, res) => {
  res.send("Server is running :)");
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is live on port: ${port}`);
});
//connection string
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.3qxgdoi.mongodb.net/courses-catalogue"
);

const conn = mongoose.connection;

conn.once("open", () => {
  console.log("MongoDB connection is open. ");
});

const router = express.Router();

router.use(bodyParser.json());

router.route("/courses").get((req, res) => {
  Course.find({})
    .exec()
    .then((courses) => {
      res.json(courses);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error occurred while fetching courses");
    });
});

router.route("/filteredCourses").get(async (req, res) => {
  const {
    selectedLevelOfStudy,
    selectedProgram,
    selectedModule,
    selectedSemester,
    selectedYearOfStudy,
    selectedDepartments,
    tagsToSearch,
  } = req.query;

  const query = {};

  if (selectedLevelOfStudy) {
    if (Array.isArray(selectedLevelOfStudy)) {
      query.level_of_study = { $in: selectedLevelOfStudy };
    } else {
      query.level_of_study = { $regex: selectedLevelOfStudy, $options: "i" };
    }
  }

  if (selectedProgram) {
    if (Array.isArray(selectedProgram)) {
      query.program = { $in: selectedProgram };
    } else {
      query.program = { $regex: selectedProgram, $options: "i" };
    }
  }

  if (selectedModule) {
    if (Array.isArray(selectedModule)) {
      query.modules = { $in: selectedModule };
    } else {
      query.modules = { $regex: selectedModule, $options: "i" };
    }
  }

  if (selectedSemester) {
    if (
      selectedSemester.includes("летњи") &&
      selectedSemester.includes("зимски")
    ) {
      //this returns every course
    } else if (selectedSemester.includes("летњи")) {
      query.semester = { $in: ["други", "четврти", "шести", "осми"] };
    } else if (selectedSemester.includes("зимски")) {
      query.semester = { $in: ["први", "трећи", "пети", "седми"] };
    }
  }

  if (selectedYearOfStudy) {
    if (Array.isArray(selectedYearOfStudy)) {
      query.year_of_study = { $in: selectedYearOfStudy };
    } else {
      query.year_of_study = { $regex: selectedYearOfStudy, $options: "i" };
    }
  }

  if (selectedDepartments) {
    if (Array.isArray(selectedDepartments)) {
      query.departments = { $in: selectedDepartments };
    } else {
      query.departments = { $regex: selectedDepartments, $options: "i" };
    }
  }
  if (tagsToSearch) {
    if (Array.isArray(tagsToSearch)) {
      query.tags = { $in: tagsToSearch };
    } else {
      query.tags = { $regex: tagsToSearch, $options: "i" };
    }
  }

  try {
    const courses = await Course.find(query).exec();

    res.json(courses);
  } catch (err) {
    console.error(err);
    // Handle the error
  }
});

router.route("/departments").get((req, res) => {
  console.log("Departments fetch working.");
  Department.find({})
    .exec()
    .then((departments) => {
      res.json(departments);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error occurred while fetching departments");
    });
});

router.route("/modules").get((req, res) => {
  console.log("Modules fetch working.");
  Module.find({})
    .exec()
    .then((modules) => {
      res.json(modules);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error occurred while fetching modules");
    });
});

router.route("/levelsofstudy").get((req, res) => {
  console.log("Levels of study fetch working.");
  LevelOfStudy.find({})
    .exec()
    .then((levelsOfStudy) => {
      res.json(levelsOfStudy);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error occured while fetching levelsOfStudy");
    });
});

router.post("/api/courses", authenticateToken, async (req, res) => {
  try {
    const {
      course_id,
      name,
      level_of_study,
      program,
      modules,
      semester,
      departments,
      year_of_study,
      lecturers,
      lecture_session_time,
      exercise_session_time,
      description,
      note,
      literature,
      tags,
      link,
      video,
      status,
      espb,
    } = req.body;

    const course = new Course({
      course_id,
      name,
      level_of_study,
      program,
      modules,
      semester,
      departments,
      year_of_study,
      lecturers,
      lecture_session_time,
      exercise_session_time,
      description,
      note,
      literature,
      tags,
      link,
      video,
      status,
      espb,
    });

    await course.save();

    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error("Error saving course:", error);
    if (error.name === "ValidationError") {
      // If validation fails (e.g., required fields are missing), return a 400 Bad Request
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors,
      });
    } else {
      // For other types of errors, return a 500 Internal Server Error
      res
        .status(500)
        .json({ success: false, error: "Failed to save the course" });
    }
  }
});

//tag search
router.route("/api/tags/:query").get((req, res) => {
  const query = req.params.query;
  const regex = new RegExp(`^${query}`, "i");

  Course.distinct("tags", { tags: { $regex: regex } })
    .exec()
    .then((tags) => {
      res.json(tags);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    });
});

router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }

    // Compare the provided password directly with the stored password
    if (password === user.password) {
      const token = jwt.sign({ userId: user._id }, "your-secret-key", {
        expiresIn: "1h",
      });
      res.json({ access_token: token });
    } else {
      return res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.route("/protected-route").get(authenticateToken, (req, res) => {
  console.log("Successfull authentication.");
});

router
  .route("/api/courses/:courseId")
  .get(async (req, res) => {
    const courseId = req.params.courseId;

    try {
      const course = await Course.findOne({ _id: courseId }).exec();

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json(course);
      console.log("Course successfully fetched!");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  })
  .delete(async (req, res) => {
    const courseId = req.params.courseId;

    try {
      const deletedCourse = await Course.findOneAndDelete({
        _id: courseId,
      }).exec();

      if (!deletedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
router.put("/api/courses/:courseId", authenticateToken, async (req, res) => {
  const courseId = req.params.courseId; // Dobijanje ID-ja kursa iz rute
  const updatedCourseData = req.body; // Dobijanje ažuriranih podataka o kursu iz tela zahteva

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course-to-update not found." });
    }

    course.name = updatedCourseData.name;
    course.semester = updatedCourseData.semester;
    course.level_of_study = updatedCourseData.levelOfStudy;
    course.program = updatedCourseData.program;
    course.modules = updatedCourseData.modules;
    course.departments = updatedCourseData.departments;
    course.year_of_study = updatedCourseData.yearOfStudy;
    course.lecturers = updatedCourseData.lecturers;
    course.espb = updatedCourseData.espb;
    course.lecture_session_time = updatedCourseData.lectureSessionTimes;
    course.exercise_session_time = updatedCourseData.exerciseSessionTimes;
    course.literature = updatedCourseData.literatures;
    course.link = updatedCourseData.link;
    course.video = updatedCourseData.video;
    course.description = updatedCourseData.description;
    course.content = updatedCourseData.content;
    course.tags = updatedCourseData.tags;
    course.status = updatedCourseData.status;

    await course.save();

    console.log("Course updated successfully:", course);

    res.json({ success: true, message: "Course updated successfully" });
  } catch (error) {
    console.error("Error during course update:", error);
    res.status(500).json({
      success: false,
      error: "There is an error during course update.",
    });
  }
});

router.route("/api/courses/delete").post(async (req, res) => {
  const { courseIds } = req.body;

  try {
    const deletedCourses = await Course.deleteMany({
      _id: { $in: courseIds },
    }).exec();

    if (!deletedCourses) {
      return res.status(404).json({ error: "No courses found" });
    }

    res.json({ message: "Courses deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// router.route("/api/sessions").get(async (req, res) => {
//   const { selectedProgram, selectedModule, level_of_study, name } = req.query;

//   const query = {
//     program: selectedProgram,
//     module: selectedModule,
//     level_of_study: level_of_study,
//     name: name,
//   };

//   try {
//     const sessions = await Session.find(query).exec();

//     res.json(sessions);
//   } catch (error) {
//     console.error("Error fetching sessions:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

router.route("/api/sessions").get(async (req, res) => {
  const { selectedProgram, selectedModule, level_of_study, name } = req.query;

  // Initialize the query object
  let query = { name: name };

  // If the level_of_study is not "Основне академске студије", include program and module in the query
  if (level_of_study !== "Основне академске студије") {
    query.program = selectedProgram;
    query.module = selectedModule;
  }

  try {
    const sessions = await Session.find(query).exec();
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.use("/", router);
