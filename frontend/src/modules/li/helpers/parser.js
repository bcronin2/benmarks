export default {
	parseInput (operandInput, variable) {
		var operand = {}
		if (this.validateInput(operandInput, variable)) {
			var n = parseFloat(operandInput)
			if (!isNaN(n)) {
				operand.numerator = n
			}
			else if (operandInput.startsWith('-')) {
				operand.numerator = -1
			}
			else operand.numerator = 1

			if (operandInput.includes('/')) {
				var parts = operandInput.split('/')
				operand.numerator = parseFloat(parts[0])
				operand.denominator = parseFloat(parts[1])
			}
			else operand.denominator = 1
			if (operandInput.includes(variable)) {
				operand.degree = 1
			}
			else operand.degree = 0
		}
		return operand
	},
	validateInput (input, variable) {
		var termTemplate1 = new RegExp('^-{0,1}[1-9]\\d*([./]\\d+){0,1}' + variable + '{0,1}$')
		var termTemplate2 = new RegExp('^-{0,1}[1-9]\\d*' + variable + '{0,1}([/]\\d+)$')
		var termTemplate3 = new RegExp('^-{0,1}' + variable + '$')
		return termTemplate1.test(input) || termTemplate2.test(input) || termTemplate3.test(input)
	}
}
