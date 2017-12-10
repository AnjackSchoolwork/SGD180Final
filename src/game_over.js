
var game_over = function () {

}

game_over.prototype = {

	preload: function () {

	},

	create: function () {
		game_over_text = this.game.add.text(0, 0, 'Game Over: You Died', { fontSize: '32px', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' })
		game_over_text.setTextBounds(0, (this.game.height / 2) - 100, this.game.width, 200)
	},

	update: function () {

	}

}