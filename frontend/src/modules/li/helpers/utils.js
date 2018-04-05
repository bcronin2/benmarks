export default {
	randomValue (values) {
		return values[Math.floor(Math.random() * values.length)]
	},
	lcm (n, m) {
		return (n * m) / this.gcd(n, m)
	},
	gcd (n, m) {
		while (n % m !== 0) {
			var t = m
			m = n % m
			n = t
		}
		return m
	}
}
