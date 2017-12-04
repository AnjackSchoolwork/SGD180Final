/*
	Hardcoded startup loading state.
	TODO: Create a dynamic "loading" state for use here as well as prior to each level
	TODO: Need to load config file or constants class
*/

var startup = function () {

}

startup.prototype = {

	preload: function () {
		// Load all images and spritesheets or atlases (except map data)
		this.game.load.image('logo_title', 'img/Logo_Title.png', 512, 128)
		this.game.load.spritesheet('button_play', 'img/Button_Play.png', 128, 64)
		this.game.load.image('placeholder_player', 'img/Placeholder_Player.png', 32, 52)

		// Load all sound effects

		// Music and tilesets will be loaded per-level

		// Define controls
		// Static for now, need to change
		var controls = {}
		controls.left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
		controls.right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
		controls.up_key = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
		controls.down_key = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
		controls.jump_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)


		this.controls = controls
	},

	create: function () {
		// Pass the controls object to the next state because I don't like global variables
		this.game.state.start('Menu', true, false, this.controls)
	}
}