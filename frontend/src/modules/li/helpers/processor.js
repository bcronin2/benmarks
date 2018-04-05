import utils from './utils.js'

export default {
	makeTerm (degree, numerator, denominator) {
		return { degree: degree, numerator: numerator, denominator: denominator }
	},
	makeOperation (operator, operand) {
		return { operator: operator, operand: operand }
	},
	getCoefficients (step) {
		var coeffs = [[0, 0], [0, 0]]
		var sides = [step.lside, step.rside]
		sides.forEach(function (side, index) {
			side.forEach(function (term) {
				if (term.degree === 1) {
					coeffs[index][1] += term.numerator / term.denominator
				}
				else if (term.degree === 0) {
					coeffs[index][0] += term.numerator / term.denominator
				}
			})
		})
		return coeffs
	},
	combineTerms (terms, operand, operator) {
		var newTerms = []
		if (operator === 'add' || operator === 'subtract') {
			var combined = false
			terms.forEach(function (term, index, array) {
				if (term.degree === operand.degree) {
					combined = true
					if (operator === 'add') {
						newTerms.push(this.addTerms(term, operand))
					}
					else if (operator === 'subtract') {
						newTerms.push(this.addTerms(term, this.makeTerm(operand.degree, -operand.numerator, operand.denominator)))
					}
				}
				else {
					newTerms.push(term)
				}
				if (index === array.length - 1 && !combined) {
					newTerms.push(this.makeTerm(operand.degree, (operator === 'add' ? operand.denominator : -operand.denominator),
						operand.denominator))
				}
			}, this)
		}
		else if (operator === 'multiply' || operator === 'divide') {
			terms.forEach(function (term) {
				if (operator === 'multiply') {
					newTerms.push(this.multiplyTerms(term, operand))
				}
				else if (operator === 'divide') {
					newTerms.push(this.multiplyTerms(term,
						this.makeTerm(-operand.degree, operand.denominator, operand.numerator)))
				}
			}, this)
		}
		return newTerms
	},
	addTerms (term1, term2) {
		var newTerm = {}
		if (term1.denominator === term2.denominator) {
			newTerm.numerator = term1.numerator + term2.numerator
			newTerm.denominator = term1.denominator
		}
		else {
			var d = utils.lcm(term1.denominator, term2.denominator)
			newTerm.numerator = term1.numerator * (d / term1.denominator) + term2.numerator * (d / term2.denominator)
			newTerm.denominator = d
		}
		newTerm.degree = term1.degree
		return newTerm
	},
	multiplyTerms (term1, term2) {
		var newTerm = {}
		newTerm.degree = term1.degree + term2.degree
		if (term1.numerator !== 0) {
			newTerm.numerator = term1.numerator * term2.numerator
			newTerm.denominator = term1.denominator * term2.denominator
		}
		else {
			newTerm.numerator = 0
			newTerm.denominator = 1
		}
		return newTerm
	}
}
