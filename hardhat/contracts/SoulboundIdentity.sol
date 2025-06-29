// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundIdentity is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Mapping to store token URIs
    mapping(uint256 => string) private _tokenURIs;

    event IdentityMinted(address indexed to, uint256 indexed tokenId);

    // Constructor for OpenZeppelin v5.x
    constructor(address initialOwner)
        ERC721("Soulbound Identity", "SBID")
        Ownable(initialOwner)
    {}

    // --- Core Functions ---

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit IdentityMinted(to, tokenId);
    }

    // Internal function to set token URI
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI set for nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    // Override tokenURI to return the stored URI
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        
        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via string.concat).
        if (bytes(_tokenURI).length > 0) {
            return string.concat(base, _tokenURI);
        }

        return super.tokenURI(tokenId);
    }

    // --- Soulbound Logic ---
    
    /**
     * @dev Override _update to prevent transfers after minting
     * This is the modern way to implement soulbound tokens in OpenZeppelin v5.x
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from address 0) but prevent all other transfers
        if (from != address(0) && to != address(0)) {
            revert("SoulboundIdentity: token is non-transferable");
        }
        
        return super._update(to, tokenId, auth);
    }

    // Override approve functions to prevent approvals (optional but recommended for soulbound tokens)
    function approve(address, uint256) public virtual override {
        revert("SoulboundIdentity: token is non-transferable");
    }

    function setApprovalForAll(address, bool) public virtual override {
        revert("SoulboundIdentity: token is non-transferable");
    }

    // Additional utility functions
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}