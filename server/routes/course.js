const express = require("express");
const cors = require('cors');
const Course = require("../models/courses");
const cloudinary = require("cloudinary");
const {
  verificaToken
} = require("../middleware/autenticacion");
const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

app.post("/api/course/saveCourse", [verificaToken], (req, resp) => {

  let body = req.body.data;
  const course = new Course({
    code: body.code,
    title: body.title,
    small_description: body.sinopsis,
    long_description: body.description,
    price: body.price,
  });

  course.save((err, courseDB) => {

    if (err) {
      return resp.status(400).json({
        ok: false,
        err,
      });

    } else {
      resp.json({
        ok: true,
        saved: true,
        course: courseDB,
        code: courseDB.code
      });
    }
  });
});

app.post("/api/course/saveImage", [verificaToken], async (req, resp) => {

  var courseId = req.body.course;
  var image = req.body.image;
  var imgData = image;
  var base64Data = imgData.split(",")[1];
  var type = req.body.type.split("/")[1];

  try {
    const { uploader } = cloudinary;

    const res = await uploader.upload(
      `data:image/${type};base64,${base64Data}`
    );

    Course.findOne({ _id: courseId }).exec((err, course) => {

      if (err) {
        return resp.status(500).json({
          ok: false,
          err,
        });
      }

      if (course) {
        course.image = res.secure_url;
        course.image_id = res.public_id;
      }

      Course.findOneAndUpdate(
        { _id: courseId }, course, {
        new: true
      }
      ).exec((err, courseupdate) => {
        if (err) {
          return resp.status(500).json({
            ok: false,
            err,
          });
        }
        if (!courseupdate) {
          return resp.status(400).json({
            ok: false,
            err
          });
        }

        resp.json({
          ok: true,
          saved: true,
          course: courseupdate
        });

      });

    });
  } catch (error) {
    return resp.status(500).json({
      ok: false,
      err: "No se pudo guardar la imagen",
    });
  }
});



app.post("/api/course/deleteImage", [verificaToken], async (req, resp) => {

  var courseId = req.body.courseId;
  var imageId = req.body.imageId;

  try {

    cloudinary.v2.api.delete_resources([imageId])
      .then(result => console.log(result));

    Course.findOne({ _id: courseId }).exec((err, course) => {

      if (err) {
        return resp.status(500).json({
          ok: false,
          err,
        });
      }

      if (course) {
        course.image = null;
        course.image_id = null;
      }

      Course.findOneAndUpdate(
        { _id: courseId }, course, {
        new: true
      }
      ).exec((err, course_update) => {
        if (err) {
          return resp.status(500).json({
            ok: false,
            err,
          });
        }
        if (!course_update) {
          return resp.status(400).json({
            ok: false,
            err: {
              coursenotfound: true,
            },
          });
        }

        resp.json({
          ok: true,
          saved: true,
          course: course_update
        });

      });

    });
  } catch (error) {
    return resp.status(500).json({
      ok: false,
      err: "No se pudo borrar la imagen",
    });
  }
});



/**
 * Actualiza el articulo
 */
app.post("/api/course/updateCourse", [verificaToken], (req, resp) => {

  let body = req.body.data;
  const courseId = body._id;
  
  const course = {
    code: body.code,
    title: body.title,
    small_description: body.sinopsis,
    long_description: body.description,
    price: body.price,    
  };

  Course.findOneAndUpdate(
    { _id: courseId }, course, {
    new: true
  }
  ).exec((err, courseupdate) => {
    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    if (!courseupdate) {
      return resp.status(400).json({
        ok: false,
        err: {
          coursenotfound: true,
        },
      });
    }

    resp.json({
      ok: true,
      saved: true,
      course: courseupdate
    });

  });
});



/**
 * lista todos los articulos activos
 */
app.post("/api/course/findAllCourses", async (req, resp) => {

  Course.find().sort({ updated_at: -1 }).exec((err, courses) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    else {
      resp.json({
        ok: true,
        courses
      });
    }
  });
});


app.post("/api/course/findCourseByCode", async (req, resp) => {

  course_code = req.body.code;
  Article.findOne({ code: course_code}).exec((err, course) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    else 
    if (!course) {
      return resp.status(400).json({
        ok: false,
        err: {
          coursenotfound: true,
        },
      });
    }
    else {
      resp.json({
        ok: true,
        course
      });
    }
  });
});


/**
 * Busca el articulo
 */
app.post("/api/course/findCourse", [verificaToken], async (req, resp) => {

  courseId = req.body.course;
  Course.findOne({ _id: courseId }).exec((err, course) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    else {
      resp.json({
        ok: true,
        saved: true,
        course
      });
    }
  });
});


/**
 * Borra el curso y su imagen
 */
app.post("/api/course/deleteCourse", [verificaToken], async (req, resp) => {

  var courseId = req.body.course;
  Course.findOne({ _id: courseId }).exec((err, course) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }

    if (course.image_id) {
      cloudinary.v2.api.delete_resources(course.image_id)
        .then(result => console.log(result));
    }
    Course.remove({ _id: courseId }, function (err) {
      if (err) {
        return resp.status(500).json({
          ok: false,
          err,
        });
      }
      else {

        resp.json({
          ok: true
        });
      }
    });
  });
});

/**
 * Activa/Desactiva el curso
 */
app.post("/api/course/activateCourse", [verificaToken], (req, resp) => {

  let body = req.body;

  const courseId = body.course;
  const status = body.status;

  const course = {
    status
  };

  Course.findOneAndUpdate(
    { _id: courseId }, course, {
    new: true
  }
  ).exec((err, courupdate) => {
    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    if (!courupdate) {
      return resp.status(400).json({
        ok: false,
        err: {
          coursenotfound: true,
        },
      });
    }

    resp.json({
      ok: true,
      saved: true,
      course: courupdate
    });

  });
});




module.exports = app;