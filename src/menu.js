/*
	TODO:
		-	Level select screen
		-	Options menu
		-	Help screen
		-	Achievements
		-	Pause menu
*/

// This will handle both the initial "start game" menu as well as any pause (or inventory) menus
var menu = function () {

}

menu.prototype = {
	init: function (controls_obj) {
		// Get the controls from the previous state
		this.controls = controls_obj
	},

	preload: function () {
		// Static background color, need to define in a config or constants file
		this.game.stage.backgroundColor = '#66B2AF'
	},

	create: function () {
		// Audio
		this.menu_sound = this.game.add.audio('Select')
		this.game.menu_music = this.game.add.audio('Menu Music')
		this.game.menu_music.loop = true
		this.game.menu_music.play()

		// Display the title image along with option buttons
		// TODO: Check to see if menu is loaded during game and adjust content accordingly
		var logo_title = this.game.add.sprite(
			this.game.world.width / 2,
			this.game.world.height / 3,
			'logo_title')
		logo_title.anchor.set(0.5, 0.5)

		var button_play = this.game.add.button(
			this.game.world.width / 2, (this.game.world.height / 3) * 2, 
			'button_play', this.clickButtonPlay, this, 0, 0, 1)
		button_play.anchor.set(0.5, 0.5)
		
	},

	update: function () {

	},

	// Start the actual gameplay
	// TODO: Reset player and level data
	clickButtonPlay: function () {
		this.game.menu_music.stop()
		// Play the sound
		this.menu_sound.play()
		// Pass the controls object to the next state because I don't like global variables
		this.game.state.start('Game Play', true, false, this.controls)
	}
}

