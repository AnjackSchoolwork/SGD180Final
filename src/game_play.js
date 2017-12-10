
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
		this.game.load.image('tileset_one', 'img/Tileset_one.png')
	},

	create: function () {

		this.stage.backgroundColor = '#838383'

		// Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE)
		this.game.physics.arcade.sortDirection = Phaser.Physics.Arcade.SORT_NONE

		// Load the test map and tileset, with layer
		map = this.game.add.tilemap('map_test') // GAH global :(
		map.addTilesetImage('Tileset_One', 'tileset_one')
		map.setCollisionBetween(0, 40)
		layer = map.createLayer('Tile Layer 1') // GAH global :(
		layer.resizeWorld()

		// Load entity objects (enemies, npcs)
		enemies = this.add.group()
		enemies.enableBody = true

		// Doors
		doors = this.add.group()
		doors.enableBody = true

		var object_list = map.objects['Object Layer 1']
		for (var index in object_list) {
			// First load entities
			if (object_list[index].type == 'Slime') {
				var temp_entity = new Entity(this, enemies, object_list[index].x, object_list[index].y, "test_slime")

			}
			// Next load player
			else if (object_list[index].type == 'Player') {
				player = new Player(this, object_list[index].x, object_list[index].y, "placeholder_player")

				player.fired_bullets = this.game.add.group()
				player.fired_bullets.enableBody = true

				
			}
			// We got doors!
			else if (object_list[index].type == 'door') {
				var temp_sprite = doors.create(object_list[index].x, object_list[index].y, object_list[index].name)
				temp_sprite.anchor.set(0.5, 0.5)
				temp_sprite.key = object_list[index].name
				temp_sprite.body.immovable = true
			}

			// Load interactable objects

			// Load pickup-able objects
		}


		// Configure the camera
		this.game.camera.follow(player.sprite)
		this.game.camera.deadzone = new Phaser.Rectangle(
			this.game.camera.width / 4,
			this.game.camera.height / 3,
			this.game.camera.width - (this.game.camera.width / 2),
			this.game.camera.height - (this.game.camera.height / 1.5)
		)
	},

	update: function () {

		// Collisions
		hit_platform = this.game.physics.arcade.collide(player.sprite, layer)
		this.game.physics.arcade.collide(enemies, layer)
		this.game.physics.arcade.collide(player.fired_bullets, layer, function (bullet, layer) {
			bullet.kill()
		})
		this.game.physics.arcade.collide(player.fired_bullets, enemies, function (bullet, enemy) {
			bullet.kill()
			enemy.entity.handleDamage(null, 30)
		})
		this.game.physics.arcade.collide(player.sprite, doors, checkDoorKey)

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

/*
* Check to see if player has appropriate key for collided door.
*
*/
function checkDoorKey(player, door) {
	for (var index in player.entity.key_ring) {
		if (player.entity.key_ring[index] == door.key) {
			console.log("OPEN SESAME")
			door.kill()
			return
		}
	}
	console.log("UNAUTHORIZED")
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