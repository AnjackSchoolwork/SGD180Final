
var game_over = function () {

}

game_over.prototype = {

	init: function (controls, exit_message) {
		// Get the controls from the previous state
		this.message = exit_message
		this.controls = controls
	},

	preload: function () {

	},

	create: function () {
		game_over_message = this.game.add.text(0, 0, 'Game Over: ' + this.message, { fontSize: '32px', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' })
		game_over_message.setTextBounds(0, (this.game.height / 2) - 100, this.game.width, 200)

		game_over_instructions = this.game.add.text(0, 0, 'Press ENTER to restart.', { fontSize: '24px', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' })
		game_over_instructions.setTextBounds(0, (this.game.height / 2), this.game.width, 200)
	},

	update: function () {
		if (this.controls.enter_key.isDown) {
			returnToMenu(this.game, this.controls)
		}
	}

}

function returnToMenu(game, controls) {
	//game.state.start('Menu', true, false, controls)
	location.reload()
}