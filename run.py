from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from passlib.apps import custom_app_context as pwd_context
import time
import random
import sqlite3

app = Flask(__name__,
            static_folder = "./dist/static",
            template_folder = "./dist")
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_RESOURCES'] = {r"/api/*": {"origins": "*"}}

cors = CORS(app)

DATABASE = './backend/benmarks.sqlite'

@app.route('/')
def index() :
    return render_template("index.html")


@app.route('/api/signup', methods=['POST'])
def signup() :
	username = request.json['username']
	password = pwd_context.encrypt(request.json['password'])
	role = request.json['userRole']

	conn, curs = connect_db()
	curs.execute('''SELECT user_id FROM tbl_users WHERE username = ?''', (username,))
	if curs.fetchone() :
		response = { 'success': False, 'error': 0 }
	else :
		curs.execute('''INSERT INTO tbl_users (username, password, role, last_login) VALUES (?, ?, ?, ?)'''\
			, (username, password, role, time.strftime('%Y-%m-%d %H:%M:%S')))
		user_id = curs.lastrowid
		if role == 1 :
			class_code = create_class_code(user_id)
			curs.execute('''INSERT INTO tbl_classes (teacher_id, class_code) VALUES (?, ?)''', (user_id, class_code))
			class_id = curs.lastrowid
			class_obj = {'id':  class_id, 'code': class_code}
		else :
			class_id = request.json['classId']
			if (class_id > 0) :
				curs.execute('''INSERT INTO tbl_class_students (class_id, student_id) VALUES (?, ?)''', (class_id, user_id))
				class_obj = {'id':  class_id}
			else :
				class_obj = {}

		response = { 'success': True, 
						'user': {'id': user_id, 'username': username, 'role': role}, 
						'class': class_obj
					}
	close_db(conn)

	return jsonify(response)


@app.route('/api/login', methods=['POST'])
def login() :
	username = request.json['username']
	password = request.json['password']

	conn, curs = connect_db()
	curs.execute('''SELECT user_id, password, role FROM tbl_users WHERE username = ?''', (username,))
	user_data = curs.fetchone()
	if not user_data :
		response = { 'success': False, 'error': 0 }
	elif not pwd_context.verify(password, user_data[1]):		
		response = { 'success': False, 'error': 1 }
	else :
		curs.execute('''UPDATE tbl_users SET last_login = ? WHERE user_id = ?''',\
			(time.strftime('%Y-%m-%d %H:%M:%S'), user_data[0]))
		if user_data[2] == 1 :
			curs.execute('''SELECT class_id FROM tbl_classes WHERE teacher_id = ?''', (user_data[0],))
			class_data = curs.fetchone()
			class_code = create_class_code(user_data[0])
			curs.execute('''UPDATE tbl_classes SET class_code = ? WHERE class_id = ?''', (class_code, class_data[0]))
			class_obj = {'id':  class_data[0], 'code': class_code}
		else :
			curs.execute('''SELECT class_id FROM tbl_class_students WHERE student_id = ?''', (user_data[0],))
			class_data = curs.fetchone()
			if class_data :
				class_obj = {'id':  class_data[0]}
			else :
				class_obj = {}
			
		response = { 'success': True, 
						'user': {'id': user_data[0], 'username': username, 'role': user_data[2]}, 
						'class': class_obj
					}
	close_db(conn)

	return jsonify(response)

@app.route('/api/class/size', methods=['GET'])
def get_class_size() :
	class_id = request.args.get('classId')

	conn, curs = connect_db()
	curs.execute('''SELECT COUNT(student_id),\
		COUNT(CASE WHEN julianday() - julianday(last_login) < 7 THEN student_id END)\
		FROM tbl_class_students cs JOIN tbl_users u ON cs.student_id = u.user_id\
		WHERE class_id = ?''', (class_id,))
	class_size = curs.fetchone()
	close_db(conn)

	return jsonify({'num_students': class_size[0], 'active_students': class_size[1]})


@app.route('/api/student/records/equation/create', methods=['POST'])
def record_equation_start() :
	user_id = request.json['userId']
	min_steps = request.json['stepsReqd']
	class_id = request.json['classId']

	conn, curs = connect_db()
	curs.execute('''INSERT INTO tbl_skill_works (user_id, min_steps, class_id, skill_id) VALUES (?, ?, ?, 1)''',\
		(user_id, min_steps, class_id))
	close_db(conn)

	return jsonify({ 'equation_id': curs.lastrowid })


@app.route('/api/student/records/equation/complete', methods=['POST'])
def record_equation_finish() :
	equation_id = request.json['equationId']
	steps_used = request.json['stepsUsed']
	undos_used = request.json['undosUsed']

	conn, curs = connect_db()
	curs.execute('''UPDATE tbl_skill_works SET steps_used = ?, undos_used = ? WHERE  id = ?''',\
		(steps_used, undos_used, equation_id))
	close_db(conn)
	return 'OK'

