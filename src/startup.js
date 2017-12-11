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
		this.game.load.spritesheet('test_slime', 'img/Test_Slime_Sheet.png', 32, 32)
		this.game.load.spritesheet('test_bullet', 'img/Test_Bullet_Sheet.png', 32, 16)
		this.game.load.image('Door1', 'img/Keyed_Door_Base.png')
		this.game.load.image('pickup_placeholder', 'img/Pickup_Placeholder.png')
		this.game.load.image('Key1', 'img/Key_Base.png')
		this.game.load.spritesheet('Door_Big', 'img/Doors_Big.png', 64, 64)
		this.game.load.spritesheet('Bat_Base', 'img/Bat_Base.png', 32, 32)
		
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
		controls.use_key = this.game.input.keyboard.addKey(Phaser.Keyboard.F)
		controls.enter_key = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)

		this.controls = controls
	},

	create: function () {
		// Pass the controls object to the next state because I don't like global variables
		this.game.state.start('Menu', true, false, this.controls)
	}
}