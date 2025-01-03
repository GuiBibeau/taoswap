// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "./interfaces/IWTAO.sol";

/**
 * @dev WARNING: This is a development/testing contract only.
 * This contract is not intended for production use and serves purely for development purposes.
 * Do not deploy this contract to mainnet or use it in production environments.
 */

/// @dev WTAO is an ERC20 token that wraps TAO. Adapted from WETH10
contract WTAO is IWTAO {
    string public constant name = "Wrapped TAO";
    string public constant symbol = "WTAO";
    uint8 public constant decimals = 18;

    bytes32 private constant PERMIT_TYPEHASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );
    uint256 private immutable INITIAL_CHAIN_ID;
    bytes32 private immutable INITIAL_DOMAIN_SEPARATOR;
    mapping(address => uint256) public nonces;

    /// @dev Records amount of WTAO owned by account.
    mapping(address => uint256) private _balanceOf;

    /// @dev Records number of WTAO allowed for a spender by an owner.
    mapping(address => mapping(address => uint256)) private _allowance;

    /// @dev Current amount of flash-minted WTAO.
    uint256 private _flashMinted;

    constructor() {
        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = computeDomainSeparator();
    }

    receive() external payable {
        deposit();
    }

    function deposit() public payable override {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 value) external override {
        _burn(msg.sender, value);
        emit Withdrawal(msg.sender, value);
        payable(msg.sender).transfer(value);
    }

    function totalSupply() external view override returns (uint256) {
        return address(this).balance + _flashMinted;
    }

    function balanceOf(
        address account
    ) external view override returns (uint256) {
        return _balanceOf[account];
    }

    function allowance(
        address owner,
        address spender
    ) external view override returns (uint256) {
        return _allowance[owner][spender];
    }

    function getNonce(address owner) external view override returns (uint256) {
        return nonces[owner];
    }

    function flashMinted() external view override returns (uint256) {
        return _flashMinted;
    }

    function approve(
        address spender,
        uint256 value
    ) external override returns (bool) {
        _allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transfer(
        address to,
        uint256 value
    ) external override returns (bool) {
        require(
            to != address(0) && to != address(this),
            "WTAO: invalid recipient"
        );
        uint256 balance = _balanceOf[msg.sender];
        require(balance >= value, "WTAO: insufficient balance");

        _balanceOf[msg.sender] = balance - value;
        _balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external override returns (bool) {
        require(
            to != address(0) && to != address(this),
            "WTAO: invalid recipient"
        );
        uint256 balance = _balanceOf[from];
        require(balance >= value, "WTAO: insufficient balance");

        if (from != msg.sender) {
            uint256 allowed = _allowance[from][msg.sender];
            if (allowed != type(uint256).max) {
                require(allowed >= value, "WTAO: insufficient allowance");
                _allowance[from][msg.sender] = allowed - value;
            }
        }

        _balanceOf[from] = balance - value;
        _balanceOf[to] += value;

        emit Transfer(from, to, value);
        return true;
    }

    function _mint(address account, uint256 value) internal {
        _balanceOf[account] += value;
        emit Transfer(address(0), account, value);
    }

    function _burn(address account, uint256 value) internal {
        _balanceOf[account] -= value;
        emit Transfer(account, address(0), value);
    }

    function computeDomainSeparator() internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256(
                        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                    ),
                    keccak256(bytes(name)),
                    keccak256(bytes("1")),
                    block.chainid,
                    address(this)
                )
            );
    }
}
