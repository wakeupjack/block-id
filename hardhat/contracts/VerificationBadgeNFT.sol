// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SoulboundIdentity.sol";

contract VerificationBadgeNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    SoulboundIdentity public soulboundIdentity;

    // Mapping to store token URIs
    mapping(uint256 => string) private _tokenURIs;
    
    // Mapping to track which addresses have already minted a badge
    mapping(address => bool) public hasMintedBadge;
    
    // Mapping to store the reference to the SoulboundIdentity token
    mapping(uint256 => uint256) public badgeToSoulboundToken;

    event BadgeMinted(address indexed to, uint256 indexed tokenId, uint256 indexed soulboundTokenId);

    // Constructor for OpenZeppelin v5.x
    constructor(address initialOwner, address _soulboundIdentity)
        ERC721("Verification Badge", "VBADGE")
        Ownable(initialOwner)
    {
        soulboundIdentity = SoulboundIdentity(_soulboundIdentity);
    }

    // --- Core Functions ---

    /**
     * @dev Mint a badge NFT to a verified identity holder
     * @param to The address to mint the badge to
     * @param uri The metadata URI for the badge
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        require(soulboundIdentity.balanceOf(to) > 0, "VerificationBadgeNFT: Address must have a verified identity");
        require(!hasMintedBadge[to], "VerificationBadgeNFT: Address has already minted a badge");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Mark that this address has minted a badge
        hasMintedBadge[to] = true;
        
        // Store reference to soulbound token (assuming one per address)
        // This is a simplified approach - in production you might want to specify which soulbound token
        badgeToSoulboundToken[tokenId] = 0; // Placeholder - could be enhanced to track specific token ID
        
        emit BadgeMinted(to, tokenId, 0);
    }

    /**
     * @dev Allow verified identity holders to mint their own badge
     * @param uri The metadata URI for the badge
     */
    function mintBadge(string memory uri) public {
        require(soulboundIdentity.balanceOf(msg.sender) > 0, "VerificationBadgeNFT: You must have a verified identity");
        require(!hasMintedBadge[msg.sender], "VerificationBadgeNFT: You have already minted a badge");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Mark that this address has minted a badge
        hasMintedBadge[msg.sender] = true;
        
        // Store reference to soulbound token
        badgeToSoulboundToken[tokenId] = 0; // Placeholder
        
        emit BadgeMinted(msg.sender, tokenId, 0);
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

    // --- Utility Functions ---

    /**
     * @dev Check if an address is eligible to mint a badge
     * @param addr The address to check
     * @return bool True if eligible, false otherwise
     */
    function isEligibleForBadge(address addr) public view returns (bool) {
        return soulboundIdentity.balanceOf(addr) > 0 && !hasMintedBadge[addr];
    }

    /**
     * @dev Get the total supply of badges
     * @return uint256 The total number of badges minted
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Check if a token exists
     * @param tokenId The token ID to check
     * @return bool True if token exists, false otherwise
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Get the soulbound token reference for a badge
     * @param tokenId The badge token ID
     * @return uint256 The referenced soulbound token ID
     */
    function getSoulboundTokenReference(uint256 tokenId) public view returns (uint256) {
        require(exists(tokenId), "VerificationBadgeNFT: Token does not exist");
        return badgeToSoulboundToken[tokenId];
    }

    // --- Admin Functions ---

    /**
     * @dev Update the SoulboundIdentity contract address (admin only)
     * @param _soulboundIdentity The new SoulboundIdentity contract address
     */
    function updateSoulboundIdentity(address _soulboundIdentity) public onlyOwner {
        soulboundIdentity = SoulboundIdentity(_soulboundIdentity);
    }
}