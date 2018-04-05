import utils from './utils.js'
import processor from './processor.js'

export default {
	spc1: '&nbsp;',
	spc2: '&nbsp;&nbsp;',
	operators: {
		add: '+',
		subtract: '–',
		multiply: '×',
		divide: '÷'
	},
	renderSubstitution (expression, variable, solution) {
		var re = new RegExp('<em>' + variable + '</em>', 'g')
		return expression.replace(re, '<span style="font-style: normal">(' + this.renderTerm(solution) + ')</span>')
	},
	renderEvaluation (terms, solution) {
		var newTerms = []
		terms.forEach(function (term) {
			var sNum = Math.pow(solution.numerator, term.degree)
			var sDen = Math.pow(solution.denominator, term.degree)
			newTerms.push(processor.makeTerm(0, term.numerator * sNum, term.denominator * sDen))
		})
		return this.renderTerms(newTerms)
	},
	renderFinal (terms, solution) {
		var newTerms = []
		terms.forEach(function (term) {
			var sNum = Math.pow(solution.numerator, term.degree)
			var sDen = Math.pow(solution.denominator, term.degree)
			newTerms.push(processor.makeTerm(0, term.numerator * sNum, term.denominator * sDen))
		})
		var finalTerm = newTerms.pop()
		while (newTerms.length > 0) {
			finalTerm = processor.addTerms(finalTerm, newTerms.pop())
		}
		return this.renderTerm(finalTerm)
	},
	renderTerms (terms, variable) {
		var result = ''
		var numTerms = 0
		terms.forEach(function (term, index) {
			var newTerm = Object.assign({}, term)

			if (term.numerator === 0) return
			if (numTerms > 0) {
				if (term.numerator > 0) {
					result += this.spc2 + this.operators.add + this.spc2
				}
				else if (term.numerator < 0) {
					result += this.spc2 + this.operators.subtract + this.spc2
					newTerm.numerator = -term.numerator
				}
			}
			result += this.renderTerm(newTerm, variable)
			numTerms++
		}, this)
		if (result === '') result = '0'
		return result
	},
	renderOperation (operation, variable) {
		if (operation.operand) {
			return this.spc2 + this.operators[(operation.operator)] +
				this.spc1 + this.renderTerm(operation.operand, variable) + this.spc2
		}
		return ''
	},
	renderTerm (term, variable) {
		if (term === {}) {
			return
		}
		var d = utils.gcd(term.numerator, term.denominator)
		term.numerator = term.numerator / d
		term.denominator = term.denominator / d
		if (term.denominator < 0) {
			term.numerator = -term.numerator
			term.denominator = -term.denominator
		}
		var coefficientString = (term.denominator === 1)
			? (term.numerator / term.denominator).toString()
			: (term.numerator > 0 ? '' : '-') + this.renderFraction(term)
		var variableString = (term.degree === 0) ? '' : ((term.degree === 1) ? '<em>' + variable + '</em>'
			: '<em>' + variable + '</em><sup>' + term.degree + '</sup>')
		var result = (coefficientString === '1' && term.degree !== 0) ? variableString
			: ((coefficientString === '-1' && term.degree > 0) ? '-' + variableString
			: (coefficientString + variableString))
		return result.replace(/-/g, this.operators.subtract)
	},

	renderFraction (term) {
		return '<span class="fraction"><span class="numerator">' + Math.abs(term.numerator) +
			'</span><span class="denominator">' + term.denominator + '</span></span>'
	}
}