@app.route('/api/student/records', methods=['GET'])
def get_student_records_all() :
	user_id = request.args.get('userId')

	conn, curs = connect_db()
	curs.execute('''SELECT COUNT(*), COUNT(CASE WHEN steps_used NOT NULL THEN id END),\
					COUNT(CASE WHEN steps_used = min_steps THEN id END),\
					COUNT(CASE WHEN undos_used > 1 THEN id END)\
					FROM tbl_skill_works WHERE user_id = ?''', (user_id,))
	records = curs.fetchone()
	close_db(conn)

	return jsonify({'problems_attempted': records[0], 'problems_solved': records[1],\
		'solved_with_minimum_steps': records[2], 'solved_with_undos': records[3]})

@app.route('/api/student/records/equation', methods=['GET'])
def get_student_records_equation() :
	user_id = request.args.get('userId')

	conn, curs = connect_db()
	curs.execute('''SELECT COUNT(*), COUNT(CASE WHEN steps_used NOT NULL THEN id END),\
					COUNT(CASE WHEN steps_used = min_steps THEN id END),\
					COUNT(CASE WHEN undos_used > 1 THEN id END)\
					FROM tbl_skill_works WHERE skill_id = 1 AND user_id = ?''', (user_id,))
	records = curs.fetchone()
	close_db(conn)

	return jsonify({'equations_attempted': records[0], 'equations_solved': records[1],\
		'solved_with_minimum_steps': records[2], 'solved_with_undos': records[3]})

@app.route('/api/student/class/records', methods=['GET'])
def get_student_class_records() :
	user_id = request.args.get('userId')
	class_id = request.args.get('classId')

	conn, curs = connect_db()
	curs.execute('''SELECT COUNT(*) FROM tbl_skill_works\
					WHERE user_id = ?''', (user_id,))
	student_total = curs.fetchone()
	if class_id > 0 :
		curs.execute('''SELECT COUNT(*) AS problems FROM tbl_skill_works\
						WHERE class_id = ? GROUP BY user_id\
						ORDER BY problems DESC''', (class_id,))
		class_totals = curs.fetchall()
	else :
		class_totals = [student_total]
	close_db(conn)

	return jsonify({'student_total': student_total[0], 'class_max': class_totals[0][0]})

@app.route('/api/class/records', methods=['GET'])
def get_class_records_all() :
	class_id = request.args.get('classId')
	print(class_id)
	conn, curs = connect_db()
	curs.execute('''SELECT u.username, COUNT(*),\
					COUNT(CASE WHEN steps_used NOT NULL THEN id END),\
					COUNT(CASE WHEN steps_used = min_steps THEN id END),\
					COUNT(CASE WHEN undos_used > 1 THEN id END)\
					FROM tbl_skill_works s INNER JOIN tbl_users u ON s.user_id = u.user_id\
					WHERE class_id = ? GROUP BY username''', (class_id,))
	records_raw = curs.fetchall()
	close_db(conn)
	fields = [
		{'key': 'username', 'sortable': True},\
		{'key': 'problems_attempted', 'sortable': True},\
		{'key': 'problems_solved', 'sortable': True},\
		{'key': 'solved_with_minimum_steps', 'sortable': True},\
		{'key': 'solved_with_undos', 'sortable': True}]

	records = []
	for record_raw in records_raw :
		record = {}
		for i, field in enumerate(fields) :
			record[field['key']] = record_raw[i]
		records.append(record)

	return jsonify({'fields': fields, 'records': records})


@app.route('/api/class/records/equation', methods=['GET'])
def get_class_records_equation() :
	class_id = request.args.get('classId')

	conn, curs = connect_db()
	curs.execute('''SELECT u.username, COUNT(*),\
					COUNT(CASE WHEN steps_used NOT NULL THEN id END),\
					COUNT(CASE WHEN steps_used = min_steps THEN id END),\
					COUNT(CASE WHEN undos_used > 1 THEN id END)\
					FROM tbl_skill_works s INNER JOIN tbl_users u ON s.user_id = u.user_id\
					WHERE class_id = ? AND skill_id = 1 GROUP BY username''', (class_id,))
	records_raw = curs.fetchall()
	close_db(conn)
	fields = [
		{'key': 'username', 'sortable': True},\
		{'key': 'problems_attempted', 'sortable': True},\
		{'key': 'problems_solved', 'sortable': True},\
		{'key': 'solved_with_minimum_steps', 'sortable': True},\
		{'key': 'solved_with_undos', 'sortable': True}]

	records = []
	for record_raw in records_raw :
		record = {}
		for i, field in enumerate(fields) :
			record[field['key']] = record_raw[i]
		records.append(record)

	return jsonify({'fields': fields, 'records': records})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path) :
    return render_template("index.html")

######
######

@app.route('/api/class/join', methods=['POST'])
def join_class() :
	code = request.json['code']

	conn, curs = connect_db()
	curs.execute('''SELECT class_id FROM tbl_classes WHERE class_code = ?''', (code,))
	data = curs.fetchone()
	if not data :
		response = { 'success': False }
	else :
		response = { 'success': True, 'class_id': data[0] }
	close_db(conn)

	print(data)

	return jsonify(response)


def connect_db() :
	conn = sqlite3.connect(DATABASE)
	curs = conn.cursor()
	return conn, curs

def close_db(conn) :
	conn.commit()
	conn.close()

def create_class_code(user_id) :
	base = random.randint(10000, 99999)
	return str(base) + '_' + str(user_id % 100)
