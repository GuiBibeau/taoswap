// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

/**
 * @dev WARNING: This is a development/testing contract only.
 * This contract is not intended for production use and serves purely for development purposes.
 * Do not deploy this contract to mainnet or use it in production environments.
 */

/// @dev Interface for WTAO
interface IWTAO {
    /// @dev Emitted when TAO is deposited to the contract.
    event Deposit(address indexed from, uint256 amount);

    /// @dev Emitted when TAO is withdrawn from the contract.
    event Withdrawal(address indexed to, uint256 amount);

    /// @dev Emitted when tokens are transferred.
    event Transfer(address indexed from, address indexed to, uint256 value);

    /// @dev Emitted when allowance is set.
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /// @dev Returns the account balance of an account.
    function balanceOf(address account) external view returns (uint256);

    /// @dev Returns the amount of tokens that spender is allowed to use on behalf of owner.
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    /// @dev Returns the current nonce for the given account.
    function getNonce(address owner) external view returns (uint256);

    /// @dev Returns the amount of tokens in existence.
    function totalSupply() external view returns (uint256);

    /// @dev Returns the current amount of flash-minted WTAO.
    function flashMinted() external view returns (uint256);

    /// @dev Deposits TAO to the contract and mints WTAO.
    function deposit() external payable;

    /// @dev Withdraws TAO from the contract by burning WTAO.
    function withdraw(uint256 value) external;

    /// @dev Sets amount as the allowance of spender over the caller's tokens.
    function approve(address spender, uint256 value) external returns (bool);

    /// @dev Moves amount tokens from the caller's account to recipient.
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    /// @dev Moves amount tokens from sender to recipient using the allowance mechanism.
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}
