// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BasicNft is ERC721URIStorage {
    error SoldOut();
    error WrongPrice();

    uint256 public immutable maxSupply;
    uint256 public immutable mintPrice;
    uint256 private _tokenCounter;
    string private _baseTokenUri;
    address public owner;

    constructor(string memory baseTokenUri_, uint256 maxSupply_, uint256 mintPriceWei_)
        ERC721("MembershipNFT", "MNFT")
    {
        _baseTokenUri = baseTokenUri_;
        maxSupply = maxSupply_;
        mintPrice = mintPriceWei_;
        _tokenCounter = 0;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @dev public payable mint, no args
    function mint() external payable {
        if (_tokenCounter >= maxSupply) revert SoldOut();
        if (msg.value != mintPrice) revert WrongPrice();

        uint256 tokenId = _tokenCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenUri, Strings.toString(tokenId), ".json")));
    }

    /// @dev Allows only the contract owner to withdraw ETH from the contract
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /// @dev how many tokens have been minted so far
    function totalSupply() external view returns (uint256) {
        return _tokenCounter;
    }

    /// @dev get the maximum supply of tokens
    function getMaxSupply() external view returns (uint256) {
        return maxSupply;
    }

     /// @dev get the maximum supply of tokens
    function getMintPrice() external view returns (uint256) {
        return mintPrice;
    }
}
