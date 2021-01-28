import API from "@/services/API";

export default {
  getCourses() {
    return API().get("courses");
  },
  addCourse(course) {
    return API().post("courses/add", {
      course: course, // add our data to the request body
    });
  },
  getCourse(id) {
    return API().get("courses/edit/" + id);
  },
  updateCourse(id, course) {
    return API().post("courses/update/" + id, {
      updated_course: course,
    });
  },
  deleteCourse(id) {
    return API().delete("courses/delete/" + id);
  },
  archiveCourse(id) {
    return API().get("courses/archive/" + id);
  },
  addTime(course_id, course_times) {
    return API().post("courses/add_lecture_time/" + course_id, {
      course_times: course_times,
    });
  },
  deleteTime(course_id, course_times) {
    return API().post("courses/delete_lecture_time/" + course_id, {
      course_times: course_times,
    });
  },
  getInstructor(course_id) {
    return API().get("courses/getInstructor/" + course_id);
  },
  getInstructorCourses() {
    return API().get("courses/get_instructor_courses");
  },
  addInstructors(course_id, instructors) {
    return API().post("courses/add_instructors/" + course_id, {
      instructors: instructors,
    });
  },
  turnSectionsOn(sections, id) {
    return API().post("courses/toggleAllSectionsPublic/" + id, {
      sections: sections,
    });
  },
  turnSectionsOff(sections, id) {
    return API().post("courses/toggleAllSectionsPrivate/" + id, {
      sections: sections,
    });
  },
};
