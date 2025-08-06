// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BasicNft is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    /// @notice Maximum number of tokens that can ever be minted
    uint256 public immutable maxSupply;
    /// @notice Price (in wei) to mint one token
    uint256 public immutable mintPrice;
    /// @dev Tracks how many have been minted so far
    uint256 private _tokenCounter;
    /// @dev Base URI for metadata (`baseTokenUri_ + tokenId + ".json"`)
    string private _baseTokenUri;

    /// @notice Emitted when a new token is minted
    event Minted(address indexed minter, uint256 indexed tokenId);
    /// @notice Emitted when the owner withdraws ETH from the contract
    event Withdrawn(address indexed owner, uint256 amount);

    /**
     * @param baseTokenUri_  The base URI for token metadata (must end with a slash)
     * @param maxSupply_     The total number of tokens allowed
     * @param mintPriceWei_  The price in wei to mint a single token
     */
    constructor(
        string memory baseTokenUri_,
        uint256 maxSupply_,
        uint256 mintPriceWei_
    ) ERC721("MembershipNFT", "MNFT") Ownable(msg.sender) {
        _baseTokenUri = baseTokenUri_;
        maxSupply = maxSupply_;
        mintPrice = mintPriceWei_;
        _tokenCounter = 0;
    }

    /// @dev Modifier to ensure tokens remain available
    modifier notSoldOut() {
        require(_tokenCounter < maxSupply, "SoldOut");
        _;
    }

    /// @dev Modifier to ensure the caller paid exactly the mint price
    modifier correctPrice() {
        require(msg.value == mintPrice, "WrongPrice");
        _;
    }

    /// @dev Modifier to ensure there is ETH in the contract for withdrawal
    modifier hasFunds() {
        require(address(this).balance > 0, "NoFunds");
        _;
    }

    /**
     * @notice Mint one NFT, requiring exact `mintPrice` payment
     * @dev Emits a {Minted} event
     */
    function mint()
        external
        payable
        notSoldOut
        correctPrice
    {
        uint256 tokenId = _tokenCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            string(
                abi.encodePacked(
                    _baseTokenUri,
                    tokenId.toString(),
                    ".json"
                )
            )
        );
        emit Minted(msg.sender, tokenId);
    }

    /**
     * @notice Withdraw all ETH from the contract to the owner
     * @dev Only callable by the owner; emits a {Withdrawn} event
     */
    function withdraw()
        external
        onlyOwner
        hasFunds
    {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit Withdrawn(owner(), balance);
    }

    /**
     * @notice Returns how many tokens have been minted so far
     */
    function totalSupply() external view returns (uint256) {
        return _tokenCounter;
    }

    /**
     * @notice Returns the maximum number of tokens allowed
     */
    function getMaxSupply() external view returns (uint256) {
        return maxSupply;
    }

    /**
     * @notice Returns the mint price in wei
     */
    function getMintPrice() external view returns (uint256) {
        return mintPrice;
    }

    /// @dev Override required by ERC721URIStorage
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @dev Override required to resolve multiple supportsInterface implementations
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}