pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev WARNING: This is a development/testing contract only.
 * This contract is not intended for production use and serves purely for development purposes.
 * Do not deploy this contract to mainnet or use it in production environments.
 */

contract Tether is ERC20, Ownable {
    constructor() ERC20("Tether", "USDT") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
