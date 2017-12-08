
var game_play = function () {
}

game_play.prototype = {
	init: function (controls_object) {
		// Get the controls from the previous state
		this.controls = controls_object
	},

	preload: function () {
		// Load test map
		this.game.load.tilemap('map_test', 'maps/Map_Test.json', null, Phaser.Tilemap.TILED_JSON)
		this.game.load.image('tileset_test', 'img/Tileset_Test.png')

		//cursors = this.game.input.keyboard.createCursorKeys()
	},

	create: function () {
		// Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		// Load the test map and tileset, with layer
		map = this.game.add.tilemap('map_test') // GAH global :(
		map.addTilesetImage('Tileset_Test', 'tileset_test')
		map.setCollisionBetween(0, 15)
		layer = map.createLayer('Tile Layer 1') // GAH global :(
		layer.resizeWorld()

		// Load entity objects (enemies, npcs)
		enemies = this.add.group()
		enemies.enableBody = true

		var object_list = map.objects['Object Layer 1']
		for (var index in object_list) {
			// First load entities
			if (object_list[index].type == "Slime") {
				var temp_entity = new Entity(this, enemies, object_list[index].x, object_list[index].y, "test_slime")

			}
			// Next load player
			else if (object_list[index].type == "Player") {
				player = new Player(this, object_list[index].x, object_list[index].y, "placeholder_player")

				player.fired_bullets = this.game.add.group()
				player.fired_bullets.enableBody = true

				
			}

			// Load interactable objects

			// Load pickup-able objects
		}


		// Configure the camera
		this.game.camera.follow(player.sprite)
	},

	update: function () {

		// Collisions
		hit_platform = this.game.physics.arcade.collide(player.sprite, layer)
		hit_enemies_platform = this.game.physics.arcade.collide(enemies, layer)
		hit_bullets = this.game.physics.arcade.collide(player.fired_bullets, layer, function (bullet, layer) {
			bullet.kill()
		})

		// Enemy pseudo-ai
		enemies.forEachExists(function (enemy) {
			enemy.entity.think(this, map, player.sprite)
		})

		// Movement & controls
		player.velocity_x = 0
		// Player control input
		checkInput(this.game, this.controls, player)

		// TODO: Terminal velocity for player
		player.fired_bullets.forEachDead(function (bullet) {
			bullet.destroy()
		}, this)
	}

}

function checkInput(game, controls, player) {
	// TODO: Pull these numbers from config file or constants object

	// Keyboard
	if (controls.left_key.isDown) {
		player.goLeft()
	}
	else if (controls.right_key.isDown) {
		player.goRight()
	}

	if (controls.jump_key.isDown && player.sprite.body.blocked.down && hit_platform) {
		player.jump()
	}

	if (controls.fire_key.isDown) {
		player.shoot(game)
	}

	// Gamepad



	// Mouse



}