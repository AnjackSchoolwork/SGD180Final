// First create a simple init state to show a splash screen while things are loading
var init = function () {

}

init.prototype = {
	// Load splash screen image to display while startup state is loading in-game resources
	preload: function () {
		this.game.load.spritesheet('loading_anim', 'img/Loading_Anim.png', 512, 128)
	},

	create: function () {
		// Show an animated loading screen
		var splash = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'loading_anim')
		splash.anchor.set(0.5, 0.5)
		splash.animations.add('loading')
		splash.animations.play('loading', 2, true)
		this.game.state.start('Startup')
	}
}


function setup() {

	// Create the game object itself and add all the states
	var game = new Phaser.Game(800, 480, Phaser.AUTO, 'game_screen')
	game.state.add('Init', init)
	game.state.add('Startup', startup)
	game.state.add('Menu', menu)
	game.state.add('Game Play', game_play)
	game.state.add('Game Over', game_over)

	// Entry point
	game.state.start('Init')
}