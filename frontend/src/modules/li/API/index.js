import axios from 'axios'

// URL and endpoint constants
const API_URL = 'http://localhost:5000/api'

const CLASS_URL = API_URL + '/class'
const CLASS_SIZE_URL = CLASS_URL + '/size'
const CLASS_RECORDS_URL = CLASS_URL + '/records'
const CLASS_RECORDS_EQUATION_URL = CLASS_RECORDS_URL + '/equation'

const STUDENT_URL = API_URL + '/student'
const STUDENT_CLASS_RECORDS_URL = STUDENT_URL + '/class/records'
const STUDENT_RECORDS_URL = STUDENT_URL + '/records'
const STUDENT_RECORDS_EQUATION_URL = STUDENT_RECORDS_URL + '/equation'
const EQUATION_START_URL = STUDENT_RECORDS_EQUATION_URL + '/create'
const EQUATION_FINISH_URL = STUDENT_RECORDS_EQUATION_URL + '/complete'

export default {
	getClassSize (classId, context) {
		axios({
			method: 'get',
			url: CLASS_SIZE_URL,
			params: { classId: classId }
		})
		.then(response => {
			context.students = { count: response.data.num_students, active: response.data.active_students }
		})
		.catch(error => {
			console.log(error)
		})
	},
	getClassRecordsAll (classId, context) {
		this.getClassRecords(classId, context, CLASS_RECORDS_URL)
	},
	getClassRecordsEquation (classId, context) {
		this.getClassRecords(classId, context, CLASS_RECORDS_EQUATION_URL)
	},
	getClassRecords (classId, context, URL) {
		axios({
			method: 'get',
			url: URL,
			params: { classId: classId }
		})
		.then(response => {
			context.fields = response.data.fields
			context.records = response.data.records
		})
		.catch(error => {
			console.log(error)
		})
	},

	getStudentRecordsAll (userId, context) {
		this.getStudentRecords(userId, context, STUDENT_RECORDS_URL)
	},
	getStudentRecordsEquation (userId, context) {
		this.getStudentRecords(userId, context, STUDENT_RECORDS_EQUATION_URL)
	},
	getStudentRecords (userId, context, URL) {
		axios({
			method: 'get',
			url: URL,
			params: { userId: userId }
		})
		.then(response => {
			context.records = [response.data]
		})
		.catch(error => {
			console.log(error)
		})
	},
	startEquation (userId, stepsReqd, classId, context) {
		if (context.session.user.role === 2) {
			axios.post(EQUATION_START_URL, { userId: userId, stepsReqd: stepsReqd, classId: classId })
			.then(response => {
				context.equationId = response.data.equation_id
			})
			.catch(error => {
				console.log(error)
			})
		}
	},
	finishEquation (equationId, stepsUsed, undosUsed, context) {
		if (context.session.user.role === 2) {
			axios.post(EQUATION_FINISH_URL, { equationId: equationId, stepsUsed: stepsUsed, undosUsed: undosUsed })
			.then(response => {
				context.equationId = 0
			})
			.catch(error => {
				console.log(error)
			})
		}
	},
	getStudentAndClassTotals (userId, classId, context) {
		axios({
			method: 'get',
			url: STUDENT_CLASS_RECORDS_URL,
			params: { userId: userId, classId: classId }
		})
		.then(response => {
			context.studentTotal = response.data.student_total
			context.classMax = response.data.class_max
		})
		.catch(error => {
			console.log(error)
		})
	}
}
