import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from './components/Home.vue';
import Users from './components/admin/User/Users.vue';
import EditUser from './components/admin/User/EditUser.vue';
import Instructors from './components/admin/User/Instructors.vue';
import Students from './components/admin/User/Students.vue';
import Course from './components/admin/Course/Course.vue';
import EditCourse from './components/EditCourse.vue';
import NewCourse from './components/admin/Course/NewCourse.vue';
import Courses from './components/admin/Course/Courses.vue';
import AdminSections from './components/admin/Section/AdminSections.vue';
import EditSection from './components/EditSection.vue';
import AdminNewSection from './components/admin/Section/AdminNewSection.vue';
import NewUser from './components/admin/User/NewUser.vue';
import OnboardUser from './views/OnboardUser.vue';
import AdminNewEvent from './components/admin/Event/AdminNewEvent.vue';
import AdminEvents from './components/admin/Event/AdminEvents.vue';
import AdminEditEvent from './components/admin/Event/AdminEditEvent.vue';
import NewSubmission from './components/admin/Submission/NewSubmission.vue';
import Submissions from './components/admin/Submission/Submissions.vue';
import LandingPage from './views/LandingPage.vue';
import SetPermanentPassword from './views/SetPermanentPassword.vue';
import Signup from './components/Signup.vue';
import Dashboard from './views/Dashboard.vue';
import CourseList from './components/CourseList.vue';
import CourseSettings from './views/CourseSettings.vue'
import CourseInfo from './views/CourseInfo.vue';
import NewEvent from './views/NewEvent.vue';
import EventInfo from './views/EventInfo.vue';
import LecturePlayback from './views/LecturePlayback.vue';
import WebexTest from './views/WebexTest.vue';
import NewLecture from './views/NewLecture.vue';
import LectureInfo from './views/LectureInfo.vue';
import Settings from './views/Settings.vue';
import RedirectCASLogin from './views/RedirectCASLogin.vue';
import Statistics from './views/Statistics.vue';
import TeachNewCourse from '@/components/TeachNewCourse.vue';
import NewSection from '@/components/NewSection.vue';
import EditLecture from '@/components/EditLecture.vue';
import JoinCourse from '@/components/JoinCourse.vue';
import NewLectureTime from '@/components/NewLectureTime.vue';
import InstructorCourseInfo from '@/views/instructor/InstructorCourseInfo.vue';
import InstructorLectureInfo from '@/views/instructor/InstructorLectureInfo.vue';
import TASectionInfo from '@/views/ta/TASectionInfo.vue';
import TALectureInfo from '@/views/ta/TALectureInfo.vue';
import StudentSectionInfo from '@/views/student/StudentSectionInfo.vue';
import StudentLectureInfo from '@/views/student/StudentLectureInfo.vue';
import Calendar from '@/views/Calendar.vue';

import AuthAPI from '@/services/AuthAPI.js';
import UserAPI from '@/services/UserAPI.js';
import SectionAPI from './services/SectionAPI';
import CourseAPI from './services/CourseAPI';

const url = require('url')
const query = require('querystring')

Vue.use(VueRouter);

