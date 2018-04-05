import Vue from 'vue'
import Router from 'vue-router'

const paths = { splash: '/hello',
	login: '/login',
	signup: '/signup',
	home: '/',
	teacher: '/teacher',
	teacherDashboard: '/teacher/dashboard',
	teacherData: '/teacher/data',
	preview: '/teacher/preview',
	previewEquation: '/teacher/preview/equation',
	student: '/student',
	studentDashboard: '/student/dashboard',
	studentData: '/student/data',
	practice: '/student/practice',
	practiceEquation: '/student/practice/equation'
}

const routes = [
	// logged out routes
	{ name: 'Index',
		path: '/',
		component: () => import('_lo/index'),
		redirect: paths.splash,
		children: [
			{ name: 'Splash', path: paths.splash, component: () => import('_lo/splash') },
			{ name: 'Login', path: paths.login, component: () => import('_lo/login') },
			{ name: 'Signup', path: paths.signup, component: () => import('_lo/signup') }
		]
	},
	// logged in routes
	{ name: 'Home',
		path: paths.home,
		component: () => import('_li/index'),
		meta: { auth: true } },
	{ name: 'Teacher',
		path: paths.teacher,
		component: () => import('_teacher/index'),
		redirect: paths.teacherDashboard,
		meta: { auth: true, role: 1 },
		children: [
			{ name: 'TeacherDashboard',
				path: paths.teacherDashboard,
				component: () => import('_teacher/dashboard') },
			{ name: 'TeacherData',
				path: paths.teacherData,
				component: () => import('_teacher/data') },
			{ name: 'Preview',
				path: paths.preview,
				component: () => import('_teacher/preview'),
				redirect: paths.teacherDashboard,
				children: [
					{ name: 'PreviewEquation',
						path: paths.previewEquation,
						component: () => import('_li/components/equation') }
				]
			}
		]
	},
	{ name: 'Student',
		path: paths.student,
		component: () => import('_student/index'),
		redirect: paths.studentDashboard,
		meta: { auth: true, role: 2 },
		children: [
			{ name: 'StudentDashboard',
				path: paths.studentDashboard,
				component: () => import('_student/dashboard') },
			{ name: 'StudentData',
				path: paths.studentData,
				component: () => import('_student/data') },
			{ name: 'Practice',
				path: paths.practice,
				component: () => import('_student/practice'),
				redirect: paths.studentDashboard,
				children: [
					{ name: 'PracticeEquation',
						path: paths.practiceEquation,
						component: () => import('_li/components/equation') }
				]
			}
		]
	}
]

Vue.use(Router)

export default new Router({
	routes,
	mode: 'history'
})
