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

const jwt = require("jsonwebtoken");
const authToken = require("./authentication/authenticateToken");
const app = express();

//  ovo sam sve premestio u vercel.json trebalo bi da radi tamo
const corsOptions = {
  origin: [
    "https://courses-catalogue-front.vercel.app",
    "http://localhost:3000",
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

//Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.3qxgdoi.mongodb.net/courses-catalogue"
);

const conn = mongoose.connection;

conn.once("open", () => {
  console.log("mongo open");
});

const router = express.Router();

router.use(bodyParser.json());

router.route("/courses").get((req, res) => {
  console.log("radi");
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

  try {
    const courses = await Course.find(query).exec();
    console.log(
      query.level_of_study + " " + query.program + " " + query.modules
    );
    res.json(courses);
  } catch (err) {
    console.error(err);
    // Handle the error
  }
});

router.route("/departments").get((req, res) => {
  console.log("radi");
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
  console.log("radi modules");
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
  console.log("radi levelsofstudy");
  LevelOfStudy.find({})
    .exec()
    .then((levelsOfStudy) => {
      res.json(levelsOfStudy);
      console.log(levelsOfStudy);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error occured while fetching levelsOfStudy");
    });
});
//ovo mora opet da se radi jer je previse toga izbaceno
// router.post("/api/courses", authenticateToken, async (req, res) => {
//   try {
//     const {
//       courseID,
//       acc,
//       semester,
//       studies,
//       name,
//       levelOfStudy,
//       moduleItems,
//       departmentItems,
//       yearOfStudyItems,
//       status,
//       espb,
//       typeOfExam,
//       typeOfLecture,
//       lecturerItems,
//       lectureSessionTimeItems,
//       exerciseSessionTimeItems,
//       preconditionItems,
//       periodicity,
//       abstract,
//       content,
//       objective,
//       note,
//       literatureItems,
//       tagItems,
//       restrictionItems,
//       link,
//       video,
//     } = req.body;
//     const course = new Course({
//       course_id: courseID,
//       accreditation: acc,
//       name: name,
//       semester: semester,
//       level_of_study: levelOfStudy,
//       studies: studies,
//       modules: moduleItems,
//       departments: departmentItems,
//       year_of_study: yearOfStudyItems,
//       lecturers: lecturerItems,
//       espb: espb,
//       periodicity: periodicity,
//       type_of_exam: typeOfExam,
//       type_of_lecture: typeOfLecture,
//       preconditions: preconditionItems,
//       lecture_session_time: lectureSessionTimeItems,
//       exercise_session_time: exerciseSessionTimeItems,
//       abstract: abstract,
//       objective: objective,
//       content: content,
//       literature: literatureItems,
//       link: link,
//       video: video,
//       note: note,
//       tags: tagItems,
//       restrictions: restrictionItems,
//       status: status,
//     });
//     console.log(course);
//     await course.save();
//     res.status(201).json(course);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to save the course" });
//   }
// });
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
    });

    await course.save();

    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error("Error saving course:", error);
    if (error.name === "ValidationError") {
      // If validation fails (e.g., required fields are missing), return a 400 Bad Request
      res
        .status(400)
        .json({
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
      console.log("back greska");
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
      console.log("token glasi ovako " + token);
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
  console.log("uspesan pristup");
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
  const courseId = req.params.courseId;
  const updatedCourseData = req.body;

  try {
    // Pronalaženje kursa po ID-ju
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Kurs nije pronađen." });
    }

    // Ažuriranje kursa sa novim podacima
    Object.keys(updatedCourseData).forEach((key) => {
      course[key] = updatedCourseData[key];
    });

    // Spajanje stringova za literaturu
    if (Array.isArray(updatedCourseData.literature)) {
      course.literature = updatedCourseData.literature.join(", ");
    }

    // Čuvanje ažuriranog kursa
    await course.save();

    res.json({ success: true, message: "Kurs uspešno ažuriran." });
  } catch (error) {
    console.error("Greška prilikom ažuriranja kursa:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Došlo je do greške prilikom ažuriranja kursa.",
      });
  }
});

router.route("/api/courses/delete").post(async (req, res) => {
  const { courseIds } = req.body;

  try {
    const deletedCourses = await Course.deleteMany({ _id: { $in: courseIds } }).exec();

    if (!deletedCourses) {
      return res.status(404).json({ error: "No courses found" });
    }

    res.json({ message: "Courses deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/", router);
