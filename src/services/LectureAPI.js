import API from '@/services/API'

export default {
  getLectures() {
    return API().get('lectures')
  },
  deleteLecture(lecture_id) {
    return API().get('lectures/delete/'+lecture_id)
  },
  getLecturesForUser(user_id, preference) {
    return API().get('lectures/for_user/' + user_id + '/' + preference)
  },
  getLecturesForCourse(course_id) {
    return API().get('lectures/for_course/' + course_id)
  },
  getLecturesForSection(section_id) {
    return API().get('lectures/for_section/' + section_id)
  },
  getLectureWithSectionsAndCourse(lecture_id) {
    return API().get('lectures/with_sections_and_course/' + lecture_id)
  },
  getSignedRecordingUrl(filename) {
    return API().get('lectures/get_signed_recording_url/'+filename)
  },
  getSignedFileUrl(filename) {
    return API().get('lectures/get_signed_file_url/'+filename)
  },
  addLecture(lecture) {
    return API().post('lectures/add', {
      lecture: lecture
    })
  },
  update(lecture) {
    return API().post('lectures/update/'+lecture._id, {
      updated: lecture
    })
  },
  updateToPlayback(lecture) {
    return API().post('lectures/update_to_playback/' + lecture._id,
      {
        lecture: lecture
      }
    )
  },
  getLecture(id) {
    return API().get('lectures/' + id)
  },
  // processEmailsForLectures(lectures,toEmail) {
  //   return API().post('lectures/process_emails', {
  //     lectures: lectures,
  //     toEmail: toEmail
  //   })
  // },
  endEarly(lecture_id) {
    return API().post('lectures/end_early', {
      lecture_id: lecture_id
    })
  },
  addLinks(lecture, class_links) {
    return API().post('lectures/add_links'), {
      lecture: lecture,
      class_links: class_links
    }
  }
}