const router = new VueRouter({
  // mode: 'history',
  routes: [
    {
      name: 'landing_page',
      path: '/',
      component: LandingPage,
      meta: { requiresNoLogin: true }
    },
    {
      name: 'settings',
      path: '/settings',
      component: Settings,
      meta: {
        title: "Settings",
        requiresAuth: true
      }
    },
    {
      name: 'course_settings',    //ADDED THIS
      path: '/course_settings',
      component: CourseSettings,
      meta: {
        title: "CourseSettings",
        requiresAdmin: true
      }
    },
    {
      name: 'new_user',
      path: '/admin/new_user',
      component: NewUser,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'users',
      path: '/admin/users',
      component: Users,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'edit_user',
      path: '/admin/edit_user/:id',
      component: EditUser,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'onboard_user',
      path: '/admin/onboard_user',
      component: OnboardUser,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'instructors',
      path: '/admin/instructors',
      component: Instructors,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'students',
      path: '/admin/students',
      component: Students,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'new_course',
      path: '/admin/new_course',
      component: NewCourse,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'course',
      path: '/Course',
      component: Course,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'edit_course',
      path: '/edit_course/:id',
      component: EditCourse,
      meta: {
        requiresAuth: true,
        requiresInstructor: true
      }
    },
    {
      name: 'new_lecture_time',
      path: '/new_lecture_time/:id',
      component: NewLectureTime,
      meta: {
        requiresAuth: true,
        requiresInstructor: true
      }
    },
    {
      name: 'courses',
      path: '/admin/courses',
      component: Courses,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'admin_sections',
      path: '/admin/sections',
      component: AdminSections,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'edit_section',
      path: '/edit_section/:id',
      component: EditSection,
      meta: {
        requiresAuth: true,
        requiresInstructor: true
      }
    },
    {
      name: 'admin_new_section',
      path: '/admin/new_section',
      component: AdminNewSection,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'new_section',
      path: '/new_section/:id',
      component: NewSection,
      meta: {
        requiresAuth: true,
        requiresInstructor: true
      }
    },
    {
      name: 'admin_new_event',
      path: '/admin/new_event',
      component: AdminNewEvent,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'admin_events',
      path: '/admin/events',
      component: AdminEvents,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'admin_edit_event',
      path: '/admin_edit_event/:id',
      component: AdminEditEvent,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'new_submission',
      path: '/new_submission',
      component: NewSubmission,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'submissions',
      path: '/admin/submissions',
      component: Submissions,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'signup',
      path: '/signup',
      component: Signup,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: Dashboard,
      meta: {
        title: "Dashboard",
        requiresAuth: true
      }
    },
    // {
    //   name: 'user_courses',
    //   path: '/user_courses',
    //   component: CourseList,
    //   meta: {
    //     title: "Courses",
    //     requiresAuth: true
    //   }
    // },
    {
      name: 'course_info',
      path: '/course_info/:id',
      component: CourseInfo,
      meta: {
        title: "Course Info",
        requiresAuth: true
      }
    },
    {
      name: 'join_course',
      path: '/join_course/:id',
      component: JoinCourse,
      meta: {
        title: "Join Course",
        requiresAuth: true
      }
    },
    {
      name: 'new_event',
      path: '/new_event/:course_id',
      component: NewEvent,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'event_info',
      path: '/event_info/:event_id',
      component: EventInfo,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'webex_test',
      path: '/webex_test',
      component: WebexTest,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      name: 'lecture_playback',
      path: '/lecture_playback/:lecture_id',
      component: LecturePlayback,
      meta: {
        title: "Lecture Playback",
        requiresAuth: true,
      }
    },
    {
      name: 'new_lecture',
      path: '/new_lecture/:course_id',
      component: NewLecture,
      meta: {
        title: "New Lecture",
        requiresAuth: true,
        requiresInstructor: true
      }
    },
    {
      name: 'lecture_info',
      path: '/lecture_info/:lecture_id',
      component: LectureInfo,
      meta: {
        title: "Lecture Info",
        requiresAuth: true,
      }
    },
    {
      name: 'set_permanent_password',
      path: '/set_permanent_password/:user_id',
      component: SetPermanentPassword,
      meta: {
        requiresNoLogin: true
      }
    },
    {
      name: 'redirect_cas_login',
      path: '/redirectCASLogin',
      component: RedirectCASLogin,
      meta: {
        title: "Redirecting",
        requiresNoLogin: true
      }
    },
    {
      name: 'statistics',
      path: '/statistics',
      component: Statistics,
      meta: {
        title: "Statistics",
        requiresAuth: true,
        requiresInstructor: true
      }
    },
    {
      name: 'teach_new_course',
      path: '/teach_new_course',
      component: TeachNewCourse,
      meta: {
        title: "Teach New Course",
        requiresAuth: true
      }
    },
    {
      name: 'edit_lecture',
      path: '/edit_lecture/:id',
      component: EditLecture,
      meta: {
        title: "Edit Lecture",
        requiresAuth: true
      }
    },
    {
      name: 'instructor_course_info',
      path: '/course_info/instructor/:id',
      component: InstructorCourseInfo,
      meta: {
        title: "Course Info",
        requiresAuth: true,
        requiresInstructor: true
      }
    },
    {
      name: 'instructor_lecture_info',
      path: '/lecture_info/instructor/:id',
      component: InstructorLectureInfo,
      meta: {
        title: "Lecture Info",
        requiresAuth: true,
        requiresInstructor: true
      }
    },
    {
      name: 'ta_section_info',
      path: '/section_info/ta/:id',
      component: TASectionInfo,
      meta: {
        title: "Section Info",
        requiresAuth: true,
        requiresTA: true
      }
    },
    {
      name: 'ta_lecture_info',
      path: '/lecture_info/ta/:id',
      component: TALectureInfo,
      meta: {
        title: "Lecture Info",
        requiresAuth: true,
        requiresTA: true
      }
    },
    {
      name: 'student_section_info',
      path: '/section_info/student/:id',
      component: StudentSectionInfo,
      meta: {
        title: "Section Info",
        requiresAuth: true,
        requiresStudent: true
      }
    },
    {
      name: 'student_lecture_info',
      path: '/lecture_info/student/:id',
      component: StudentLectureInfo,
      meta: {
        title: "Lecture Info",
        requiresAuth: true,
        requiresStudent: true
      }
    },
    {
      name: 'calendar',
      path: '/calendar',
      component: Calendar,
      meta: {
        title: "Calendar",
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user')

  if(to.name == 'landing_page' || to.name == 'dashboard') {
    let url_query = query.parse(url.parse(window.location.href).query)
		if(url_query && url_query.code) {
      if(process.env.NODE_ENV === 'production') {
        window.location.href="https://www.venue-meetings.com/"+"?code="+url_query.code+"#/lecture_playback/"+localStorage.getItem('last_webex')
      } else {
        window.location.href="http://localhost:8080/"+"?code="+url_query.code+"#/lecture_playback/"+localStorage.getItem('last_webex')
      }
		}
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (loggedIn) {

      const user_data = JSON.parse(loggedIn)

      if(user_data.current_user.is_admin) {

        next()

      } else if(to.matched.some(record => record.meta.requiresAdmin)) {

        if (user_data.current_user.is_admin) {
          next()
        } else {
          next('/dashboard')
        }

      } else if (to.matched.some(record => record.meta.requiresInstructor)) { // TODO check Instructor lectures

        if ((to.name == 'new_lecture' && user_data.current_user.instructor_courses.includes(to.params.course_id))
        || (to.name == 'new_lecture' && user_data.current_user.ta_sections.includes(to.params.course_id))
        || (to.name == 'statistics' && user_data.current_user.instructor_courses.length > 0)
        || (to.name == 'edit_course' && user_data.current_user.instructor_courses.includes(to.params.id))
        || (to.name == 'edit_section' && user_data.current_user.ta_sections.includes(to.params.id))
        || (to.name == 'edit_section' && from.name == 'edit_course')
        || (to.name == 'new_lecture_time' && user_data.current_user.instructor_courses.includes(to.params.id))
        || (to.name == 'new_section' && user_data.current_user.instructor_courses.includes(to.params.id))
        || user_data.current_user.instructor_courses.includes(to.params.id)){
          next()
        } else if(to.name == 'instructor_section_info') {
          SectionAPI.getSection(to.params.id).then(res => {
            if(user_data.current_user.instructor_courses.includes(res.data.course)) {
              next()
            } else {
              next('/dashboard')
            }
          })
        } else {
          next('/dashboard')
        }

      } else if (to.matched.some(record => record.meta.requiresTA)) {

        if (user_data.current_user.ta_sections.includes(to.params.id)
        || (to.name == 'ta_course_info') && user_data.current_user.ta_sections.some(section => section.course == to.params.id) ) { // TODO check TA lectures
          next()
        } else {
          next('/dashboard')
        }

      } else if (to.matched.some(record => record.meta.requiresStudent)) {

        if (user_data.current_user.student_sections.includes(to.params.id)
        || (to.name == 'student_course_info') && user_data.current_user.student_sections.some(section => section.course == to.params.id) ){ // TODO check student lectures
          next()
        } else {
          next('/dashboard')
        }

      }
      else if (to.name == 'join_course') { //student implement new join route

        if (user_data.current_user.instructor_courses.includes(to.params.id)) {
          next('/course_info/' + to.params.id)
        }
        next()

      }  
      else {

        next()

      }
    }
    // not logged in
    else {
      next('/')
    }

  } else if (to.matched.some(record => record.meta.requiresNoLogin)) {

    if (loggedIn) {
      next('/dashboard')
    } else {
      next()
    }

  } else {
    next()
  }
})

export default router
