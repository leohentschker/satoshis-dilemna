pragma solidity ^0.4.4;
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract SatoshisDilemna is Ownable {

	struct Game {
		bytes32 user1SubmissionHash;
		bytes32 user2SubmissionHash;
		uint256 value;
		uint256 timestamp;
		bool finished;
	}

	uint8 constant COLLUDE = 1;
	uint8 constant BETRAY = 2;

	uint256 cooperationFraction = 2;

	mapping (string => Game) games;

	function updateFraction(uint256 newFraction)
		onlyOwner()
	{
		cooperationFraction = newFraction;
	}

	function buildSubmissionHash(string gameID, address user1, uint8 user1Action) constant returns (bytes32 hash) {
		return sha256(gameID, user1, user1Action);
	}

	function submitResult(string gameID, bytes32 submissionHash) payable returns(bool success) {

		// get the associated game
		Game memory game = games[gameID];

		// set the timestamp
		if (game.timestamp == 0) {
			game.timestamp = now;
		}

		// set the value of the game
		if (game.value == 0) {
			game.value = msg.value;
		} else {
			require(msg.value >= game.value);
		}

		// set on of the submission hashes and return
		if (game.user1SubmissionHash == '') {
			game.user1SubmissionHash == submissionHash;
			return true;
		}
		if (game.user2SubmissionHash == '') {
			game.user1SubmissionHash == submissionHash;
			return true;
		}

		// error if the game is already done
		return false;
	}

	function finishGame(string gameID, address user1, uint8 user1Action, address user2, uint8 user2Action)
	{
		Game memory game = games[gameID];

		require(!game.finished);

		// use a zero knowledge proof to show we know the correct result
		require(
			buildSubmissionHash(gameID, user1, user1Action) == game.user1SubmissionHash &&
			buildSubmissionHash(gameID, user2, user2Action) == game.user1SubmissionHash
		);

		// mark the game as finished
		game.finished = true;


		// reward people based on the results
		uint256 cooperationReward = game.value * cooperationFraction / 10;
		if (user1Action == BETRAY) {

			if (user2Action == COLLUDE) {
				user1.transfer(game.value - cooperationReward);
			}
		} else {

			if (user2Action == COLLUDE) {
				uint256 playerValue = (game.value + cooperationReward) / 2;
				user1.transfer(playerValue);
				user2.transfer(playerValue);
			} else {
				user2.transfer(game.value - cooperationReward);
			}
		}
	}
}
